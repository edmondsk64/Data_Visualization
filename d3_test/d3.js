
var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.cluster()
    .size([360, innerRadius]);

const line = d3.radialLine()
    .radius(function (d) { return d.y; })
    .angle(function (d) { return d.x / 180 * Math.PI; })
    .curve(d3.curveBundle.beta(0.95));

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

var classes_test = getData();

d3.json("https://raw.githubusercontent.com/edmondsk64/tsv/master/data.json", function (error, classes) {
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
        .data(nodes.filter(function (n) { return !n.children; }))
        .enter().append("text")
        .attr("class", "node")
        .attr("dy", ".31em")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        .text(function (d) { return d.data.key; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);
});

function mouseovered(d) {
    node
        .each(function (n) { n.target = n.source = false; });

    link
        .classed("link--target", function (l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function (l) { if (l.source === d) return l.target.target = true; })
        .filter(function (l) { return l.target === d || l.source === d; })
        .each(function () { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function (n) { return n.target; })
        .classed("node--source", function (n) { return n.source; });
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
            node = map[name] = data || { name: name, children: [] };
            if (name.length) {
                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);

            }
        }
        return node;
    }

    classes.forEach(function (d) {
        find(d.name, d);
    });

    return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function (d) {
        map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function (d) {
        if (d.data.imports) d.data.imports.forEach(function (i) {
            imports.push({ source: map[d.data.name], target: map[i] });
        });
    });

    return imports;
}

function getData() {
    return [

        {
            "ID": 0,
            "name": "M.Alfred K",
            "imports": [
               
            ],
            "Power Group": "Power M"
        },
        {
            "ID": 1,
            "name": "R.Alfred W",
            "imports": [
                "J.One Yeung",
                "B.Patricia"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 2,
            "name": "M.Amanda",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 3,
            "name": "M.Amy",
            "imports": [
                "C.Eric"
            ],
            "Power Group": "Power M"
        },
        {
            "ID": 4,
            "name": "J.Andy",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 5,
            "name": "R.Ann",
            "imports": [
                "C.Kenneth"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 6,
            "name": "R.Aries",
            "imports": [],
            "Power Group": "Power R"
        },
        {
            "ID": 7,
            "name": "C.Ben Chu",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 8,
            "name": "B.Ben Mak",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 9,
            "name": "J.Benny",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 10,
            "name": "M.Bernard",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 11,
            "name": "C.Billie",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 12,
            "name": "M.Candy",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 13,
            "name": "B.Carl Kee",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 14,
            "name": "R.Carmen",
            "imports": [],
            "Power Group": "Power R"
        },
        {
            "ID": 15,
            "name": "R.Catherizne",
            "imports": [
                "J.Flavia",
                "B.Jack",
                "B.Tak"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 16,
            "name": "C.Chris",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 17,
            "name": "M.Coco",
            "imports": [
                "J.Migo",
                "B.Neon"
            ],
            "Power Group": "Power M"
        },
        {
            "ID": 18,
            "name": "C.Cus",
            "imports": [
                "R.Louis"
            ],
            "Power Group": "Power C"
        },
        {
            "ID": 19,
            "name": "J.David Burton",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 20,
            "name": "C.Diana",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 21,
            "name": "B.Donna",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 22,
            "name": "B.Edwin",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 23,
            "name": "R.Edwoon",
            "imports": [],
            "Power Group": "Power R"
        },
        {
            "ID": 24,
            "name": "B.Eins",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 25,
            "name": "C.Eleanor",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 26,
            "name": "C.Eric",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 27,
            "name": "J.Erica",
            "imports": [
                "B.Edwin",
                "J.Janet"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 28,
            "name": "J.Eva",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 29,
            "name": "J.Flavia",
            "imports": [
                "C.Roger"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 30,
            "name": "R.Grace",
            "imports": [
                "C.Phyllis",
                "C.Pui Man"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 31,
            "name": "C.Hoby",
            "imports": [],
            "Power Group": " Power C"
        },
        {
            "ID": 32,
            "name": "M.Irene",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 33,
            "name": "B.Jack",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 34,
            "name": "J.Janet",
            "imports": [
                "J.Warren"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 35,
            "name": "M.Jenny",
            "imports": [
                "C.Patti"
            ],
            "Power Group": "Power M"
        },
        {
            "ID": 36,
            "name": "J.Ji Ji",
            "imports": [
                "J.Sam",
                "J.Vicky"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 37,
            "name": "C.Joanne",
            "imports": [
                "M.Jenny",
                "C.Wai"
            ],
            "Power Group": "Power C"
        },
        {
            "ID": 38,
            "name": "C.Johnny",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 39,
            "name": "B.Kathy",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 40,
            "name": "C.Kenneth",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 41,
            "name": "M.Lee",
            "imports": [
                "R.Richard",
                "R.Rita"
            ],
            "Power Group": "Power M"
        },
        {
            "ID": 42,
            "name": "C.Leo",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 43,
            "name": "J.Leonard",
            "imports": [
                "R.Grace"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 44,
            "name": "R.Louis",
            "imports": [
                "C.Joanne",
                "B.Kathy"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 45,
            "name": "M.Martin",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 46,
            "name": "J.Migo",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 47,
            "name": "B.Neon",
            "imports": [
                "M.Lee"
            ],
            "Power Group": "Power B"
        },
        {
            "ID": 48,
            "name": "J.One Yeung",
            "imports": [
                "J.Leonard",
                "J.Samson"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 49,
            "name": "B.Patricia",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 50,
            "name": "C.Patti",
            "imports": [
                "R.Wayne",
                "C.Ziennifer Hui"
            ],
            "Power Group": "Power C"
        },
        {
            "ID": 51,
            "name": "C.Phyllis",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 52,
            "name": "C.Pui Man",
            "imports": [
                "C.Hoby",
                "M.Irene"
            ],
            "Power Group": "Power C"
        },
        {
            "ID": 53,
            "name": "R.Richard",
            "imports": [
                "M.Martin",
                "B.Stella"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 54,
            "name": "R.Rita",
            "imports": [
                "J.Ji Ji",
                "R.Stanley"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 55,
            "name": "C.Roger",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 56,
            "name": "J.Sam",
            "imports": [
                "C.Leo"
            ],
            "Power Group": "Power J"
        },
        {
            "ID": 57,
            "name": "J.Samson",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 58,
            "name": "B.Shek",
            "imports": [
                "C.Johnny",
                "B.Sylvia"
            ],
            "Power Group": "Power B"
        },
        {
            "ID": 59,
            "name": "R.Stanley",
            "imports": [
                "C.Eleanor"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 60,
            "name": "B.Stella",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 61,
            "name": "M.Suzuki",
            "imports": [],
            "Power Group": "Power M"
        },
        {
            "ID": 62,
            "name": "B.Sylvia",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 63,
            "name": "B.Tak",
            "imports": [],
            "Power Group": "Power B"
        },
        {
            "ID": 64,
            "name": "J.Vicky",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 65,
            "name": "C.Wai",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 66,
            "name": "J.Warren",
            "imports": [],
            "Power Group": "Power J"
        },
        {
            "ID": 67,
            "name": "R.Wayne",
            "imports": [
                "B.Shek",
                "M.Suzuki"
            ],
            "Power Group": "Power R"
        },
        {
            "ID": 68,
            "name": "C.Ziennifer Hui",
            "imports": [],
            "Power Group": "Power C"
        },
        {
            "ID": 69,
            "name": "J.Archie",
            "imports": [],
            "Power Group": "Power J"
        }
    ];
        /*
        {
            "name": "R.AgglomerativeCluster",

            "imports": [

                "R.test",
            ]
        },
        {
            "name": "R.test",

            "imports": [

                "R.AgglomerativeCluster",
            ]
        },
        {

            "name": "M.Alfred K",
            "imports": [
                "M.test",
                "R.test"
            ]
        },
        {

            "name": "M.test",
            "imports": [
                "M.Alfred K",
                "R.AgglomerativeCluster",
            ]
        }
         
        {
            "name": "0",
            "imports": ["2", "3"],
            "group": "M"
        },
        {
            "name": "1",
            "imports": ["2"],
            "group": "M"
        },
        {
            "name": "2",
            "imports": ["3"],
            "group": "M"
        },
        {
            "name": "3",
            "imports": ["2"],
            "group": "M"h
        }

        {
            "name": "R.AgglomerativeCluster",

            "imports": [

                "R.test",
            ]
        },
        {
            "name": "R.test",

            "imports": [

                "R.AgglomerativeCluster",
            ]
        },
        {

            "name": "M.Alfred K",
            "imports": [
                "M.test",
                "R.test"
            ]
        },
        {

            "name": "M.test",
            "imports": [
                "M.Alfred K",
                "R.AgglomerativeCluster",
            ]
        }
         
       
        {
            
            "name": "R",
            "imports": [],
            "group": "M"
        },
        {
            
            "name": "M",
            "imports": ["M.AlfredK"],
            "group": "M"
        } ,
        {
            
            "name": "M.AlfredK",
            "imports": [],
            "group": "M"
        },
        
        {
            
            "name": "R.Alfred W",
            "imports": ["M.AlfredK", "M.Amanda" ],
            "group": "R"
        },
        {
            
            "name": "M.Amanda" ,
            "imports": ["R.AlfredK"],
            "group": "M"
        }
        
       ,
        {
            "name": 3,
            "Name": "Amy",
            "imports": [4],
            "group": "M"
        },
        {
            "name": 4,
            "Name": "Andy",
            "imports": [5],
            "group": "J"
        },
        {
            "name": 5,
            "Name": "Ann",
            "imports": [6],
            "group": "R"
        },
        {
            "name": 6,
            "Name": "Aries",
            "imports": [7],
            "group": "R"
        },
        {
            "name": 7,
            "Name": "Ben Chu",
            "imports": [8],
            "group": "C"
        },
        {
            "name": 8,
            "Name": "Ben Mak",
            "imports": [9],
            "group": "B"
        },
        {
            "name": 9,
            "Name": "Benny",
            "imports":[8],
            "group": "J"
        },
        {
            "name": 10,
            "Name": "Bernard",
            "imports": [3],
            "group": "M"
        }
        {"name":"0",     "imports":["2","3"]},
        {"name":"1",  "imports":["2"]},
        {"name":"2",  "imports":["3"]},
        {"name":"3",  "imports":["2"]},
        {"name":"4", "imports":["3", "0"]}*/

};
