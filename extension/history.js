
// all the HistoryItem's in history. This is Array<HistoryItem>
var theUrls;
// the max num of urls
var urlMax=1000000;
// hash table from visit id to HistoryItem
var visitIdToNodeIndex={};
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
        // this is the timestamp to use!
        var timestamp = visitItem.visitTime;
        // the referrer's id
        var fromId = visitItem.referringVisitId;
        // this is the from index!
        fromIndex = visitIdToNodeIndex[fromId];
        // add this edge to edges!
        edges.push({"from" : fromIndex, "to" : currentIndex, "time" : timestamp});
    }

    // update the count
    currentIndex = currentIndex + 1;

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


function formNodes(visits) {
    // visits is an array of VisitItem

    // create a new node
    nodes.push({"url" : curUrl});

    // loop through all visits to a page, form an edge
    for (var i = 0; i < visits.length; i++) {
        var visitItem = visits[i];
        // the item's id (use later)
        var visitId = visitItem.visitId;
        visitIdToNodeIndex[visitId] = currentIndex;
    }

    // update the count
    currentIndex = currentIndex + 1;

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

function gotURLs(urls){
    // urls is an array of HistoryItem
    theUrls = urls;
    // get the total number of urls
    total = (urlMax < urls.length? urlMax : urls.length);
    // initialize global counter
    currentIndex = 0;
    // set first current url
    curUrl = theUrls[currentIndex].url;
    console.log(curUrl);
    // now get info from each url
    chrome.history.getVisits({"url": curUrl}, formNodes);
    console.log(total);
}   

// lookup all history entries!
chrome.history.search({"text": "", "maxResults" : urlMax}, gotURLs);




