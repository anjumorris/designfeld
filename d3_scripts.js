d3.select('h1')
  .style('color', 'black')
  .style("font-family", "lato");

// Changes all h2 level text
d3.selectAll('h2')
  .style('color', basegrey)
  .style("font-family", "lato");


// set the dimensions and margins of the graph
const margin = { top: 70, right: 50, bottom: 50, left: 50 },
  width = 550 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;


// ------Mynew Variables start here

//Color Palette

var jerryColor = '#71ABD1';
var elaineColor = '#FA1171';
var kramerColor = '#6332AD';//'#EB711F';
var georgeColor = '#FC7D0B';//"#F2F53D";
var otherColor = "#F2EE00"; //'#90F5DC';

var laugh0 = "white"
var laugh1 = "#EEEEEE";
var laugh2 = "#B3B3B3";
var laugh3 = "#777777";

var dividercolor = '#707070';
var basegrey = "#505050";
var undecidedcolor = "E4E6E7";

//Scene selector harcoded now
const defaultScene = "1"; //default scene selected
// const timeFormatter = "%M:%S";

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



// append the svgLine object to the body of the page
const svgLine = d3.select("#svgLine")
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
    time_stamp: d3.timeParse(timeFormatter)(d.time_stamp), time_stamp2: d3.timeParse(timeFormatter)(d.time_stamp2), laughter: d.laughter,
    scene_index: d.scene_index, scene_desc: d.scene_desc
  }
}).then(function (data) {

  // List of groups (here I have one group per column)
  const allGroup = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",
    "18", "19", "20", "21", "22"];
  // add the options to the button

  d3.select("#selectButtonLine")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }); // corresponding value returned by the button



  //time parser
  const parseTime = d3.timeParse("%M:%S");
  //Legend for laughter
  svgLine.append("circle").attr("cx",width).attr("cy",-400).attr("r", 10).style("fill", "black")
  svgLine.append("circle").attr("cx",10).attr("cy",160).attr("r", 10).style("fill", laugh2)
  svgLine.append("circle").attr("cx",10).attr("cy",160).attr("r", 10).style("fill", laugh3)
  svgLine.append("text").attr("x", 220).attr("y", 130).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
  svgLine.append("text").attr("x", 220).attr("y", 160).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")

  

  //Run function once with Scence 1 as default
  update(defaultScene)

  // A function that update the chart
  function update(sceneChoice) {
    //alert(sceneChoice);
    // X axis 
    svgLine.selectAll("*").remove();
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
    
   
    // Add Y axis
    const y = d3.scaleTime()
      .domain([startPoint[0], endPoint[1]])
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
        .text(d.speaker + ": " + d.speech)
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
        .style("opacity", 0.5)
    }

    //laughter scale

    svgLine.selectAll()
      .data(data)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        if (d.time_stamp >= startPoint[0] && d.time_stamp < endPoint[1]) {
          return x("OTHER");
        }
      })
      .attr("x2", function (d) {
        if (d.time_stamp >= startPoint[0] && d.time_stamp < endPoint[1]) {
          return x("OTHER");
        }
      })
      .attr("y1", function (d) {
        if (d.time_stamp >= startPoint[0] && d.time_stamp < endPoint[1]) {
          return y(d.time_stamp);
        }
      })
      .attr("y2", function (d) {
        if (d.time_stamp >= startPoint[0] && d.time_stamp < endPoint[1]) {
          return y(d.time_stamp2);
        }
      })
      .attr("stroke-width", width)
      .attr("stroke", function (d) {
        if (d.time_stamp >= startPoint[0] && d.time_stamp < endPoint[1]) {
          if (d.laughter === "0") {
            return laugh0;
          }
          else if (d.laughter === "1") {
            return laugh1;
          }
          else if (d.laughter === "2") {
            return laugh2;
          }
          else if (d.laughter === "3") {
            return laugh3;
          }

        }
      })
      .style("stroke-opacity", 0.8);


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

      //legend for chart
      
      svgLine.append("circle")
      .attr("cx",x("OTHER"))
      .attr("cy",y(startPoint[0]) - 50)
      .attr("r", 15)
      .style("stroke","black")
      .style("fill", laugh1)
      .style("fill-opacity",0.8);
      svgLine.append("circle")
      .attr("cx",x("ELAINE"))
      .attr("cy",y(startPoint[0]) - 50)
      .attr("r", 15)
      .style("stroke","black")
      .style("fill", laugh2)
      .style("fill-opacity",0.8);
      svgLine.append("circle")
      .attr("cx",x("KRAMER"))
      .attr("cy",y(startPoint[0]) - 50)
      .attr("r", 15)
      .style("stroke","black")
      .style("fill", laugh3)
      .style("fill-opacity",0.8);

      svgLine.append("text")
      .attr("x", x("OTHER") - 50)
      .attr("y", y(startPoint[0]) - 50)
      .attr("alignment-baseline","middle")
      .attr("text-anchor","end")
      .text("Laughter Scale")
      .style("font-size", "15px")
      .style("font-family", "lato")
      svgLine.append("text")
      .attr("x", x("OTHER"))
      .attr("y", y(startPoint[0]) - 50)
      .attr("alignment-baseline","middle")
      .attr("text-anchor","middle")
      .text("Low")
      .style("font-size", "10px")
      .style("font-family", "lato")
      svgLine.append("text")
      .attr("x", x("ELAINE"))
      .attr("y", y(startPoint[0]) - 50)
      .attr("alignment-baseline","middle")
      .attr("text-anchor","middle")
      .text("Med")
      .style("font-size", "10px")
      .style("font-family", "lato")
      svgLine.append("text")
      .attr("x", x("KRAMER"))
      .attr("y", y(startPoint[0]) - 50)
      .attr("alignment-baseline","middle")
      .attr("text-anchor","middle")
      .text("High")
      .style("font-size", "10px")
      .style("font-family", "lato")
  }

  // When the button is changed, run the updateChart function
  d3.select("#speakers").on("click", function (d) {
    // recover the option that has been chosen
    const selectedOption = wheelScene;
    //alert(selectedOption);
    // run the updateChart function with this selected option
    update(selectedOption)
  })

   

}
)



