var diameter = 2000,
    radius = diameter / 2,
    innerRadius = radius - 80;

var cluster = d3.layout.cluster()
    .separation(function(a, b) { return 1; })
    .size([360, innerRadius])
    .sort(null)
    .value(function(d) { return d.size; });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.9)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; })
    ;


var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var classes_test = getData();

d3.json("https://raw.githubusercontent.com/edmondsk64/tsv/master/1.json", function(error, classes) {
  if (error) throw error;

  var nodes = cluster.nodes(packageHierarchy(classes_test)),
      links = packageImports(nodes);

  svg.selectAll(".link")
      .data(bundle(links))
    .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", line);

  svg.selectAll(".node")
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
          return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      })
      .append("text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .text(function(d) { return d.key; });

  d3.select(self.frameElement).style("height", diameter + "px");

});

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    name = name.toString();
    //data = data.toString();
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) d.imports.forEach(function(i) {
      imports.push({source: map[d.name], target: map[i]});
    });
  });

  return imports;
}

function getData() {
    return [
      {"name":"a.0",  "imports":["c.12", "c.10", "b.7", "c.13", "b.6", "a.1", "c.14"]},
      {"name":"a.1",  "imports":["c.13", "b.5", "b.6", "c.14", "c.11", "c.12", "a.2", "b.7", "b.9", "b.8"]},
      {"name":"a.2",  "imports":[10, 5, 4, 9, 12]},
      {"name":"a.3",  "imports":[1, 3, 2, 13, 5, 9, 8, 14, 6, 12]},
      {"name":"a.4",  "imports":[1, 10, 4, 5, 3, 11, 13, 7, 8]},
      {"name":"b.5",  "imports":[5, 4, 2, 14, 9]},
      {"name":"b.6",  "imports":[1, 12, 6, 3, 13, 4, 11, 14, 8, 5, 7]},
      {"name":"b.7",  "imports":[8]},
      {"name":"b.8",  "imports":[7, 5, 12, 10, 1, 8, 11, 4, 14, 6]},
      {"name":"b.9",  "imports":[14, 7, 1, 6, 12, 13, 9, 11, 4, 3]},
      {"name":"c.10",  "imports":[4, 10, 6, 5, 14]},
      {"name":"c.11",  "imports":[14, 7, 4, 2, 6]},
      {"name":"c.12",  "imports":[2,3,1]},
      {"name":"c.13",  "imports":[13, 3, 12, 8, 14]},
      {"name":"c.14",  "imports":[3,1]},
      {"name":"c.15",  "imports":[1, 8, 14, 3, 11, 2, 9, 6, 12, 5, 13]},

        /*{"name":"0",     "imports":["2","3"]},
        {"name":"1",  "imports":["2"]},
        {"name":"2",  "imports":["3"]},
        {"name":"3",  "imports":["2"]},
        {"name":"4", "imports":["3", "0"]}*/
    ];
};
