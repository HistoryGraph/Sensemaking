document.addEventListener('DOMContentLoaded', function() {
  // var graph = JSON.parse(localStorage.historyGraph);

  var width = 500,
      height = 300

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var force = d3.layout.force()
      .gravity(.05)
      .distance(100)
      .charge(-100)
      .size([width, height]);

  d3.json(localStorage.historyGraph, function(error, json) {
    var edges = [];
      json.links.forEach(function(e) { 
      var sourceNode = json.nodes.filter(function(n) { return n.id === e.source; })[0],
      targetNode = json.nodes.filter(function(n) { return n.id === e.target; })[0];
          
      edges.push({source: sourceNode, target: targetNode});
      });
      
    force
        .nodes(json.nodes)
        .links(edges)
        .start();

    var link = svg.selectAll(".link")
        .data(edges)
      .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(json.nodes)
      .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("class", "node")
        .attr("r", 5);

    node.append("svg:a")
        .attr("xlink:href", function(d){return d.url;})
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.url})

    
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
  });
});