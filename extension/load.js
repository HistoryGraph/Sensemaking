
 window.alert("jQuery is loaded!");

(function() {

if(localStorage["backcolor"]!=undefined){
    document.bgColor ="#"+localStorage["backcolor"];
}

if(localStorage["showAgain"]==undefined || localStorage["showAgain"]=="false"){
    var maBoiteDeDialogue3 = $('<div></div>').html(chrome.i18n.getMessage("firstLogin")/*+"<br><input type=\"checkbox\" id=\"showAgain\" value=\"noShow\" onclick=\"showAgainSwitch()\"> "+"Show this next time"*/).dialog({ autoOpen: false, title: chrome.i18n.getMessage("firstLoginTitle"), width: 460 });
    $("#showAgain").attr("checked", localStorage["showAgain"]=="true");
    if(localStorage["showAgain"]==undefined)
        localStorage["showAgain"]="false";
    maBoiteDeDialogue3.dialog('open');
    localStorage["showAgain"]="true";
}

function showAgainSwitch(){
    //alert($("#showAgain").attr("checked"));
    localStorage["showAgain"]=$("#showAgain").attr("checked");
}

if(localStorage["chargeConstant"]==undefined){
  localStorage["chargeConstant"]=(-80);
  localStorage["dragConstant"] =0.06;
  localStorage["springConstant"]=0.05;
  localStorage["chargeMaxDistance"]=600;
  localStorage["springLength"] =150;
}

$( "#subdomainLabel" ).html(chrome.i18n.getMessage("subdomain"));
$( "#domainLabel" ).html(chrome.i18n.getMessage("domain"));
$( "#repeat" ).buttonset();
var milsec;
var minvisit;
if((localStorage["labels"]==undefined) || (localStorage["labels"]=="true")){
    localStorage["labels"]="true";
}else{localStorage["labels"]="false";}
if(localStorage["minvisit"]==undefined){
    localStorage["minvisit"]=1;
    minvisit=1;
}
else{}
if(localStorage["milsec"]==undefined){
    localStorage["milsec"]=3600000;
    milsec=3600000;
}
else{milsec=localStorage["milsec"];}

$("#labels").attr('checked', (localStorage["labels"]=="false")?false:true);

$( "#labels" ).button().click(function(){
                                    localStorage["labels"]=$(this).attr("checked");
                                });

$( "#refresh" ).html(chrome.i18n.getMessage("refresh"));
$( "#refresh" ).button();
$( "#labels" ).button();
$( "#openOptions" ).button();
$( "#histInter" ).html(chrome.i18n.getMessage("historyInterval"));

function focus1(){
    $('#expor').focus();$('#expor').select();
}
function focus2(){
    $('#gexfExp').focus();$('#gexfExp').select();
}

//$( "#opener" ).html(chrome.i18n.getMessage("buttonAbout"));
//$( "#opener" ).button();
var maBoiteDeDialogue2 = $('<div></div>').html( chrome.i18n.getMessage("pajekHeader") +"<br><textarea id=\"expor\" rows=\"7\" cols=\"45\">.net or GEXF here soon</textarea><br>"+chrome.i18n.getMessage("gexfHeader")+"<br><textarea id=\"gexfExp\" rows=\"7\" cols=\"45\">.net or GEXF here soon</textarea>").dialog({ autoOpen: false, title: chrome.i18n.getMessage("buttonExport"), width: 420 });

$( "#openOptions" ).click(function() {window.open('options.html','_newtab');});
$( "#exporter" ).html(chrome.i18n.getMessage("buttonExport"));
$('#exporter').click(function() {
    var res="*Vertices "+mesDonnees.nodes.length+"\n";
    var resGexf='<?xml version="1.0" encoding="UTF-8"?>\n<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2">\n    <graph mode="dynamic" defaultedgetype="directed" timeformat="double">\n<nodes>';
    //alert(now+"-"+theLimit+"-"+mesDonnees.nodes[15].group)
    var factor=10000;
    var endDate=(now-theLimit)/factor;
    for (var i in mesDonnees.nodes){
        var startDate=(mesDonnees.nodes[i].group-theLimit>0?(mesDonnees.nodes[i].group-theLimit)/factor:0);
        res=res+(parseInt(i)+1)+ "  \"" +mesDonnees.nodes[i].nodeName+"\"\n";
        resGexf+='<node id="'+i+'" label="'+mesDonnees.nodes[i].nodeName+'" start="'+/*new Date(*/startDate/*.toISOString()*/  +'" end="'+endDate+'"/>\n';
    }
    
    res=res+"*Arcs\n";
    resGexf+='</nodes>\n        <edges>\n';
    for (var i in mesDonnees.links){
        var indice=parseInt(mesDonnees.links[i].source)+1;
        res=res+ indice+" "+(mesDonnees.links[i].target+1)+"\n";
        
        resGexf+='<edge id="'+i+'" source="'+(indice-1)+'" target="'+(mesDonnees.links[i].target)+'" />\n';
    }
    
    
    resGexf+='        </edges>\n    </graph>\n</gexf>';
    maBoiteDeDialogue2.dialog('open');
    
    $('#expor').html(res);
    $('#gexfExp').html(resGexf);
    $('#expor').focus();
    $('#expor').select();
    return;
});
$( "#exporter" ).button();


//$( "#exporter" ).button({text: chrome.i18n.getMessage("buttonExport")});
//$( "#opener" ).button({text: chrome.i18n.getMessage("buttonAbout")});//.text( chrome.i18n.getMessage("buttonAbout"));

//$('#exporter').html(chrome.i18n.getMessage("buttonExport"));


jQuery(document).ready(function() {
  //jQuery(".content").hide();
  //toggle the componenet with class msg_body
  jQuery("#heading").click(function()
  {
    jQuery(this).next(".content").slideToggle(15);
  });
});
$("#progressbar").progressbar({ value: 0 });

function switchGrouping(){
    localStorage["entireUrl"] = $('input[type=radio][name=repeat]:checked').attr('id');
}

switch(localStorage["entireUrl"]){
    case "noGroup":
        //$( "#noGroup" ).button.checked=true;
        document.getElementById('noGroup').checked = true;
        //alert("nogroup");
        //document.forms['form'].type_lien[0].checked=true;
        break;
    case "domain":
        //$( "#domain" ).button.checked=true;
        document.getElementById('domain').checked = true;
        //alert("domain");
        break;
    default:
    //alert("autre"+localStorage["entireUrl"]);
}
$( "#domain").button("refresh");
$( "#noGroup").button("refresh");
$( "#subdomain").button("refresh");

var openedUrls=[];
function windowsGetAllCallback(winArray){
    for (var i in winArray){
        for (var j in winArray[i].tabs){
            openedUrls.push(simplifyUrl(winArray[i].tabs[j].url));
        }
    }
    //alert("urlOpenedOk "+JSON.stringify(openedUrls));
}
chrome.windows.getAll({"populate":true}, windowsGetAllCallback);

$("#titre").html(chrome.i18n.getMessage("corner_name"));
$("#heading").html(chrome.i18n.getMessage("collapsableHeader"));
//$('#refresh').html(chrome.i18n.getMessage("refresh"));

var now=(new Date()).getTime();

var theLimit=now-milsec;
//alert("Limit:"+theLimit);

var urlMax=1000000;
var w = document.body.clientWidth,
    h = document.body.clientHeight,
    colors = pv.Colors.category19();
//alert(w+"--"+h);

if(localStorage["backcolor"]!=undefined){
    document.bgColor ="#"+localStorage["backcolor"];
}
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .fillStyle((localStorage["backcolor"]!=undefined)?"#"+localStorage["backcolor"]:"white")//document.bgColor
    .event("mousedown", pv.Behavior.pan())
    .event("mousewheel", pv.Behavior.zoom(4));

var theUrls=0;


    
var mesDonnees = {
  nodes:[   ],
  links:[]};

var hashUrlToId={};
var visitIdToUrl={};
var tabVisits=[];
var curUrl;
var max;

var globali=0;
var globalV=0;
var compte=0;

function sortVisits(a,b){
    return b.visitTime - a.visitTime;
}


var hashURLs={};

function toColor256(moment){
    return Math.floor((now-moment)*256/(now-theLimit));
}

function gotNextVisits(visits){
    //alert(globalV+"--"+globali+"--"+compte);
    //alert(JSON.stringify(hashURLs[simplifyUrl(curUrl)]));
    var simpCurUrl=simplifyUrl(curUrl)
    if(hashURLs[simpCurUrl] != undefined){
        hashURLs[simpCurUrl].push(curUrl);
        //alert(JSON.stringify(hashURLs[simplifyUrl(curUrl)]));
    }
    else{hashURLs[simpCurUrl]=[curUrl];}
    
    if((localStorage["minvisit"]!=undefined) && (localStorage["minvisit"]<=visits.length)){
        //alert("countVisit");
        for (i=0;i<visits.length;i++){
            visitIdToUrl[visits[i].id]=curUrl;
            //alert(curUrl+"-----"+visits[i].id);
        }
        
        tabVisits=tabVisits.concat(visits);
        if(!(simpCurUrl in hashUrlToId)){
            hashUrlToId[simpCurUrl]=globali;
            //"#00FF"+d.group.toString(16)
            //alert(now+"<>"+visits[0].visitTime);
            //alert((now-visits[0].visitTime)*256);
            //alert(theLimit);
            //alert(simplifyUrl(curUrl)+"<>"+Math.floor((now-visits[0].visitTime)*256/(now-theLimit)));
            mesDonnees.nodes.push({nodeName: simpCurUrl, group:((visits.length!=0)?(visits[0].visitTime):((now+theLimit)/2))});
            //mesDonnees.nodes.push({nodeName: simplifyUrl(curUrl), group: 2});
            //alert("#00FF"+((visits.length!=0)?Math.floor((now-visits[0].visitTime)*256/(now-theLimit)):128).toString(16));
            globali=globali+1;
        }   
        globalV=globalV+1;
    }
    compte=compte+1;
    if((globali==max)||compte>=theUrls.length)//theUrls.length)
        {
        fin(); return;}
    curUrl=theUrls[globalV].url;
    
    $( "#progressbar" ).progressbar({
            value: globalV*100/theUrls.length
        });
    chrome.history.getVisits({"url": theUrls[globalV].url}, gotNextVisits);
}

function gotURLs(urls){
    theUrls=urls;
    max=(urlMax<urls.length?urlMax:urls.length);
    curUrl=urls[globalV].url;
    chrome.history.getVisits({"url": curUrl}, gotNextVisits);
}   

/*function exporteur(){
    var bb = new BlobBuilder(); 
    bb.append("Lorem ipsum"); 
    var fileSaver = window.saveAs(bb.getBlob(), "test_file"); 
    fileSaver.onwriteend = myOnWriteEnd; 
}*/

function simplifyUrl(url){
    var baseURL;
    switch (localStorage["entireUrl"]) 
    {
    case "noGroup":
    baseURL = url;
    break;
    case "domain":
    //?:  \w*://(?:[^\./]*\.)*([^\./]*\.\w*)
    var expression = new RegExp("\w*://(?:[^\\./]*\\.)*([^\\./]*\\.\\w*)");
    //expression = new RegExp("^\w*://(?:[^\./]*\.)*([^\./]*\.\w*)/","");
    //expression = new RegExp("ht(\w)p:","");
    var m=expression.exec(url);
    //var m = re.exec(document.demoMatch.subject.value);
    
      if (m == null) {
        var expression2 = new RegExp("^(\\.*://)");
        var res=expression2.exec(url);
        if(res!=null) return res[1];
        else return url;
      } else {return m[1];}/*
        var s = "Match at position " + m.index + ":\n";
        for (i = 0; i < m.length; i++) {
          s = s + m[i] + "\n";
        }
        alert(s);
      }*/
/*
    for (i = 0; i < m.length; i++) {
      s = s + m[i] + "\n";
    }
    alert(s);*/
    //alert("tttt");
    //baseURL="tttt";
    break;
    case "subdomain":
    default:
    baseURL = url.substring(0, url.indexOf('/', 14));
    
    
    break; 
    }
    //var baseURL = (localStorage["entireUrl"]!=undefined)?url:url.substring(0, url.indexOf('/', 14));
    if (baseURL.indexOf('http://localhost') != -1) {
        // Base Url for localhost
        var url = location.href;  // window.location.href;
        var pathname = location.pathname;  // window.location.pathname;
        var index1 = url.indexOf(pathname);
        var index2 = url.indexOf("/", index1 + 1);
        var baseLocalUrl = url.substr(0, index2);

        return baseLocalUrl + "/";
    }
    else {
        // Root Url for domain name
        return (baseURL).replace("http://", "").replace("https://", "");
    }
}

function fin(){
    var hashLinks={};
    //alert("vis_len"+tabVisits.length);
    tabVisits.sort(sortVisits);
    //alert("sorted-----"+tabVisits.length);
    
    var i2=0;
    
    for (var i=1;i<tabVisits.length;i++){
        if(theLimit>tabVisits[i-1].visitTime){
            continue;
        }
        if(tabVisits[i].visitTime-tabVisits[i-1].visitTime<1200000){
            var urlNow=simplifyUrl(visitIdToUrl[tabVisits[i].id]);
            var urlPrevious=simplifyUrl(visitIdToUrl[tabVisits[i-1].id]);
            //alert(i+tabVisits[i].transition+urlNow+"---"+urlPrevious);
            if(urlNow!=urlPrevious){
                    if(!(((hashUrlToId[urlPrevious])+"-"+(hashUrlToId[urlNow])) in hashLinks)){
                        mesDonnees.links.push({source:(hashUrlToId[urlPrevious]), target:(hashUrlToId[urlNow]), value:1});
                        hashLinks[((hashUrlToId[urlPrevious])+"-"+(hashUrlToId[urlNow]))]=i2;
                        i2=i2+1;
                        //alert(urlNow+"-----"+urlPrevious);
                    }
                    else{
                        mesDonnees.links[hashLinks[((hashUrlToId[urlPrevious])+"-"+(hashUrlToId[urlNow]))]].value=mesDonnees.links[hashLinks[((hashUrlToId[urlPrevious])+"-"+(hashUrlToId[urlNow]))]].value+1;
                    }
            }
        }
    }

    /*for (var i=0;i<mesDonnees.nodes.length;i++){
        document.write(mesDonnees.nodes[i].nodeName+"<:"+hashUrlToId[mesDonnees.nodes[i].nodeName]+"<br>");
    
    }
    for (var i=0;i<mesDonnees.links.length;i++){
        document.write(mesDonnees.links[i].source+"-->"+mesDonnees.links[i].target+"<br>");
    
    }*/

    
    /*
    var miserables = {
      nodes:[
        {nodeName:"Myriel", group:1},
        {nodeName:"Napoleon", group:1},
        {nodeName:"Mlle. Baptistine", group:1}
        ],
      links:[
        {source:1, target:0, value:1},
        {source:2, target:0, value:8},
        {source:2, target:1, value:10},
        {source:1, target:2, value:6}]};*/
        
        
        
    //alert(JSON.stringify(mesDonnees, null, '\t'))
        
    
    //alert(mesDonnees.links[4].source+"----"+mesDonnees.links[4].target);
    //alert(mesDonnees.nodes[4].nodeName+"----"+mesDonnees.nodes[4].group);
    
    function toRealURL(url){
        return "<a target=\"_blank\" href=\"http://"+url.nodeName+"\">"+url.nodeName+"</a>";
    }
    function callbackUrlInfo(urlInfos){
            var res="";
            for (var i in urlInfos){
                if((urlInfos[i].url.match("^"+"http://"+clickedBaseUrl)=="http://"+clickedBaseUrl) || (urlInfos[i].url.match("^"+"https://"+clickedBaseUrl)=="https://"+clickedBaseUrl)){
                    var e= new Date(urlInfos[i].lastVisitTime); 
                    //if (e != null) {
                        e=e.getHours()+":"+e.getMinutes()+" "+e.toLocaleDateString();
                    //} 
                    res+="<p><img src=\"chrome://favicon/"+urlInfos[i].url+"\" /> <a target=\"_blank\" href=\""+urlInfos[i].url+"\">"+
                    ((urlInfos[i].title ? urlInfos[i].title : urlInfos[i].url))//+urlInfos[i].title
                    +"</a><br><span class=\"time\">"+e+"</span>"/*<br><span class=\"smallUrl\">"+urlInfos[i].url+"</span>*/+"</p>";
                }
            }
            $("#status").html((res!="")?res:chrome.i18n.getMessage("noNodeSelected"));
            /*"<img src=\"chrome://favicon/"+     hashURLs[mesDonnees.nodes[ind].nodeName][0]    +"\" />"
                +toRealURL(mesDonnees.nodes[ind])
                //+"<br>Last visit: "+hashURLs[mesDonnees.nodes[ind].nodeName][0]
                +"<br>"+JSON.stringify(hashURLs[mesDonnees.nodes[ind].nodeName]));
                //+"<br>"+keysHash);
                //.nodes(mesDonnees.nodes.map(toRealURL))
                */
    }
            
    var clickedBaseUrl="";
    function basicUrlInfo(url){
        clickedBaseUrl=url;
        switch(localStorage["entireUrl"]){
            case "noGroup":
            case "domain":
                chrome.history.search({"text": url, "maxResults" : 100, "startTime":now-milsec, "endTime": now }, callbackUrlInfo);
                break;
            default:
                chrome.history.search({"text": "http://"+url, "maxResults" : 100, "startTime":now-milsec, "endTime": now }, callbackUrlInfo);
        }
    }


    function pointer(ind){
        basicUrlInfo(mesDonnees.nodes[ind].nodeName);
    }



    var force = vis.add(pv.Layout.Force)
    /*.nodes(miserables.nodes)
        .links(miserables.links);*/
        //.nodes(mesDonnees.nodes.map(toRealURL))
        .nodes(mesDonnees.nodes)
        .links(mesDonnees.links)
        //.bound(true) 
       .chargeConstant(parseFloat(localStorage["chargeConstant"])) 
       .dragConstant(parseFloat(localStorage["dragConstant"]) )
       .springConstant(parseFloat(localStorage["springConstant"])) 
       .chargeMaxDistance(parseFloat(localStorage["chargeMaxDistance"]))
       .springLength(parseFloat(localStorage["springLength"]))
           ;// .iterations(500) ;

           
    //urls ouvertes
    for (var i in openedUrls){
        var simplif=openedUrls[i];
        for (var j in mesDonnees.nodes){
            if(mesDonnees.nodes[j].nodeName==simplif){
                mesDonnees.nodes[j].opened="yellow";
                continue;
            }
        }
    }

    force.link.add(pv.Line);

    force.node.add(pv.Dot)
        .size(function(d) (d.linkDegree*2 + 20) * Math.pow(this.scale, -1.5))
        .fillStyle(function(d) (d.opened=="yellow"?"yellow":"rgb(00"+/*(255-d.group)*/",255,"+toColor256(d.group)+")"))
        .strokeStyle(function() this.fillStyle().darker())
        .lineWidth(3)
        .title(function(d) d.nodeName)
        .event("click",function() pointer(this.index))
        .event("mousedown", pv.Behavior.drag())
        .event("drag", force);

    if(localStorage["labels"]=="true"){
        force.label.add(pv.Label)
            //.anchor("center")
            .textAlign("center")
            .font("12px sans-serif")
            .visible(true);
    }

    //$( "#progressbar" ).progressbar({value: 100});
    $("#status").html(chrome.i18n.getMessage("noNodeSelected"));

    vis.render();
}

var maBoiteDeDialogue = $('<div></div>').html(chrome.i18n.getMessage("aboutText")).dialog({ autoOpen: false, title: chrome.i18n.getMessage("buttonAbout"), width: 460 });
$('#opener').html(chrome.i18n.getMessage("buttonAbout"));
$('#opener').click(function() { maBoiteDeDialogue.dialog('open'); return false;});
$('#opener').button();

chrome.history.search({"text": "", "maxResults" : 100000000, "startTime":now-milsec, "endTime": now }, gotURLs);

/*----------------------------------------------------------*/

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("milsec");
  var milsec = 1000*select.children[select.selectedIndex].value;
  localStorage["milsec"] = milsec;
  
  var select2 = document.getElementById("minvisit");
  var minvisit = select2.children[select2.selectedIndex].value;
  localStorage["minvisit"] = minvisit;

  // Update status to let user know options were saved.
  /*var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);*/
  window.location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
  //document.querySelector('button').addEventListener('click', clickHandler);
  //main();
  // Restores select box state to saved value from localStorage.
  var milsec = localStorage["milsec"];
  if (!!milsec) {
      var select = document.getElementById("milsec");
      for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == milsec/1000) {
          child.selected = "true";
          break;
        }
      }
  }
  var minvisit = localStorage["minvisit"];
  if (!!minvisit) {  
      var select2 = document.getElementById("minvisit");
      for (var i = 0; i < select2.children.length; i++) {
        var child = select2.children[i];
        if (child.value == minvisit) {
          child.selected = "true";
          break;
        }
      }
  }

});

})();



  