
// all the HistoryItem's in history. This is Array<HistoryItem>
var theUrls;
// the max num of urls
var urlMax=1000000;
// hash table from visit id to HistoryItem
var visitIdToNodeIndex = {};
// The current url that we are processing
var curUrl;
// the total number of url's we loaded
var total;
// which url is currently being looked at (index to theUrls)
var currentIndex=0;

// the entire array of output nodes
var nodes = [];
// the entire array of output edges
var edges = [];

function formEdges(visits) {
    // loop through all visits to a page, form an edge
    for (var i = 0; i < visits.length; i++) {
        var visitItem = visits[i];
        var transition = visitItem.transition;
        // this is the timestamp to use!
        var timestamp = visitItem.visitTime;
        // the referrer's id
        // this is the from index!
        fromId = visitItem.referringVisitId.toString();
        fromIndex = visitIdToNodeIndex[visitItem.referringVisitId.toString()];
        console.log("fromId: " + fromId + " visitId: " + visitItem.visitId + " fromIndex: " + fromIndex + " currentIndex: " + currentIndex + " transition: " + visitItem.transition);
        // checks if the edges array already has an edge matching the current target/source
        // if it does add new timestamp of visit instead of new edge
        if (fromIndex != undefined){
            for (var j = 0; j < edges.length; j++){
                if (edges[j].source == fromIndex && edges[j].target == currentIndex){
                    edges[j].times.push(timestamp);
                    break;
                }
            }
            // add this edge to edges!
            if (j == edges.length && fromIndex != currentIndex && transition != "reload"){
                edges.push({"source" : fromIndex, "target" : currentIndex, "times" : [timestamp]});
            }
        }
    }

    if (i == visits.length){
        // update the count
        currentIndex++;

        if (currentIndex >= total) {
            // finished reading, so write to local file
            var graph = {"nodes" : nodes, "edges" : edges};
            localStorage.historyGraph = JSON.stringify(graph);
            console.log(localStorage.historyGraph);
        } else {
            // get next url
            curUrl = theUrls[currentIndex].url;
            // recursive call to get visits
            chrome.history.getVisits({"url": curUrl}, formEdges);
        }
    }
}


function formNodes(visits) {
    // visits is an array of VisitItem

    // create a new node
    var title = theUrls[currentIndex].title;
    nodes.push({"id" : currentIndex, "url" : curUrl, "title" : title, "totalVisits" : visits.length});

    // loop through all visits to a page, form an edge
    for (var i = 0; i < visits.length; i++) {
        var visitItem = visits[i];
        // the item's id (use later)
        var visitId = visitItem.visitId;
        visitIdToNodeIndex[visitId.toString()] = currentIndex;
    }
    console.log(visitIdToNodeIndex);
    // update the count
    if (i == visits.length){
        currentIndex++;
        if (currentIndex >= total) {
            // done, so now form the edges
            currentIndex = 0;
            // set first current url
            curUrl = theUrls[currentIndex].url;
            chrome.history.getVisits({"url": curUrl}, formEdges);
        } else {
            // get next url
            curUrl = theUrls[currentIndex].url;
            // recursive call to get visits
            chrome.history.getVisits({"url": curUrl}, formNodes);
        }
    }
}

function gotURLs(urls){
    // urls is an array of HistoryItem
    theUrls = urls;
    // get the total number of urls
    total = (urlMax < urls.length? urlMax : urls.length);
    // initialize global counter
    currentIndex = 0;
    // set first current url
    curUrl = theUrls[currentIndex].url;
    // now get info from each url
    chrome.history.getVisits({"url": curUrl}, formNodes);
    console.log(total);
}   

// lookup all history entries!
chrome.history.search({"text": "", "maxResults" : urlMax}, gotURLs);
console.log("line 106");




