function addViolin(svg, dataOfBin, height, width, domain, imposeMax, violinColor){


		var data = d3.histogram()
					.thresholds(resolution)
					(dataOfBin);

        var y = d3.scaleLinear()
                    .range([width/2, 0])
                    .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.length; }))]);

        var x = d3.scaleLinear()
                    .range([height, 0])
                    .domain(domain)
                    .nice();


        var area = d3.area()
           // .interpolate(interpolation)
		   //Folgende Linie wurde nur ergänzt
			.curve(d3.curveCardinal)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x1/2)
                   return x(d.x);
                })
            .y0(width/2)
            .y1(function(d) { return y(d.length); });
			
// const area = d3.area()
    // .curve(d3.curveCardinal)
    // .x(d => xScale(parseTime(d.data.date)))
    // .y0(d => yScale(d[0] || 0))
    // .y1(d => yScale(d[1] || 0));



        var line=d3.line()
            //.interpolate(interpolation)
			//Ergänzte folgende Linie
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

        gPlus.attr("transform", "rotate(90,0,0)  translate(0,-"+width+")");//translate(0,-200)");
        gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");


}

function addBoxPlot(svg, dataOfBin, height, width, domain, boxPlotWidth, boxColor, boxInsideColor){
        var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain(domain);

        var x = d3.scaleLinear()
                    .range([0, width])

        var left=0.5-boxPlotWidth/2;
        var right=0.5+boxPlotWidth/2;

        var probs=[0.05,0.25,0.5,0.75,0.95];
        for(var i=0; i<probs.length; i++){
            probs[i]=y(d3.quantile(dataOfBin, probs[i]))
        }

        svg.append("rect")
            .attr("class", "boxplot fill")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
            .style("fill", boxColor);

        var iS=[0,2,4];
        var iSclass=["","median",""];
        var iSColor=[boxColor, boxInsideColor, boxColor]
        for(var i=0; i<iS.length; i++){
            svg.append("line")
                .attr("class", "boxplot "+iSclass[i])
                .attr("x1", x(left))
                .attr("x2", x(right))
                .attr("y1", probs[iS[i]])
                .attr("y2", probs[iS[i]])
                .style("fill", iSColor[i])
                .style("stroke", iSColor[i]);
        }

        var iS=[[0,1],[3,4]];
        for(var i=0; i<iS.length; i++){
            svg.append("line")
                .attr("class", "boxplot")
                .attr("x1", x(0.5))
                .attr("x2", x(0.5))
                .attr("y1", probs[iS[i][0]])
                .attr("y2", probs[iS[i][1]])
                .style("stroke", boxColor);
        }

        svg.append("rect")
            .attr("class", "boxplot")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
            .style("stroke", boxColor);

        svg.append("circle")
            .attr("class", "boxplot mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(dataOfBin)))
            .attr("r", x(boxPlotWidth/5))
            .style("fill", boxInsideColor)
            .style("stroke", 'None');

        svg.append("circle")
            .attr("class", "boxplot mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(dataOfBin)))
            .attr("r", x(boxPlotWidth/10))
            .style("fill", boxColor)
            .style("stroke", 'None');


}

var margin={top:10, bottom:30, left:30, right:10};

var width=600;
var height=250;
var boxWidth=30;
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
	var regionChart = document.getElementById("view3");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	var domain=[0, 370];
	var y = d3.scaleLinear()
				.range([height-margin.bottom, margin.top])
				.domain(domain);
	
	var yAxis = d3.axisLeft()
					.scale(y)
					.ticks(5)
					.tickSize(5,0,5);
	
	
	var svg = d3.select("div#view3")
				.append("div")
				.classed("svg-container2", true)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "0 0 360 220")
				.classed("svg-content-responsive", true);
				
	
	svg.append("line")
		.attr("class", "boxplot")
		.attr("x1", margin.left)
		.attr("x2", width-margin.right)
		.attr("y1", y(0))
		.attr("y2", y(0));
	
	for(var i=0; i<data.length; i++){
		data[i].Haltezeiten=data[i].Haltezeiten.sort(d3.ascending)
		var g=svg.append("g").attr("transform", "translate("+(i*(boxWidth+boxSpacing)+margin.left)+",0)");
		addViolin(g, data[i].Haltezeiten, height, boxWidth, domain, 0.25, "#cccccc");
		addBoxPlot(g, data[i].Haltezeiten, height, boxWidth, domain, .15, "black", "white");
	
	}
	
	svg.append("g")
		.attr('class', 'axis')
		.attr("transform", "translate("+margin.left+",0)")
		.call(yAxis);
		
}