document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('graph-button').addEventListener("click", function(){
    window.open(chrome.extension.getURL("graph.html"));
  });
});
