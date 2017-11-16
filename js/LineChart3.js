var parseDate = d3.timeParse("%m/%d/%Y");

var margin = {left: 50, right: 20, top: 20, bottom: 50 };

var width = 480 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;


var max = 0;

var xNudge = 50;
var yNudge = 20;

var minDate = new Date();
var maxDate = new Date();



//Daten bekommen
d3.csv("data/LineChart3.csv")
    .row(function(d) { return { month: parseDate(d.month), price: Number(d.price)}; })
    .get(function(error, rows) {
	    max = d3.max(rows, function(d) { return d.price; });
	    minDate = d3.min(rows, function(d) {return d.month; });
		maxDate = d3.max(rows, function(d) { return d.month; });


		var y = d3.scaleLinear()
					.domain([0,max])
					.range([height,0]);

		var x = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([0,width]);

		var yAxis = d3.axisLeft(y);

		var xAxis = d3.axisBottom(x);

		var line = d3.line()
			.x(function(d){ return x(d.month); })
			.y(function(d){ return y(d.price); })
			.curve(d3.curveCardinal);


		var svg = d3.select("div#view3").append("div").classed("svg-container", true).append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 600 400").classed("svg-content-responsive", true); 
		
		var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

		chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(rows); })


		chartGroup.append("g")
			.attr("class","axis x")
			.attr("width", width)
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		// Add the text label for the x axis
		svg.append("text")
			.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
			.style("text-anchor", "right")
			.text("Minuten");

		chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis);
			
			
		// Add the text label for the Y axis
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Anzahl Passagiere");

	});