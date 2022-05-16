 

    // Changes Title Text
    d3.select('h1')
      .style('color', 'black')
      .style("font-family", "lato");

    // Changes all h2 level text
    d3.selectAll('h2')
      .style('color', basegrey)
      .style("font-family", "lato");


    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = 550 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

    //Color Palette

    var jerryColor = '#005D90';
    var elaineColor = '#F081BE';
    var kramerColor = '#EB711F';
    var georgeColor = "#F2F53D";
    var otherColor = '#90F5DC';

    var laugh0 = "white"
    var laugh1 = "#E4E6E7";
    var laugh2 ="#8E9090";
    var laugh3 = "#555657";
    
    var dividercolor = '#707070';
    var basegrey = "#505050";


    //Scene selector harcoded now
    var sceneChoice = "1";
    // const timeFormatter = "%M:%S";
    



    // append the svgLine object to the body of the page
    const svgLine = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data ... All files have been uploaded to my github for easy access and downloading
    // When reading the csv, I must format variables:
    d3.csv("https://raw.githubusercontent.com/UlyssesLin/designfeld/master/seinfeld_data_final.csv", function (d) {
      return {
        start: d3.timeParse(timeFormatter)(d.start), end: d3.timeParse(timeFormatter)(d.end),
        speaker: d.speaker, scene_marker: d.scene_marker, speech: d.speech,
        time_stamp: d3.timeParse(timeFormatter)(d.time_stamp), time_stamp2 : d3.timeParse(timeFormatter)(d.time_stamp2), laughter: d.laughter,
        scene_index: d.scene_index, scene_desc: d.scene_desc
      }
    }).then(function (data) {

      //Scene Description at bottm??    
      d3.selectAll("#my_scene")
        .style('color', basegrey)
        .style("font-family", "lato")
        .data(data)
        .enter()
        .append('text')
        .text(function (d) {
          if (d.scene_index === sceneChoice) {
            return "Scene " + sceneChoice + ": " + d.scene_desc;
          }
        })
        .style('color', basegrey)
        .style("font-family", "lato")
        .style("font-size", 15);



      //time parser
      const parseTime = d3.timeParse("%M:%S");

      // X axis 
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) {

          if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
            return d.speaker;
          }
          else {
            return "OTHER";
          }
        }
        ))
        .padding(1);
      svgLine.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("color", basegrey) // change here for axis line and tick style
        .style("stroke-width", 0)
        .call(d3.axisBottom().scale(x))
        .selectAll("text")
        .attr("transform", "translate(0,10)rotate(0)")
        .style("text-anchor", "middle")
        .style("color", basegrey)
        .style("font-family", "lato")
        .style("font-size", 12); // change here for axis marking (year)
        
      
        var startPoint = d3.extent(data, function (d) {
          if (d.scene_marker === sceneChoice) {
            return d.start;
          }
        });  

        var endPoint = d3.extent(data, function (d) {
          if (d.scene_marker === sceneChoice) {
            return d.end;
          }
        });
      //alert(startPoint[0] + endPoint[1])

      // Add Y axis
      const y = d3.scaleTime()
        .domain([startPoint[0],endPoint[1]])
        .range([0, height]);

      svgLine.append("g")
        .style("color", "white")
        .style("font-family", "lato")
        .style("font-size", 12)
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat(timeFormatter))) // added format for time
        .selectAll('text')
        .style("text-anchor", "end")
        .style("color", basegrey)
        .style("font-family", "lato")
        .style("font-size", 12); //Change here for y axis font change 


      //tooltip stuff
      var Tooltip = d3.select("#tooltip_wrapper")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (i, d) {
        if (typeof d === 'undefined') {
          return;
        }

        Tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      var mousemove = function (i, d) {
        if (typeof d === 'undefined') {
          return;
        }
        Tooltip
          .html(d.speaker + ": " + d.speech)
          .style("left", "70px")
          .style("top", "100px")
      }
      var mouseleave = function (i, d) {
        if (typeof d === 'undefined') {
          return;
        }
        Tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", function (d) { //color changing for each character
            if (d.speaker === "JERRY") {
              return jerryColor;
            }
            else if (d.speaker === "ELAINE") {
              return elaineColor;
            }
            else if (d.speaker === "KRAMER") {
              return kramerColor;
            }
            else if (d.speaker === "GEORGE") {
              return georgeColor;
            }
            else {
              return otherColor;
            }
          })
          .style("opacity", 1)
      }
      
      //laughter scale

      svgLine.selectAll()
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) {
          if(d.time_stamp>=startPoint[0] && d.time_stamp<endPoint[1])
          {
          return x("OTHER");
          }
        })
        .attr("x2", function(d) {
          if(d.time_stamp>=startPoint[0] && d.time_stamp<endPoint[1])
          {
          return x("OTHER");
          }
        })
        .attr("y1", function(d) {
          if(d.time_stamp>=startPoint[0] && d.time_stamp<endPoint[1])
          {
          return y(d.time_stamp);
          }
        })
        .attr("y2", function(d) {
          if(d.time_stamp>=startPoint[0] && d.time_stamp<endPoint[1])
          {
          return y(d.time_stamp2);
          }
        })
        .attr("stroke-width", width)
        .attr("stroke", function(d) {
          if(d.time_stamp>=startPoint[0] && d.time_stamp<endPoint[1])
          {
              if(d.laughter==="0")
              {
                return laugh0;
              }
              else if(d.laughter==="1")
              {
                return laugh1;
              }
              else if(d.laughter==="2")
              {
                return laugh2;
              }
              else if(d.laughter==="3")
              {
                return laugh3;
              }
              
          }
        })
        .style("stroke-opacity", 0.2);


      // Render the dashed lines
      svgLine.selectAll()
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
          if (d.scene_marker === sceneChoice) {
            if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
              return x(d.speaker);
            }
            else {
              return x("OTHER");
            }
          }
        })
        .attr("x2", function (d) {
          if (d.scene_marker === sceneChoice) {
            if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
              return x(d.speaker);
            }
            else {
              return x("OTHER");
            }
          }
        })
        .attr("y1", function (d) {
          if (d.scene_marker === sceneChoice) {
            return y(d.start);
          }
        })
        .attr("y2", function (d) {
          if (d.scene_marker === sceneChoice) {
            return y(d.end);
          }
        })
        .attr("stroke-width", 10)
        .attr("stroke", function (d) { //color changing for each character
          if (d.speaker === "JERRY") {
            return jerryColor;
          }
          else if (d.speaker === "ELAINE") {
            return elaineColor;
          }
          else if (d.speaker === "KRAMER") {
            return kramerColor;
          }
          else if (d.speaker === "GEORGE") {
            return georgeColor;
          }
          else {
            return otherColor;
          }
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    })
  

