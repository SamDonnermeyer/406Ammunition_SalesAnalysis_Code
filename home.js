////////// Home Page JS file //////////
// Import D3 - in index.html // 

//Read the data
// Read in base data - get metrics
d3.csv("/406Amunition_SalesAnalysis/data/summary_metrics.csv", function(data) {
    // Total Sales //
    document.getElementById("total_sales_card").innerHTML = "Total Sales:" + "<br>" + d3.format("($,.2f")(data[0].value);

    // Avg. Sales Per Month //
    document.getElementById("avg_sales_card").innerHTML = "Average Sales (Month):" + "<br>" + d3.format("($,.2f")((data[0].value)/12);

    // Unique Products Sold // 
    document.getElementById("unq_prod_card").innerHTML = "Unique Products Sold:" + "<br>" + d3.format("")((data[1].value));

    // # of Unique Customers // 
    document.getElementById("unq_cust_card").innerHTML = "Unique Customers:" + "<br>" + d3.format("(,")((data[2].value));

    // Average T/A Amount // 
    document.getElementById("avg_ta_card").innerHTML = "Average Transaction:" + "<br>" + d3.format("($,.2f")((data[3].value));

    // # of States Sold to
    document.getElementById("states_card").innerHTML = "States Sold to:" + "<br>" + d3.format("(,")((data[4].value));

    // # of States Sold to
    document.getElementById("city_card").innerHTML = "Cities Sold to:" + "<br>" + d3.format("(,")((data[5].value));
});


///////////////////////////////
// Set-up for Vizualizations // 
///////////////////////////////

// Set X-Axis Tick format
var currencyFormatter = d3.format("$,.0f")

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


//////////////////////
// Sales Line Chart // 
//////////////////////
// https://www.d3-graph-gallery.com/graph/line_basic.html

// Append Div for tooltip to SVG
var sales_div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// SVG: Sales Line Chart
var sales_svg = d3.select("#sales_line_chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (margin.top + 13) + ")");

//Read the data
d3.csv("/406Amunition_SalesAnalysis/data/monthly_sales.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m")(d.date), value : +d.amount, value1: +d.cust_id }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);

    sales_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis --> it is currency formatted
    var y = d3.scaleLinear()
      .domain([0, 500000]) // Hard Coded: d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    sales_svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format("($,.0f")));

      // Add X axis label:
    sales_svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "18px")
          .attr("x", width)
          .attr("y", height + margin.top - 20)
          .text("Months");
      
    // Y axis label:
    sales_svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "18px")
          .attr("transform", "rotate(-90)")
          .attr("y", - margin.left + 85)
          .attr("x", - margin.top)
          .text("($) Sold")

    // Add the line
    sales_svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#484D6D")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(+d.value) })
        )

    // Create circles at data points
    sales_svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "bubbles")
        .attr("fill", "#EE6352")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.date) })
        .attr("cy", function(d) { return y(+d.value) })
        .attr("r", 5)
      // Add interactivity - tooltip
      .on("mouseover", function(d) {
          sales_div.transition()
            .duration(200)
            .style("opacity", 1);
          sales_div
            .html("Month: " + d3.timeFormat("%B")(d.date) + "<br/>" + "Sales: " + d3.format("($,.2f")(d.value))
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
          sales_div.transition()
            .duration(200)
            .style("opacity", 0);
        });

});

////////////////////////
// Customer Bar Chart // 
////////////////////////

// Append Div for tooltip to SVG
var bar_div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// SVG: Customer Bar Chart
var cust_svg = d3.select("#cust_bar_chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (margin.top + 20) + ")");


// Read the data
d3.csv("/406Amunition_SalesAnalysis/data/monthly_sales.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : (d.date), value : +d.cust_id, tool_date: d3.timeParse("%Y-%m")(d.date) }
  },

  // Now I can use this dataset:
  function(data) {

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.date.toLocaleString('default', {month: 'long'}); }))
    .padding(0.2);

  // Append X axis onto SVG
  cust_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain").remove()
    .selectAll("text")
      .attr("transform", "translate(-12,10)rotate(-90)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 400])
    .range([ height, 0]);
  cust_svg.append("g")
    .call(d3.axisLeft(y));

  // Y axis label:
  cust_svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "18px")
          .attr("transform", "rotate(-90)")
          .attr("y", - margin.left + 85)
          .attr("x", - margin.top)
          .text("# of Unique Customers")

  // Bars
  cust_svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("class", "data-bar")
      .attr("fill", "#484D6D")
      // Add interactivity --> tooltip 
      .on("mouseover", function(d) {
        bar_div.transition()
          .duration(200)
          .style("opacity", 1);
        bar_div
          .html("Month: " + d3.timeFormat("%B")(d.tool_date) + "<br/>" + "Customers: " + d.value)
          .style("left", (d3.event.pageX) + "px")     
          .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout", function(d) {
        bar_div.transition()
          .duration(200)
          .style("opacity", 0);
      });
 
      // TODO: Work on Data Labels
      bar_div.append("text")
        .text(function(d) { return d; })
        .style('font', '10px sans-serif')
        .attr({
          fill: 'white', 
          'alignment-baseline': 'before-edge',
          'text-anchor': 'middle'
        });
        
  });

//////////////////////////////  
// Chloropleth Shipping Map //
//////////////////////////////

// SVG: Customer Bar Chart
var map_svg = d3.select("#map_chart")
    .append("svg")
        .attr("width", (width + margin.left + margin.right))
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


// Designate the color range
var lowColor = '#E5E8E8'
var highColor = '#484D6D'

// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([830]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

// Append Div for tooltip to SVG
var tt_div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);


// Load in my states data!
d3.csv("/406Amunition_SalesAnalysis/data/state_grouped.csv", function(data) {
	var dataArray = [];
	for (var d = 0; d < data.length; d++) {
		dataArray.push(parseFloat(data[d].value))
	}
	var minVal = d3.min(dataArray)
	var maxVal = 550000 //Hard Coded: d3.max(dataArray)
	var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
	
  // Load GeoJSON data and merge with states data
  d3.json("https://gist.githubusercontent.com/wboykinm/dbbe50d1023f90d4e241712395c27fb3/raw/9753ba3a47f884384ab585a42fc1be84a4a474ca/us-states.json", function(json) {

    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

      // Grab State Name
      var dataState = data[i].state;

      // Grab data value 
      var dataValue = data[i].value;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState == jsonState) {

          // Copy the data value into the JSON
          json.features[j].properties.value = dataValue;

          // Stop looking through the JSON
          break;
        }
      }
    }

    // Bind the data to the SVG and create one path per GeoJSON feature
    map_svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) { return ramp(d.properties.value) })
      .on("mouseover", function(d) {
        tt_div.transition()
          .duration(200)
          .style("opacity", .9);
        tt_div.html("State: " + d.properties.name + "<br/>" + "Sales: " + d3.format("($,.2f")(d.properties.value))
          .style("left", (d3.event.pageX) + "px")     
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tt_div.transition()        
           .duration(500)      
           .style("opacity", 0);
      });
    
		// add a legend
		var w = 140, h = 300;

// Legend
		var key = d3.select("#map_legend")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", highColor)
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", lowColor)
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 100)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

    // Add Label to Legend axis
    key.append("text")
          .attr("text-anchor", "end")
          .attr("font-size", "18px")
          .attr("transform", "rotate(-90)")
          .attr("y", - margin.left + 85)
          .attr("x", - margin.top - 225)
          .text("($) Sold")

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([minVal, maxVal]);

    // Add axis to legend
		var yAxis = d3.axisRight(y).tickFormat(d3.format("($,.0f"));

    // append legend to svg object
		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(41,10)")
			.call(yAxis);
    
    });
});



