
var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.cluster()
    .size([360, innerRadius]);

const line = d3.radialLine()
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; })
    .curve(d3.curveBundle.beta(0.95));

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

var classes_test = getData();
d3.json("https://raw.githubusercontent.com/edmondsk64/tsv/master/flare.json", function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy(packageHierarchy(classes_test), (d) => d.children);

    var links = packageImports(root.descendants());

    console.dir(links);

    cluster(root);

    var nodes = root.descendants();

    link = link
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        //.merge(edges)
        .attr('d', d => line(d.source.path(d.target)));

    node = node
        .data(nodes.filter(function(n) { return !n.children; }))
        .enter().append("text")
        .attr("class", "node")
        .attr("dy", ".31em")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .text(function(d) { return d.data.key; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);
});

function mouseovered(d) {
    node
        .each(function(n) { n.target = n.source = false; });

    link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
        .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
}

function mouseouted(d) {
    console.log("moouseout");
    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
}

d3.select(self.frameElement).style("height", diameter + "px");

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
        name = "" + name;
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
        map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
        if (d.data.imports) d.data.imports.forEach(function(i) {
            imports.push({source: map[d.data.name], target: map[i]});
        });
    });

    return imports;
}

function getData() {
    return [
      {"name":"0",  "imports":[2,3,1]},
      {"name":"1",  "imports":[2,3]},
      {"name":"2",  "imports":[3,7,5,8,1]},
      {"name":"3",  "imports":[2,0,1]},
      {"name":"4",  "imports":[2,3,1]},
      {"name":"5",  "imports":[2,15,3,7,13]},
      {"name":"6",  "imports":[3,1]},
      {"name":"7",  "imports":[2,0,1]},
      {"name":"8",  "imports":[2,3,1]},
      {"name":"9",  "imports":[2,3]},
      {"name":"10",  "imports":[3,1]},
      {"name":"11",  "imports":[2,0,1]},
      {"name":"12",  "imports":[2,3,1]},
      {"name":"13",  "imports":[2,3]},
      {"name":"14",  "imports":[3,1]},
      {"name":"15",  "imports":[2,0,1]},

        /*{"name":"0",     "imports":["2","3"]},
        {"name":"1",  "imports":["2"]},
        {"name":"2",  "imports":["3"]},
        {"name":"3",  "imports":["2"]},
        {"name":"4", "imports":["3", "0"]}*/
    ];
};