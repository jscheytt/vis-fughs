var parseTime = d3.timeParse("%H:%M");

var width = 300;
var height = 150;

var max = 0;

var xNudge = 50;
var yNudge = 20;

var minDate = new Date();
var maxDate = new Date();

var formatxAxis = d3.timeFormat("%H:%M"); //for days


function showView5(data){
	parseTime = d3.timeParse("%H:%M");
	formatxAxis = d3.timeFormat("%H:%M");
	if(parseTime(data[0].Zeitpunkt) == null){
		parseTime = d3.timeParse("%d.%m.%Y");
		formatxAxis = d3.timeFormat("%d.%m.%y"); //for month, complete, week
	}
	 
	
	//clear region for chart
	var regionChart = document.getElementById("view5Diagram");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	//data = [{Zeitpunkt: 10.00 Uhr, Anzahl: 10}, {Zeitpunkt: 11.00 Uhr, Anzahl: 30}, {Zeitpunkt: 12.00 Uhr, Anzahl: 20}]
	
	max = d3.max(data, function(d) { return d.Anzahl; });
	minDate = d3.min(data, function(d) {return parseTime(d.Zeitpunkt); }); //eventuell Zeitpunkt parsen parseDate(d.Zeitpunkt)
	maxDate = d3.max(data, function(d) { return parseTime(d.Zeitpunkt); });
	
	
	var y = d3.scaleLinear()
				.domain([0,max])
				.range([height,0]);
	
	var x = d3.scaleTime()
				.domain([minDate,maxDate])
				.range([0,width]);
	
	var yAxis = d3.axisLeft(y);
	
	var xAxis = d3.axisBottom(x);
	
	xAxis.tickFormat(formatxAxis);
	
	var svg = d3.select("div#view5Diagram")
				.append("div").classed("svg-container", true)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "0 0 380 220")
				.classed("svg-content-responsive", true);
	
	var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");
	
	var line = d3.line()
		.x(function(d){ return x(parseTime(d.Zeitpunkt)); })
		.y(function(d){ return y(d.Anzahl); })
		.curve(d3.curveLinear);

	chartGroup.append("path")
		.attr("class","line2")
		.attr("d",function(d){ return line(data); })

	svg.selectAll("dot")
		.data(data)
		.enter().append("circle")
		.attr("r", 3)
		.attr("class","dot")
		.attr("transform","translate("+xNudge+","+yNudge+")")
		.attr("cx", function(d) {return x(parseTime(d.Zeitpunkt)); })
		.attr("cy", function(d) { return y(d.Anzahl); });

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("width", width)
		.attr("transform","translate(0,"+height+")")
		.call(xAxis)
		.selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)" );;
		
	// Add the text label for the x axis
	svg.append("text")
		.attr("transform", "translate(" + (width / 1.62) + " ," + (height * 1.35) + ")")
		.style("text-anchor", "right")
		.style ("font-size", "10px")
		.style ("font-weight", "bold");
		//.text("Zeitpunkt");
	
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
	
}