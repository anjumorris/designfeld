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

// Use the speakers.csv for speakers-only data
d3.csv("/speakers.csv").then(function (data) {
    var parse = d3.timeParse('%M:%S');

    const t = d3.scaleTime()
        .domain(d3.extent([parse(epStartTime), parse(epEndTime)]))
        .range([0, 1]);

    svg.attr("width", 1000).attr("height", 1000);

    // Create rings for all characters
    svg.selectAll()
        .data(data)
        .enter()
        .append("path")
        .attr("transform", "translate(500,500)")
        .attr("d", d3.arc()
            .innerRadius( 400 )
            .outerRadius( 450 )
            .startAngle(function(d) { return t(parse(d.start)) * cEnd; })
            .endAngle(function(d) { return t(parse(d.end)) * cEnd; })
        )
        .attr('id', function(d) {
            var split = d.start.split(':');
            return d.speaker.toLowerCase() + '_' + split[0] + "m" + split[1] + "s"; // id="jerry_0m44s"
        })
        .attr('class', function(d) {
            return d.speaker.toLowerCase(); // class="jerry"
        })
        .attr('fill', function(d) {
            if (["JERRY", "ELAINE", "GEORGE", "KRAMER"].includes(d.speaker)) {
                return colors[d.speaker.toLowerCase()];
            } else {
                return colors['other'];
            }
        })
    // svg.selectAll('.jerry')
    //     .attr('opacity', 0)
})