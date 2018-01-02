function addViolin(svg, dataOfBin, heightPlot, widthPlot, domain, imposeMax, violinColor){


		var data = d3.histogram()
					.thresholds(resolution)
					(dataOfBin);

        var y = d3.scaleLinear()
                    .range([widthPlot/2, 0])
                    .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.length; }))]);

        var x = d3.scaleLinear()
                    .range([heightPlot, 0])
                    .domain(domain)
                    .nice();


        var area = d3.area()
			.curve(d3.curveCardinal)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x1/2)
                   return x(d.x);
                })
            .y0(widthPlot/2)
            .y1(function(d) { return y(d.length); });

			
        var line=d3.line()
			.curve(d3.curveCardinal)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x1/2)
                   return x(d.x);
                })
            .y(function(d) { return y(d.length); });

        var gPlus=svg.append("g")
        var gMinus=svg.append("g")

        gPlus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .style("fill", violinColor);

        gPlus.append("path")
          .datum(data)
          .attr("class", "violin")
          .attr("d", line)
          .style("stroke", violinColor);


        gMinus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .style("fill", violinColor);

         gMinus.append("path")
           .datum(data)
           .attr("class", "violin")
           .attr("d", line)
           .style("stroke", violinColor);

        gPlus.attr("transform", "rotate(90,0,0)  translate(0,-"+widthPlot+")");//translate(0,-200)");

        gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");


}

var marginPlot={top:10, bottom:0, left:30, right:10};

var widthPlot=400;
var heightPlot=220;
var boxWidth=44;
var boxSpacing=10;

var resolution=1000;
var d3ObjId="svgElement1";
var interpolation='step-before';

// var max = 0;
// var min = 0;


function showView3(data){
	//Die Methode showView3 wird mit einem Array als Parameter aufgerufen das die Daten für die View in folgendem Format enthält: 
	//JSON.parse(requestData.responseText) -> [{Bin: 1, Haltezeiten: [10, 17, 35]}, {Bin: 2, Haltezeiten: [22, 24]}, {Bin: 3, Haltezeiten: [8, 19, 200]}]
	//Zugriff auf die Daten:
	//data[0].Bin -> 1, data[0].Haltezeiten -> [10, 17, 35]
		
	//clear region for chart
	var regionChart = document.getElementById("view3Diagram");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	if(selectedStations[0] != "" && selectedStations[1] == "" && 
		(selectedStations[0] == "Pinneberg" || 
		selectedStations[0] == "Wedel" || 
		selectedStations[0] == "Poppenbuettel" || 
		selectedStations[0] == "Aumuehle" || 
		selectedStations[0] == "Stade" || 
		(selectedStations[0] == "Hamburg-Altona" && zoomSelection.length == 1 && zoomSelection[0] == "S2") || 
		(selectedStations[0] == "Elbgaustrasse" && zoomSelection.length == 1 && zoomSelection[0] == "S21") ||
		(selectedStations[0] == "Blankenese" && zoomSelection.length == 1 && zoomSelection[0] == "S11") ||
		(selectedStations[0] == "Hamburg-Altona" && zoomSelection.length == 1 && zoomSelection[0] == "S31") ||
		(selectedStations[0] == "Hamburg-Altona" && zoomSelection.length == 2 && zoomSelection.includes("S31") && zoomSelection.includes("S2")) ||
		(selectedStations[0] == "Hamburg-Bergedorf" && zoomSelection.length == 1 && zoomSelection[0] == "S2") ||
		(selectedStations[0] == "Neugraben" && zoomSelection.length == 1 && zoomSelection[0] == "S31")
		)){
			regionChart.innerHTML = "<img alt=\"Enstation\" src=\"img/Endstation.png\" width=\"150px\" style=\"margin-top:50px\">";
			return;
	}
	
	var max = 0;
	 if(data != null && data.length > 0){
		max = d3.max(data, function(d) { return Math.max.apply(null, d.Haltezeiten); });
	 }
	
	var domain=[0, max];
	
	
	var y = d3.scaleLinear()
				.range([heightPlot-marginPlot.bottom, marginPlot.top])
				.domain(domain);
	
	var yAxis = d3.axisLeft()
					.scale(y)
					.ticks(5)
					.tickSize(5,0,5);
					
	var steps = 50;
	var scale = d3.scalePoint()
	  .range([51.2, 376])
	  .domain(d3.range(data.length));
	var xAxis = d3.axisBottom(scale)
					.tickFormat(function(d, i) {
						return i ? (d * steps) + 1 + " - " + (d * steps + steps) : (d * steps) + " - " + (d * steps + steps);
	  });
	  

	var svg = d3.select("div#view3Diagram")
				.append("div")
				.classed("svg-container-view3", true)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				// .attr("viewBox", "0 0 430 430")
				.classed("svg-content-responsive-view3", true);
				
	
	svg.append("line")
		.attr("class", "boxplot")
		.attr("x1", marginPlot.left)
		.attr("x2", widthPlot-marginPlot.right)
		.attr("y1", y(0))
		.attr("y2", y(0));
	
	for(var i=0; i<data.length; i++){
		data[i].Haltezeiten=data[i].Haltezeiten.sort(d3.ascending)
		var g=svg.append("g").attr("transform", "translate("+(i*(boxWidth+boxSpacing)+marginPlot.left)+",0)");
		addViolin(g, data[i].Haltezeiten, heightPlot, boxWidth, domain, 0.25, "#424242");
	}
	
	svg.append("g")
		.attr('class', 'axis')
		.attr("transform", "translate("+marginPlot.left+",0)")
		.call(yAxis);
		
	svg.append("g")
		.attr("transform", "translate(0,220)")
		.call(xAxis);
		
	// Add Sekunden Label
	// svg.append("text")
		// .attr("transform", "translate(" + (width / 1000) + " ," + (height / 20) + ")")
		// .style("text-anchor", "right")
		// .attr("x", -10)
		// .style ("font-size", "12px")
		// .text("in [s]");
	
	// Add the text label for the Y axis
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -15)
		.attr("x",0 - (height / 1.65))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style ("font-size", "12px")
		.style ("font-weight", "bold")
		.text("Haltedauer in [s]");
		
}