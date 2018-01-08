var parseTime = d3.timeParse("%H:%M");

var width = 300;
var height = 150;

var max = 0;
var min = 0;

var xNudge = 50;
var yNudge = 20;

var minDate = new Date();
var maxDate = new Date();

var formatxAxis = d3.timeFormat("%H:%M"); //for days


function showView5(data){
	parseTime = d3.timeParse("%H:%M");
	formatxAxis = d3.timeFormat("%H:%M");
	if(data != null && data.length > 0 && parseTime(data[0].Zeitpunkt) == null){
		parseTime = d3.timeParse("%d.%m.%Y");
		formatxAxis = d3.timeFormat("%d.%m.%y"); //for month, complete
	}
	if(data != null && data.length > 0 && timestep == 2){ //week
		parseTime = d3.timeParse("%d.%m.%Y %H:%M");
		formatxAxis = d3.timeFormat("%d.%m.%y"); //for month, complete
	}
	
	//clear region for chart
	var regionChart = document.getElementById("view5Diagram");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	
	if(data != null && data.length > 0){
		//data = [{Zeitpunkt: 10.00 Uhr, Anzahl: 10}, {Zeitpunkt: 11.00 Uhr, Anzahl: 30}, {Zeitpunkt: 12.00 Uhr, Anzahl: 20}]
		max = d3.max(data, function(d) { return d.Anzahl; });
		min = d3.min(data, function(d) { return d.Anzahl; });
		if(min >= 0){
			min = 0;
		}
		minDate = d3.min(data, function(d) {return parseTime(d.Zeitpunkt); }); //eventuell Zeitpunkt parsen parseDate(d.Zeitpunkt)
		maxDate = d3.max(data, function(d) { return parseTime(d.Zeitpunkt); });
	}else{
		max = 0;
		min = 0;
		parseTime = d3.timeParse("%d.%m.%Y");
		formatxAxis = d3.timeFormat("%d.%m.%y"); //for month, complete, week
		minDate = parseTime(selectedTime);
		maxDate = parseTime(selectedTime);
	}
	
	
	var y = d3.scaleLinear()
				.domain([min,max])
				.range([height,0]);
	
	var x = d3.scaleTime()
				.domain([minDate,maxDate])
				.range([0,width]);
	
	var yAxis = d3.axisLeft(y);
	
	var xAxis = d3.axisBottom(x);
	
	xAxis.tickFormat(formatxAxis);
	
	if(timestep == 2){
		xAxis.ticks(7);
	}
	
	var svg = d3.select("div#view5Diagram")
				.append("div").classed("svg-container-view5", true)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "0 0 380 220")
				.classed("svg-content-responsive-view5", true);
	
	var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");
	
	//if(data != null && data.length > 0){
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
			.append("line")
			.attr("y1",  y(0))
			.attr("y2", y(0))
			.attr("x2", width);
				
		chartGroup.append("g")
			.attr("width", width)
			.attr("transform","translate(0,"+height+")")
			.call(xAxis)
			.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-45)" );

		chartGroup.select(".domain").remove();
		
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
		.attr("y", -23)
		.attr("x",0 - (height / 1.65))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style ("font-size", "12px")
		.style ("font-weight", "bold")
		.text("Anzahl Passagiere");
			

	// Add the text label for the x axis
	svg.append("text")
	    .attr("transform", "translate(" + (width / 1.5) + " ," + (height * 1.52) + ")")
		.style("text-anchor", "middle")
		.style ("font-size", "12px")
		.style ("font-weight", "bold")
		.text("gewählter Zeitraum");
}