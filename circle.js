// ARCS
var colors = {
        jerry: '#005D90',
        elaine: '#F081BE',
        kramer: '#EB711F',
        george: "#F2F53D",
        other: '#90F5DC'
    },
    timeFormatter = "%M:%S",
    epStartTime = '00:00', // start of episode
    epEndTime = '22:49', // end of episode
    cEnd = 6.28, // end/top of circle
    svg = d3.select("#speakers");
    grayed = false,
    selectedScene = 0,
    parse = d3.timeParse('%M:%S'),
    t = d3.scaleTime()
        .domain(d3.extent([parse(epStartTime), parse(epEndTime)]))
        .range([0, 1]);

function mainChars(toCheck) {
    return ["JERRY", "ELAINE", "GEORGE", "KRAMER"].includes(toCheck);
}

var mouseover = function (i, scene) {
    if (typeof scene === 'undefined') {
      return;
    }

    seinfeld.currentTime(sceneToTimestamp.get(parseInt(scene.scene)));
    seinfeld.play();

    d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.2)

    svg.select('#scene_intro')
        .transition()
        .duration(100)
        .attr('opacity', 0)

    svg.select('#scene_metadata')
        .transition()
        .duration(100)
        .attr('opacity', 1)

    svg.select('#scene_metadata_title')
        .text('Scene ' + scene.scene)
        .transition()
        .duration(100)
        .attr('opacity', 1)

    svg.select('#scene_metadata_name')
        .text(scene.scene_desc)
        .transition()
        .duration(100)
        .attr('opacity', 1)

    svg.select('#scene_metadata_times')
        .text('[' + scene.start + ' - ' + scene.end + ']')
        .transition()
        .duration(100)
        .attr('opacity', 1)

    svg.select('#scene_thumb')
        .attr('xlink:href', '/scene_thumbs/scene_' + scene.scene + '.png')

    if (grayed) {
        d3.selectAll('.scene_' + scene.scene)
            .style('filter', 'saturate(1)')
            .attr('opacity', 1)
    }
}

var mouseleave = function (i, scene) {
    if (typeof scene === 'undefined') {
      return;
    }

    d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 0)

    if (grayed) {
        d3.selectAll('.scene_' + scene.scene + ':not(.scene_' + selectedScene + ')')
            .style('filter', 'saturate(0)')
            .attr('opacity', 0.5)
    }
}

var wheelclick = function(i, scene) {
    if (typeof scene === 'undefined') {
        return;
    }

    grayed = true;
    selectedScene = scene.scene;

    d3.selectAll('.speech:not(.scene_' + scene.scene + ')')
        .transition()
        .duration(600)
        .style('filter', 'saturate(0)')
        .attr('opacity', 0.5)
}

svg.attr("width", 1000).attr("height", 1100);

d3.csv("/scenes.csv").then(function(sceneData) {
    svg.selectAll()
        .data(sceneData)
        .enter()
        .append("path")
        .attr("transform", "translate(500,600)")
        .attr('opacity', 0)
        .attr("d", d3.arc()
            .innerRadius( 250 )
            .outerRadius( 500 )
            .startAngle(function(d) { return t(parse(d.start)) * cEnd; })
            .endAngle(function(d) { return (t(parse(d.end)) + 0.0005) * cEnd; })
        )
        .attr('id', function(d) {
            return 'scene_' + d.scene; // id="scene_2"
        })
        .attr('class', 'scene')
        .attr('fill', '#808080')
        .on('mouseover', mouseover)
        .on('mouseleave', mouseleave)
        .on('click', wheelclick)

    svg.selectAll()
        .data(sceneData)
        .enter()
        .append("path")
        .attr("transform", "translate(500,600)")
        .attr('opacity', 0.5)
        .attr("d", d3.arc()
            .innerRadius(function(d) { return d.start == '0:00' ? 300 : 350; })
            .outerRadius(function(d) { return d.start == '0:00' ? 550 : 500; })
            .startAngle(function(d) { return t(parse(d.start)) * cEnd; })
            .endAngle(function(d) { return (t(parse(d.start)) + 0.0005) * cEnd; })
        )
        .attr('class', 'scene_divider')
        .attr('fill', '#808080')

    svg.append("g")
        .attr('id', 'scene_intro')
        // .call(g => g.append("rect")
        // .attr('class', 'lbox')
        // .attr("x", 100)
        // .attr("y", 40)
        // .attr('rx', 3)
        // .attr('width', '20')
        // .attr('height', '20')
        // .style("fill", "#87a1ff"))
        .call(g => g.append("text")
        .text('Select a scene')
        .style("font-family", "lato")
        .attr('id', 'scene_intro_content')
        .attr('font-size', '40')
        .attr("x", 390)
        .attr("y", 510)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('Hover over a section of the wheel')
        .attr('id', 'scene_intro_content')
        .attr("x", 390)
        .attr("y", 550)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('and click to see more information')
        .attr('id', 'scene_intro_content')
        .attr("x", 390)
        .attr("y", 570)
        .style("fill", "black"))

    svg.append("g")
        .attr('id', 'scene_metadata')
        .attr('opacity', 0)
        // .call(g => g.append("rect")
        // .attr('class', 'lbox')
        // .attr("x", 100)
        // .attr("y", 50)
        // .attr('rx', 3)
        // .attr('width', '20')
        // .attr('height', '20')
        // .style("fill", "#87a1ff"))
        .call(g => g.append("text")
        .text('Scene ')
        .style("font-family", "lato")
        .attr('id', 'scene_metadata_title')
        .attr('font-size', '40')
        .attr("x", 390)
        .attr("y", 510)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('')
        .attr('id', 'scene_metadata_name')
        .attr('font-size', '24')
        .attr("x", 390)
        .attr("y", 550)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('')
        .attr('id', 'scene_metadata_times')
        .attr("x", 390)
        .attr("y", 570)
        .style("fill", "black"))

    svg.append("g")
        .attr('id', 'ep_times')
        .attr('opacity', 1)
        .call(g => g.append("text")
        .text('Start: 0:00-->')
        .style("font-family", "lato")
        .attr('id', 'ep_start_time')
        .attr('font-size', '12')
        .attr("x", 510)
        .attr("y", 75)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('-->End: 22:49')
        .attr('id', 'ep_end_time')
        .attr('font-size', '12')
        .attr("x", 420)
        .attr("y", 100)
        .style("fill", "black"))

    svg.append("g")
        .attr('opacity', 1)
        .call(g => g.append('image')
        .attr('id', 'scene_thumb')
        .attr('x', 350)
        .attr('y', 600)
        .attr('width', 320)
        .attr('height', 180)
        .attr('xlink:href', '/scene_thumbs/scene_1.png'))
});

// Use the speakers.csv for speakers-only data
d3.csv("/speakers.csv", function (d) {
    return {
        start: d.start,
        end: d.end,
        speaker: d.speaker,
        scene_marker: d.scene_marker,
        speech: d.speech,
        shortR: d3.arc()
        .innerRadius( 350 )
        .outerRadius( 400 )
        .startAngle(t(parse(d.start)) * cEnd)
        .endAngle(t(parse(d.end)) * cEnd),
        tallR: d3.arc()
        .innerRadius( 400 )
        .outerRadius( 450 )
        .startAngle(t(parse(d.start)) * cEnd)
        .endAngle(t(parse(d.end)) * cEnd)
    }
  }).then(function (data) {
    // var parse = d3.timeParse('%M:%S');

    // const t = d3.scaleTime()
    //     .domain(d3.extent([parse(epStartTime), parse(epEndTime)]))
    //     .range([0, 1]);


    var arcs = {};
    // data.forEach(function(d) {
    //     var split = d.start.split(':');
    //         arcs[d.speaker.toLowerCase() + '_' + split[0] + "m" + split[1] + "s"] = 
    //             d3.arc()
    //             .innerRadius( 400 )
    //             .outerRadius( 450 )
    //             .startAngle(function(d) { return t(parse(d.start)) * cEnd; })
    //             .endAngle(function(d) { return t(parse(d.end)) * cEnd; });
    // });
// d3.arc();
    // Create rings for all characters
    svg.selectAll()
        .data(data)
        .enter()
        .append("path")
        .attr("transform", "translate(500,600)")
        .attr('opacity', 1)
        .attr("d", d3.arc()
            .innerRadius( 400 )
            .outerRadius( 450 )
            .startAngle(function(d) { return t(parse(d.start)) * cEnd; })
            .endAngle(function(d) { return t(parse(d.end)) * cEnd; })
        )
        // .attr("d", function(d) { return d.tallR; }
        // )
        .attr('id', function(d) {
            var split = d.start.split(':');
            return d.speaker.toLowerCase() + '_' + split[0] + "m" + split[1] + "s"; // id="jerry_0m44s"
        })
        .attr('class', function(d) {
            if (mainChars(d.speaker)) {
                return d.speaker.toLowerCase() + ' speech scene_' + d.scene_marker; // class="jerry"
            } else {
                return d.speaker.toLowerCase() + ' other speech scene_' + d.scene_marker;
            }
        })
        .attr('fill', function(d) {
            if (mainChars(d.speaker)) {
                return colors[d.speaker.toLowerCase()];
            } else {
                return colors['other'];
            }
        })

    var labels = d3.select("#character_picker")
        .selectAll()
        .data(["Jerry", "Elaine", "George", "Kramer", "Other"])
        .enter()
        .append('label');

    labels.append("input")
    .attr("type", "checkbox")
    .attr('checked', true)
    .attr("name", function(d) { return d; })
    .attr("value", function(d) { return d.toLowerCase(); })
    .on("change", change)
    // .filter(function(d, i) { return !i; })
    // .each(change)
    // .property("checked", true);

    labels.append('span')
        .text(function(d) { return d; })
    
    function change(region) {
        svg.selectAll('.' + region.target.value)
            .transition()
            .duration(600)
            .attr('opacity', region.target.checked ? 1 : 0)
        // var newarc = d3.arc()
        //     .innerRadius(350)
        //     .outerRadius(400);
        // var jerrys = svg.selectAll('.jerry');
        // jerrys.enter()
        // jerrys.attr('d', function() { 
        //     return d3.select(this).attr('d');
        // } )
        // newj = d3.select('#jerry_0m05s')
        //     .outerRadius(600);
        // for (var id in arcs) {
        //     arcs[id].outerRadius(600);
        // }
        //['jerry_0m05s'].outerRadius(600);
        // d3.select('#jerry_0m05s')
        //     .transition()
        //     .duration(2000)
        //     .attr('d', arcs['jerry_0m05s'])
        // d3.selectAll('.jerry')
        //     .data(data)
        //     .enter()
        //     .attr("d", function(d) { return d.shortR; })
        // jerrys.forEach(function(j) {
            // jerrys.outerRadius(400);
        // });
        // d3.selectAll('.jerry')
        //     .transition()
        //     .duration(2000)
        //     .attr('d', )
        // .innerRadius(350)
            // .attr('d', newarc);

        //     .attr('opacity', 0)
            // .transition()
            // .duration(2000)
            // .attr('d', 300)
    }


// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {

  var i = d3.interpolate(this._current, d);

  this._current = i(0);

  return function(t) {
    return arc(i(t))
  }

}


function cloneObj(obj) {
  var o = {};
  for(var i in obj) {
    o[i] = obj[i];
  }
  return o;
}
})

d3.select('body').on('click', function(e) {
    triggersEvent = Array.from(e.target.classList).some(function(toCheck) {
        return ['speech', 'scene', 'scene_divider'].includes(toCheck);
    });
    if (!triggersEvent && grayed) {
        d3.selectAll('.speech')
            .style('filter', 'saturate(1)')
            .attr('opacity', 1)
        grayed = false;
    }
});

// LAUGHS
d3.csv("/laughs.csv").then(function(laughData) {
    svg.selectAll()
        .data(laughData)
        .enter()
        .append("path")
        .attr("transform", "translate(500,600)")
        .attr('opacity', 1)
        .attr("d", d3.arc()
            .innerRadius( 455 )
            .outerRadius(function(d) { return 455 + (d.laughter * 15); })
            .startAngle(function(d) { return t(parse(d.time_stamp)) * cEnd; }) // keep for thick laughter
            // .startAngle(function(d) { return (t(parse(d.time_stamp)) + 0.0005) * cEnd; }) // thin laughter
            .endAngle(function(d) {
                var date = new Date(parse(d.time_stamp));
                date.setSeconds(date.getSeconds() + 1);
                // return t(date) * cEnd; // thin laughter
                return (t(date) + 0.0005) * cEnd; // keep for thick laughter
            })
        )
        .attr('id', function(d) {
            return 'laugh_' + d.time_index; // id="scene_2"
        })
        .attr('class', 'laugh')
        .attr('fill', '#FFCC33')
});