document.addEventListener('DOMContentLoaded', function() {
  var graph = JSON.parse(localStorage.historyGraph);

  // load jquery
  // var script = document.createElement('script');
  // script.src = 'http://code.jquery.com/ui/1.11.0/jquery-ui.min.js';
  // script.type = 'text/javascript';
  // document.getElementsByTagName('head')[0].appendChild(script);

  var width = 1000,
      height = 600

  var svg = d3.select("body").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
      // .attr("width", width)
      // .attr("height", height);

  var force = d3.layout.force()
      .gravity(.04)
      .distance(100)
      .charge(-100)
      .size([width, height]);

  // ARROWS code
  svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
    .style("stroke", "#ccc")
    .style("opacity", "1");

// CREATE THE GRAPH
  if (graph != null && graph != undefined){
    var edges = [];
      graph.edges.forEach(function(e) { 
      var sourceNode = graph.nodes.filter(function(n) { return n.id === e.source; })[0],
      targetNode = graph.nodes.filter(function(n) { return n.id === e.target; })[0];
          
      edges.push({source: sourceNode, target: targetNode});
      });
      
    force
        .nodes(graph.nodes)
        .links(edges)
        .start();

    var link = svg.selectAll(".link")
        .data(edges)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#ccc")
        .style("marker-end",  "url(#suit)");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node")
        .call(force.drag)
        .on('dblclick', connectedNodes);

    node.append("circle")
        .attr("class", "node")
        .style("fill", '#fff')
        .style("stroke-width", 3)
        .style("stroke", function (d) { 
          // color of the node
          if (d.typedCount > 0) {
            return 'rgba(200, 200, 200, ' + d.recency + ')'; 
          } else {
            return 'rgba(10, 140, 255, ' + d.recency + ')'; 
          }
        })
        .attr("r", function(d) { return Math.min(d.totalVisits * 4 + 9, 40)});

    node.append("svg:image")
      .attr("class", "circle")
      .attr("xlink:href", function(d){return "chrome://favicon/" + d.url;})
      .attr("x", "-8px")
      .attr("y", "-8px")
      .attr("width", "16px")
      .attr("height", "16px");

    node.append("svg:a")
        .attr("xlink:href", function(d){return d.url;})
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { 
          return d.shortName;
        })
        .style("stroke", 'rgba(160,160,160,1)')
        .on('mouseover', function(d){
            var nodeSelection = d3.select(this).style({stroke: 'rgba(30,30,30,1)'}).text(function(d) { return d.title;});

        })
        .on('mouseout', function(d){
          d3.select(this).style({stroke: 'rgba(160,160,160,1)',})
            .text(function(d) { return d.shortName;})
        });

    
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      node.each(collide(0.5));
    });

    

      // DOUBLE-CLICK highlighting
    //Toggle stores whether the highlighting is on
    var toggle = 0;
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    graph.edges.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    //This function looks up whether a pair are neighbours
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }
    function connectedNodes() {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            node.style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            });
            link.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            node.style("opacity", 1);
            link.style("opacity", 1);
            toggle = 0;
        }
    }

  };

  // COLLISION DETECTION
  var padding = 1, // separation between circles
      radius=8;
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(graph.nodes);
    return function(d) {
      var rb = 2*radius + padding,
          nx1 = d.x - rb,
          nx2 = d.x + rb,
          ny1 = d.y - rb,
          ny2 = d.y + rb;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y);
            if (l < rb) {
            l = (l - rb) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }


});