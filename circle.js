// ARCS
var colors = {
        jerry: '#71ABD1',
        elaine: '#FA1171',
        kramer: '#6332AD',
        george: '#FC7D0B',
        other: '#F2EE00'
    },
    timeFormatter = "%M:%S",
    epStartTime = '00:00', // start of episode
    epEndTime = '22:49', // end of episode
    cEnd = 6.28, // end/top of circle
    svg = d3.select("#speakers");
    grayed = false,
    selectedScene = {},
    topNegativeMargin = -50;
    parse = d3.timeParse('%M:%S'),
    t = d3.scaleTime()
        .domain(d3.extent([parse(epStartTime), parse(epEndTime)]))
        .range([0, 1]);

function mainChars(toCheck) {
    return ["JERRY", "ELAINE", "GEORGE", "KRAMER"].includes(toCheck);
}

var wheelScene = 1;

var mouseover = function (i, scene) {
    if (typeof scene === 'undefined') {
      return;
    }

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
        .attr('opacity', 1)
        .attr('xlink:href', '/scene_thumbs/scene_' + scene.scene + '.png')

    svg.select('#summary_area')
        .attr('opacity', 0)

    if (grayed) {
        d3.selectAll('.scene_' + scene.scene)
            .style('filter', 'saturate(1)')
            .attr('opacity', 1)
        d3.selectAll('.laugh')
            .filter(function(d) {
                var pF = parse(d.time_stamp);
                return pF > parse(scene.start) && pF < parse(scene.end);
            })
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
        d3.selectAll('.scene_' + scene.scene + ':not(.scene_' + selectedScene.scene + ')')
            .style('filter', 'saturate(0)')
            .attr('opacity', 0.5)
        d3.selectAll('.laugh')
            .filter(function(d) {
                var pF = parse(d.time_stamp);
                return pF > parse(scene.start) && pF < parse(scene.end)
                    && (pF < parse(selectedScene.start) || pF > parse(selectedScene.end))
            })
            .style('filter', 'saturate(0)')
            .attr('opacity', 0.5)
    }
}

var wheelclick = function(i, scene) {
    if (typeof scene === 'undefined') {
        return;
    }

    wheelScene = scene.scene;
    seinfeld.currentTime(sceneToTimestamp.get(parseInt(scene.scene)));
    seinfeld.play();

    grayed = true;
    selectedScene = scene;

    d3.selectAll('.speech:not(.scene_' + scene.scene + ')')
        .transition()
        .duration(600)
        .style('filter', 'saturate(0)')
        .attr('opacity', 0.5)

    d3.selectAll('.laugh')
        .filter(function(d) {
            var pF = parse(d.time_stamp);
            return pF < parse(scene.start) || pF > parse(scene.end);
        })
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
        .attr("transform", 'translate(500,' + (600 + topNegativeMargin) + ')')
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
        .attr("transform", 'translate(500,' + (600 + topNegativeMargin) + ')')
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
        .attr('opacity', 1)
        .call(g => g.append("text")
        .text('Select a scene')
        .style("font-family", "lato")
        .attr('id', 'scene_intro_content')
        .attr('font-size', '40')
        .attr("x", 390)
        .attr("y", 510 + topNegativeMargin)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('Hover over a section of the wheel')
        .attr('id', 'scene_intro_content')
        .attr("x", 390)
        .attr("y", 550 + topNegativeMargin)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('and click to see more information')
        .attr('id', 'scene_intro_content')
        .attr("x", 390)
        .attr("y", 570 + topNegativeMargin)
        .style("fill", "black"))

    svg.append("g")
        .attr('id', 'scene_metadata')
        .attr('opacity', 0)
        .call(g => g.append("text")
        .text('Scene ')
        .style("font-family", "lato")
        .attr('id', 'scene_metadata_title')
        .attr('font-size', '40')
        .attr("x", 390)
        .attr("y", 510 + topNegativeMargin)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('')
        .attr('id', 'scene_metadata_name')
        .attr('font-size', '24')
        .attr("x", 390)
        .attr("y", 550 + topNegativeMargin)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('')
        .attr('id', 'scene_metadata_times')
        .attr("x", 390)
        .attr("y", 570 + topNegativeMargin)
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
        .attr("y", 75 + topNegativeMargin)
        .style("fill", "black"))
        .call(g => g.append("text")
        .style("font-family", "lato")
        .text('-->End: 22:49')
        .attr('id', 'ep_end_time')
        .attr('font-size', '12')
        .attr("x", 420)
        .attr("y", 90 + topNegativeMargin)
        .style("fill", "black"))

    svg.append("g")
        .call(g => g.append('image')
        .attr('id', 'scene_thumb')
        .attr('opacity', 0)
        .attr('x', 350)
        .attr('y', 600 + topNegativeMargin)
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
    svg.selectAll()
        .data(data)
        .enter()
        .append("path")
        .attr("transform", 'translate(500,' + (600 + topNegativeMargin) + ')')
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
        .style('accent-color', function(d) { return colors[d.toLowerCase()]; })
        .on("change", change)
    
    labels.append('span')
        .text(function(d) { return d; })
    
    labels.append('img')
        .attr('id', function(d) { return 'avatar_' + d.toLowerCase(); })
        .attr('x', 350)
        .attr('y', 600 + topNegativeMargin)
        .attr('width', 80)
        .attr('height', 80)
        .attr('src', function(d) { return '/avatars/' + d.toLowerCase() + '2.PNG'; })
        .style('border-color', function(d) { return colors[d.toLowerCase()]; })

    svg.append('image')
        .attr('id', 'laugh_ring_legend')
        .attr('x', 0)
        .attr('y', 70 + topNegativeMargin)
        .attr('width', 150)
        .attr('height', 150)
        .attr('href', '/laugh_ring_legend.png')
    
    function change(region) {
        svg.selectAll('.' + region.target.value)
            .transition()
            .duration(600)
            .attr('opacity', region.target.checked ? 1 : 0)
    }
})

// CLICKING OFF THE WHEEL
d3.select('body').on('click', function(e) {
    triggersEvent = Array.from(e.target.classList).some(function(toCheck) {
        return ['speech', 'scene', 'scene_divider', 'laugh'].includes(toCheck);
    });
    if (!triggersEvent && grayed) {
        d3.selectAll('.speech')
            .style('filter', 'saturate(1)')
            .attr('opacity', 1)
        d3.selectAll('.laugh')
            .style('filter', 'saturate(1)')
            .attr('opacity', 1)
        svg.select('#summary_area')
            .attr('opacity', 1)
        svg.select('#scene_intro')
            .attr('opacity', 1)
        svg.select('#scene_metadata')
            .attr('opacity', 0)
        svg.select('#scene_thumb')
            .attr('opacity', 0)
        grayed = false;
        seinfeld.pause();
    }
});

// LAUGHS
d3.csv("/laughs.csv").then(function(laughData) {
    svg.selectAll()
        .data(laughData)
        .enter()
        .append("path")
        .attr("transform", 'translate(500,' + (600 + topNegativeMargin) + ')')
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
            var split = d.time_stamp.split(':');
            return 't' + split[0] + "t" + split[1]; // "t17m53s"
        })
        .attr('class', 'laugh')
        .attr('fill', "#777777")
        .style("fill-opacity", 0.8);
});

// BAR CHART
d3.csv('/summaryStat.csv').then(function(summaryData) {
    var height = 750;
    var barChart = svg.append('g')
        .attr('id', 'summary_area')
        .attr('opacity', 1);
    // X axis
    var x = d3.scaleBand()
        .range([ 0, 200 ])
        .domain(summaryData.map(function(d) { return d.speaker_summary; }))
        .padding(0.2);
    barChart.append('g')
        .attr('transform', 'translate(420,' + height + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 30])
        .range([ height, height - 160]);
    barChart.append('g')
        .attr('transform', 'translate(420,' + 0 + ')')
        .call(d3.axisLeft(y));

    // Bars
    barChart.selectAll()
        .data(summaryData)
        .enter()
        .append('rect')
        .attr('transform', 'translate(420,' + 0 + ')')
        .attr('class', 'summary_bar')
        .attr('x', function(d) { return x(d.speaker_summary); })
        .attr('y', function(d) { return y(d.not_percentage); })
        .attr('width', x.bandwidth())
        .attr('height', function(d) { return height - y(d.not_percentage); })
        .attr('fill', function(d) { return colors[d.speaker_summary.toLowerCase()]; })
        .attr('opacity', 1)
    barChart.selectAll()
        .data(summaryData)
        .enter()
        .append('text')
        .attr('id', function(d) { return d.speaker_summary.toLowerCase() + '_bar'; })
        .text(function(d) { return parseInt(d.percentage) + '%'; })
        .attr('transform', 'translate(420,' + 0 + ')')
        .attr('x', function(d) { return x(d.speaker_summary) + 4; })
        .attr('y', function(d) { return y(d.not_percentage) + 20; })
        .attr('font-size', '12px')
        .attr('fill', function(d) { return d.speaker_summary == 'OTHER' ? 'black' : 'white'; })
    barChart.append('g')
        .attr('id', 'summary_bars_description')
        .call(g => g.append('text')
        .text('Percentage of Spoken Time for Entire Episode')
        .style('font-family', 'lato')
        .attr('id', 'scene_intro_content')
        .attr('font-size', '16')
        .attr('x', 350)
        .attr('y', 870 + topNegativeMargin)
        .style('fill', 'black'))
})