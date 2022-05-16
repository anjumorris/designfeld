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
    var parse = d3.timeParse('%M:%S');
    const t = d3.scaleTime()
        .domain(d3.extent([parse(epStartTime), parse(epEndTime)]))
        .range([0, 1]);

function mainChars(toCheck) {
    return ["JERRY", "ELAINE", "GEORGE", "KRAMER"].includes(toCheck);
}


// Use the speakers.csv for speakers-only data
d3.csv("/speakers.csv", function (d) {
    return {
        start: d.start,
        end: d.end,
        speaker: d.speaker,
        scene_marker: d.scene_marker, speech: d.speech,
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

    svg.attr("width", 1000).attr("height", 1000);

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
        .attr("transform", "translate(500,500)")
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
                return d.speaker.toLowerCase(); // class="jerry"
            } else {
                return d.speaker.toLowerCase() + ' other';
            }
        })
        .attr('fill', function(d) {
            if (mainChars(d.speaker)) {
                return colors[d.speaker.toLowerCase()];
            } else {
                return colors['other'];
            }
        })
    // svg.selectAll('.jerry')
    //     .attr('opacity', 0)

    // svg.select('.jerry')
    // .data(data)
    // .enter()
    // .attr("d", function(d) { return d.shortR; })









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