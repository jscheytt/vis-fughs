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

function addBoxPlot(svg, dataOfBin, heightPlot, widthPlot, domain, boxPlotWidth, boxColor, boxInsideColor){
        // var y = d3.scaleLinear()
                    // .range([heightPlot, 0])
                    // .domain(domain);

        // var x = d3.scaleLinear()
                    // .range([0, widthPlot])

        // var left=0.5-boxPlotWidth/2;
        // var right=0.5+boxPlotWidth/2;

        // var probs=[0.05,0.25,0.5,0.75,0.95];
        // for(var i=0; i<probs.length; i++){
            // probs[i]=y(d3.quantile(dataOfBin, probs[i]))
        // }

        // svg.append("rect")
            // .attr("class", "boxplot fill")
            // .attr("x", x(left))
            // .attr("width", x(right)-x(left))
            // .attr("y", probs[3])
            // .attr("height", -probs[3]+probs[1])
            // .style("fill", boxColor);

        // var iS=[0,2,4];
        // var iSclass=["","median",""];
        // var iSColor=[boxColor, boxInsideColor, boxColor]
        // for(var i=0; i<iS.length; i++){
            // svg.append("line")
                // .attr("class", "boxplot "+iSclass[i])
                // .attr("x1", x(left))
                // .attr("x2", x(right))
                // .attr("y1", probs[iS[i]])
                // .attr("y2", probs[iS[i]])
                // .style("fill", iSColor[i])
                // .style("stroke", iSColor[i]);
        // }

        // var iS=[[0,1],[3,4]];
        // for(var i=0; i<iS.length; i++){
            // svg.append("line")
                // .attr("class", "boxplot")
                // .attr("x1", x(0.5))
                // .attr("x2", x(0.5))
                // .attr("y1", probs[iS[i][0]])
                // .attr("y2", probs[iS[i][1]])
                // .style("stroke", boxColor);
        // }

        // svg.append("rect")
            // .attr("class", "boxplot")
            // .attr("x", x(left))
            // .attr("width", x(right)-x(left))
            // .attr("y", probs[3])
            // .attr("height", -probs[3]+probs[1])
            // .style("stroke", boxColor);

        // svg.append("circle")
            // .attr("class", "boxplot mean")
            // .attr("cx", x(0.5))
            // .attr("cy", y(d3.mean(dataOfBin)))
            // .attr("r", x(boxPlotWidth/5))
            // .style("fill", boxInsideColor)
            // .style("stroke", 'None');

        // svg.append("circle")
            // .attr("class", "boxplot mean")
            // .attr("cx", x(0.5))
            // .attr("cy", y(d3.mean(dataOfBin)))
            // .attr("r", x(boxPlotWidth/10))
            // .style("fill", boxColor)
            // .style("stroke", 'None');


}

var marginPlot={top:10, bottom:0, left:30, right:10};

var widthPlot=400;
var heightPlot=220;
var boxWidth=44;
var boxSpacing=10;

var resolution=1000;
var d3ObjId="svgElement1";
var interpolation='step-before';


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
	
	// .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.length; }))]);
	
	// Idee: var max = d3.max(data, function(d) {return d.length; }); 
	//In folgender Zeile dann 370 mit max ersetzen
	
	var domain=[0, 370];
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
				.classed("svg-container2", true)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "0 0 430 430")
				.classed("svg-content-responsive", true);
				
	
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
		addBoxPlot(g, data[i].Haltezeiten, heightPlot, boxWidth, domain, .15, "black", "white");
	
	}
	
	svg.append("g")
		.attr('class', 'axis')
		.attr("transform", "translate("+marginPlot.left+",0)")
		.call(yAxis);
		
	svg.append("g")
		.attr("transform", "translate(0,220)")
		.call(xAxis);					
}