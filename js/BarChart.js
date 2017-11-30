// set the dimensions and margin1s of the graph
var margin1 = {top: 20, right: 60, bottom: 40, left: 20},
    width1 = 700 - margin1.left - margin1.right,
    height1 = 130 - margin1.top - margin1.bottom;

// declarate Tooltip
var tooltipJanis = d3.select("div").append("div").attr("class", "toolTip");

var x1 = d3.scaleBand()
          .range([0, width1])
          .padding(0.5);
		 
var y1 = d3.scaleLinear()
          .range([height1, 0]);

// declarate colours for bars          
var colours = d3.scaleOrdinal()
    .range(["#000", "#000"]);
// append the svg object to the #barchart of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin1
var svg1 = d3.select("#barchart").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin1.left*2 + "," + margin1.top + ")");

	// get the data
	d3.csv("data/BarChart_w.csv", function(error, data) {
	if (error) throw error;

		// format the data
		data.forEach(function(d) {
			d.passenger = +d.passenger;
		});

		// Scale the range of the data in the domains
		x1.domain(data.map(function(d) { return d.timeJanis; }));
		y1.domain([0, d3.max(data, function(d) { return d.passenger; })]);

		// declare y axis with ticks
		var yAxis1 = d3.axisLeft(y1);
		yAxis1.ticks(5);
		
		// axis label for y axis
		svg1.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - 40)
			.attr("x",0 - (height1 / 1.65))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style ("font-size", "10px")
			.style ("font-weight", "bold")
			.text("Ein/Aussteiger");

	  
		// add the x Axis
		svg1.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height1 + ")")
			.call(d3.axisBottom(x1))
			// rotate elements on x axis 
			.selectAll("text")
			.attr("y", 0)
			.attr("x", 15)
			.attr("dx", "-0.18em")
			.attr("dy", ".35em")
			.attr("transform", "rotate(50)")
			.style("text-anchor", "start");
	
		// x axis label
		svg1.append("text")
			.attr("class", "axis axis--y")
			.attr("transform", "translate(" + (width1*1.01) + " ," + (height1*1) + ")")
			.style("text-anchor", "right")
			.style ("font-size", "10px")
			.style ("font-weight", "bold")
			.text("Tage");
	  
		// only every 5th tick shall be shown
		var ticksJanis = d3.selectAll(".tick text");
		ticksJanis.style("display", function (d, i) { return i % 5 ? "none" : "initial" })

				

		// 
		svg1.append("g")
			.call(yAxis1);
			
		/* svg1.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x1(d.timeJanis); })
			.attr("width", x1.bandwidth())
			.attr("y", function(d) { return y1(d.passenger); })
			.attr("height", function(d) { return height1 - y1(d.passenger); }) */
		
		
		var barsJanis = svg1.selectAll(".bar").data(data)
			.enter().append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { return "translate(" + x1(d.timeJanis) + ", " + y1(d.passenger) + ")" });
		var rectsJanis = barsJanis.append("rect")
		// ---- add a className for easy selecting 
			.attr("class", "bar")
			.attr("width", x1.bandwidth())
			.attr("height", function(d){return height1-y1(d.passenger);})
			.attr("fill", "steelblue")					
			.attr("fill", function(d) { return colours(d.timeJanis); })
			.on("mousemove", function(d){
				tooltipJanis
				.style("left", d3.event.pageX - 50 + "px")
				.style("top", d3.event.pageY - 70 + "px")
				.style("display", "inline-block")
				.html((d.timeJanis) + "<br>" + "Ein/Aussteiger: " + (d.passenger));
			})
			.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
	});