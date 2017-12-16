// var margin = {left: 0, right: 0, top: 0, bottom: 0 };

// var width = 480 - margin.left - margin.right;
// var height = 250 - margin.top - margin.bottom;


// var max = 0;

// var xNudge = 50;
// var yNudge = 20;

// var minDate = 0;
// var maxDate = 0;

// var formatxAxis3 = d3.format('.0f');


// //Daten bekommen
// d3.csv("data/LineChart3.csv")
    // .row(function(d) { return { mins: Number(d.mins), amount: Number(d.amount)}; })
    // .get(function(error, rows) {
	    // max = d3.max(rows, function(d) { return d.amount; });
		// maxDate = d3.max(rows, function(d) { return d.mins; });


		// var y = d3.scaleLinear()
					// .domain([0,max])
					// .range([height,0]);

		// var x = d3.scaleLinear()
					// .domain([0,maxDate])
					// .range([0,width]);
					
		
					
		// var yAxis = d3.axisLeft(y);

		// var xAxis = d3.axisBottom(x);
		
		// xAxis.tickFormat(formatxAxis3)
			// .ticks(maxDate);

		// var line = d3.line()
			// .x(function(d){ return x(d.mins); })
			// .y(function(d){ return y(d.amount); })
			// .curve(d3.curveCardinal);


		// // var svg = d3.select("div#view3").append("div").classed("svg-container", true).append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 600 400").classed("svg-content-responsive", true); 
		
		// var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

		// chartGroup.append("path")
			// .attr("class","line1")
			// .attr("d",function(d){ return line(rows); })

		// svg.selectAll("dot")
			// .data(rows)
			// .enter().append("circle")
			// .attr("r", 4)
			// .attr("class","dot")
			// .attr("transform","translate("+xNudge+","+yNudge+")")
			// .attr("cx", function(d) { return x(d.mins); })
			// .attr("cy", function(d) { return y(d.amount); });


		// chartGroup.append("g")
			// .attr("class","axis x")
			// .attr("width", width)
			// .attr("transform","translate(0,"+height+")")
			// .call(xAxis);

		// // Add the text label for the x axis
		// svg.append("text")
			// .attr("transform", "translate(" + (width / 1.62) + " ," + (height * 1.35) + ")")
			// .style("text-anchor", "right")
			// .style ("font-size", "10px")
			// .style ("font-weight", "bold")
			// .text("Minuten");

		// chartGroup.append("g")
			// .attr("class","axis y")
			// .call(yAxis);
			
			
		// // Add the text label for the Y axis
		// svg.append("text")
			// .attr("transform", "rotate(-90)")
			// .attr("y", 0)
			// .attr("x",0 - (height / 1.65))
			// .attr("dy", "1em")
			// .style("text-anchor", "middle")
			// .style ("font-size", "10px")
			// .style ("font-weight", "bold")
			// .text("Anzahl Passagiere");
			

	// });