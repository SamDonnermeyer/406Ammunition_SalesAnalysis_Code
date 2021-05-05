////////// Individual_Sales Page JS file //////////

// Import D3

///////////////////////////////
// Set-up for Vizualizations // 
///////////////////////////////

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 100},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }

//////////////////////////////
// T/A Percentage Breakdown // 
//////////////////////////////

// Append Div for tooltip to SVG
var ta_div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// SVG: Sales Line Chart
var ta_svg = d3.select("#container")
    .append("svg")
        .attr("width", 50 + width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("/406Amunition_SalesAnalysis/data/customer_type_monthly_sales.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m")(d.date), value : +d.transaction_percent, type: d.cust_type }
  },

  // Now I can use this dataset:
  function(data) {
    var sumstat = d3.nest() 
        .key(d => d.type)
        .entries(data);
    
    //set color pallete for different vairables
    var color = ["#484D6D", "#A9A9A9", "#08B2E3"]

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);

    ta_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font", "11px times")
      .call(d3.axisBottom(x));

    // Add Y axis --> it is currency formatted
    var y = d3.scaleLinear()
      .domain([0, 1]) // Hard Coded: d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    ta_svg.append("g")
      .style("font", "11px times")
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

      
    // Y axis label:
    ta_svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "20px")
          .attr("transform", "rotate(-90)")
          .attr("y", - margin.left + 60)
          .attr("x", -110)
          .text("% of Transactions")

      //select path - three types: curveBasis,curveStep, curveCardinal
    ta_svg.selectAll(".line")
        .attr("class", "line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                (d.values)
        })
        .attr("fill", "none")
        .attr("stroke", d => color[0])
        .attr("stroke-width", 3)
        .attr("id", function(d) {return d.key})


    // Create circles at data points
    ta_svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "bubbles")
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.date) })
        .attr("cy", function(d) { return y(+d.value) })
        .attr("id", function(d) {return d.type})
        .attr("r", 5)
      // Add interactivity - tooltip
      .on("mouseover", function(d) {
          ta_div.transition()
            .duration(200)
            .style("opacity", 1);
          ta_div
            .html("Month: " + d3.timeFormat("%B")(d.date) + "<br/>" + "T/A: " + d3.format(".0%")(d.value) + "<br/>" + titleCase(d.type))
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
          ta_div.transition()
            .duration(200)
            .style("opacity", 0);
        });

    // Handmade legend
    ta_svg.append("circle").attr("cx",530).attr("cy",130).attr("r", 6).style("fill", "#A9A9A9")
    ta_svg.append("circle").attr("cx",530).attr("cy",160).attr("r", 6).style("fill", "#484D6D")
    ta_svg.append("circle").attr("cx",530).attr("cy",190).attr("r", 6).style("fill", "#08B2E3")
    ta_svg.append("text").attr("x", 550).attr("y", 132).text("Individual").style("font-size", "15px").attr("alignment-baseline","middle")
    ta_svg.append("text").attr("x", 550).attr("y", 162).text("Business").style("font-size", "15px").attr("alignment-baseline","middle")
    ta_svg.append("text").attr("x", 550).attr("y", 192).text("Walk-In").style("font-size", "15px").attr("alignment-baseline","middle")
    ta_svg.append("text").attr("x", 522).attr("y", 110).text("Customer Type:").style("font-size", "15px").attr("alignment-baseline","middle").style("text-decoration", "underline")
});

//////////////////////////////////
// Revenue Percentage Breakdown // 
//////////////////////////////////

// Append Div for tooltip to SVG
var rev_div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// SVG: Sales Line Chart
var rev_svg = d3.select("#container2")
    .append("svg")
        .attr("width", 50 + width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("/406Amunition_SalesAnalysis/data/customer_type_monthly_sales.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m")(d.date), value : +d.sum_percent, type: d.cust_type }
  },

  // Now I can use this dataset:
  function(data) {
    var sumstat = d3.nest() 
        .key(d => d.type)
        .entries(data);
    
    //set color pallete for different vairables
    var color = ["#484D6D", "#A9A9A9", "#08B2E3"]

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);

    rev_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font", "11px times")
      .call(d3.axisBottom(x));

    // Add Y axis --> it is currency formatted
    var y = d3.scaleLinear()
      .domain([0, 1]) // Hard Coded: d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    rev_svg.append("g")
      .style("font", "11px times")
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

      
    // Y axis label:
    rev_svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "20px")
          .attr("transform", "rotate(-90)")
          .attr("y", - margin.left + 60)
          .attr("x", -120)
          .text("% of Revenue")

      //select path - three types: curveBasis,curveStep, curveCardinal
    rev_svg.selectAll(".line")
        .attr("class", "line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                (d.values)
        })
        .attr("fill", "none")
        .attr("stroke", d => color[0])
        .attr("stroke-width", 3)
        .attr("id", function(d) {return d.key})


    // Create circles at data points
    rev_svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "bubbles")
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.date) })
        .attr("cy", function(d) { return y(+d.value) })
        .attr("id", function(d) {return d.type})
        .attr("r", 5)
      // Add interactivity - tooltip
      .on("mouseover", function(d) {
          ta_div.transition()
            .duration(200)
            .style("opacity", 1);
          ta_div
            .html("Month: " + d3.timeFormat("%B")(d.date) + "<br/>" + "Revenue: " + d3.format(".0%")(d.value) + "<br/>" + titleCase(d.type))
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
          ta_div.transition()
            .duration(200)
            .style("opacity", 0);
        });

    // Handmade legend
    rev_svg.append("circle").attr("cx",530).attr("cy",140).attr("r", 6).style("fill", "#A9A9A9")
    rev_svg.append("circle").attr("cx",530).attr("cy",170).attr("r", 6).style("fill", "#484D6D")
    rev_svg.append("circle").attr("cx",530).attr("cy",200).attr("r", 6).style("fill", "#08B2E3")
    rev_svg.append("text").attr("x", 550).attr("y", 142).text("Individual").style("font-size", "15px").attr("alignment-baseline","middle")
    rev_svg.append("text").attr("x", 550).attr("y", 172).text("Business").style("font-size", "15px").attr("alignment-baseline","middle")
    rev_svg.append("text").attr("x", 550).attr("y", 202).text("Walk-In").style("font-size", "15px").attr("alignment-baseline","middle")
    rev_svg.append("text").attr("x", 522).attr("y", 120).text("Customer Type:").style("font-size", "15px").attr("alignment-baseline","middle").style("text-decoration", "underline")
});