var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.cluster()
    .size([360, innerRadius]);

const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBundle.beta(0.95));

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

d3.json("readme-flare-imports.json", function(error, classes) {
    if (error) throw error;

    var wha = packageHierarchy(classes);

    var root = d3.hierarchy(wha, (d) => d.children);

    var links = packageImports(root.descendants());

    console.dir(links);

    cluster(root);

    var nodes = root.descendants();

    var edges = link.data(links);

    node = node
        .data(nodes.filter(function(n) { return !n.children; }))
        .enter().append("text")
        .attr("class", "node")
        .attr("dy", ".31em")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .text(function(d) { return d.data.key; })

    edges.enter().append('path')
        .attr('class', 'link')
        .merge(edges)
        .attr('d', d => {
            //console.log(d.source.path(d.target));
            return line(d.source.path(d.target)); });

    edges.exit().remove();
        }