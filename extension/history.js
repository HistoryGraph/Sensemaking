
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
// the earliest time of a node
var earliestTime;
// the latest time for a node
var latestTime;

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
        // console.log("fromId: " + fromId + " visitId: " + visitItem.visitId + " fromIndex: " + fromIndex + " currentIndex: " + currentIndex + " transition: " + visitItem.transition);
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
    var historyItem = theUrls[currentIndex];
    var title = historyItem.title;
    if (historyItem.url != undefined && historyItem.title != undefined
        && curUrl.substring(0, Math.min(22, curUrl.length)) != "https://www.google.com") {

        if (title.length <= 0) {
            // use url as title for no-title pages
            title = curUrl.replace(/.*?:\/\//g, ""); // taking out http://
        }
        nodes.push({"id" : currentIndex, 
            "url" : curUrl, 
            "title" : title, 
            "shortName" : title.substring(0, Math.min(12, title.length)),
            "recentVisit" : historyItem.lastVisitTime,
            "totalVisits" : visits.length,
            "typedCount" : historyItem.typedCount});

        // update earliest and latest times. will use later
        if (earliestTime == undefined || latestTime == undefined) {
            earliestTime = historyItem.lastVisitTime;
            latestTime = historyItem.lastVisitTime;
        } else {
            earliestTime = Math.min(earliestTime, historyItem.lastVisitTime);
            latestTime = Math.max(latestTime, historyItem.lastVisitTime);
        }

        // loop through all visits to a page, set visit id
        for (var i = 0; i < visits.length; i++) {
            var visitItem = visits[i];
            // the item's id (use later)
            var visitId = visitItem.visitId;
            visitIdToNodeIndex[visitId.toString()] = currentIndex;
        }
        // console.log(visitIdToNodeIndex);

        // look for previous node of this root url. if found, make an edge
        // var urlParts = curUrl.split('/');
        // for (var i = nodes.length - 2; i >= 0; i--) {
        //     var prevParts = nodes[i].url.split('/');
        //     if (prevParts[2] == urlParts[2]) {
        //         edges.push({"source" : i, "target" : currentIndex, "times" : [historyItem.lastVisitTime], "same" : true});
        //         break;
        //     }
        // }
    }
    // update the count
    currentIndex++;
    if (currentIndex >= total) {
        console.log("LATEST:", latestTime);
        console.log("EARLIEST:", earliestTime);
        // use earliest and latest time to give recency effect
        for (var i = 0; i < nodes.length; i++) {
            var scaled = ((nodes[i].recentVisit - earliestTime) / (latestTime - earliestTime)); // 0 to 1
            nodes[i].recency = (1 - scaled) * 0.8 + 0.2;
            console.log("recency ", nodes[i].recency);
        }

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




