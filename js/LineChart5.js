var parseDate = d3.timeParse("%H:%M:%S");

var width = 300;
var height = 150;

var max = 0;

var xNudge = 50;
var yNudge = 20;

var minDate = new Date();
var maxDate = new Date();

var formatxAxis = d3.timeFormat("%H:%M");

//Daten bekommen
d3.csv("data/LineChart5.csv")
    .row(function(d) { return { time: parseDate(d.time), amount: Number(d.amount)}; })
    .get(function(error, rows) {
	    max = d3.max(rows, function(d) { return d.amount; });
	    minDate = d3.min(rows, function(d) {return d.time; });
		maxDate = d3.max(rows, function(d) { return d.time; });


		var y = d3.scaleLinear()
					.domain([0,max])
					.range([height,0]);

		var x = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([0,width]);

		var yAxis = d3.axisLeft(y);

		var xAxis = d3.axisBottom(x);
		
		xAxis.tickFormat(formatxAxis);

		var line = d3.line()
			.x(function(d){ return x(d.time); })
			.y(function(d){ return y(d.amount); })
			.curve(d3.curveCardinal);


		var svg = d3.select("div#view5")
					.append("div").classed("svg-container", true)
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 600 400")
					.classed("svg-content-responsive", true);
		
		var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

		chartGroup.append("path")
			.attr("class","line2")
			.attr("d",function(d){ return line(rows); })


		chartGroup.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);
			
		// Add the text label for the x axis
		svg.append("text")
			.attr("transform", "translate(" + (width / 1.62) + " ," + (height * 1.35) + ")")
			.style("text-anchor", "right")
			.style ("font-size", "10px")
			.style ("font-weight", "bold")
			.text("Uhrzeit");

		chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis);
			
			
		// Add the text label for the Y axis
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0)
			.attr("x",0 - (height / 1.65))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style ("font-size", "10px")
			.style ("font-weight", "bold")
			.text("Anzahl Passagiere");

	});