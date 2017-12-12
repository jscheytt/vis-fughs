function showView2(valueJanis2) {
	//DataCommunication Zeile 150 einkommentieren, dann wird der Wert des Paramerters valueJanis ein Array mit den Daten vom Server im Format valueJanis = [{Datum: "01.11.2000", AnzahlEin: 1200, AnzahlAus: 3000}, {Datum: "01.12.2000", AnzahlEin: 2300, AnzahlAus: 600}]
	//Zugriff: valueJanis[0].Datum -> "01.11.2000", valueJanis[0].AnzahlEin ->1200, valueJanis[0].AnzahlAus -> 600
	
	
	//clear region for bar-chart
	var regionBarChart = document.getElementById("barchart");
	if(regionBarChart != null){
		regionBarChart.innerHTML = "";
	}
	
	// set the dimensions and margin1s of the graph
	var margin1 = {top: 20, right: 120, bottom: 40, left: 40},
		width1 = 700 - margin1.left - margin1.right,
		height1 = 130 - margin1.top - margin1.bottom;

	// declarate Tooltip
	var tooltipJanis = d3.select("div").append("div").attr("class", "toolTipJanis");

	var xJanis = d3.scaleBand()
			  .range([0, width1])
			  .padding(0.5);
			 
	var yJanis = d3.scaleLinear()
			  .range([height1, 0]);
			  

	var z1 = d3.scaleOrdinal(d3.schemeCategory20);
	console.log(z1);
	// append the svg object to the #barchart of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin1
	var svg1 = d3.select("#barchart").append("svg")
		.attr("width", width1 + margin1.left + margin1.right)
		.attr("height", height1 + margin1.top + margin1.bottom)
	  .append("g")
		.attr("transform", 
			  "translate(" + margin1.left + "," + margin1.top + ")");
	
	var stack = d3.stack();
		var ein = document.getElementById("EinsteigerCheckbox");
		var aus = document.getElementById("AussteigerCheckbox");
		
		if(timestep == 1)	{
			if(ein.checked && aus.checked == true) {
		// Lade Monat
			
					// console.log(valueJanis2);	
					//var data = valueJanis;
						
					 var data = [{Datum:"Woche3", AnzahlEin:28, AnzahlAus:30},
								{Datum:"Woche4", AnzahlEin:38, AnzahlAus:30},
								{Datum:"Woche5", AnzahlEin:48, AnzahlAus:30},
								{Datum:"Woche6", AnzahlEin:58, AnzahlAus:30}]  
					// console.log(data);			
								
					
					//data.sort(function(a, b) { return b.total - a.total; });
					
					// format the data
					data.forEach(function(d) {
						d.AnzahlEin = +d.AnzahlEin;
						d.AnzahlAus = +d.AnzahlAus;
					});
					
					
					// Scale the range of the data in the domains
					xJanis.domain(data.map(function(d) { return d.Datum; }));
					yJanis.domain([0, (d3.max(data, function(d) { return d.AnzahlEin })) + (d3.max(data, function(d) { return d.AnzahlAus }))]).nice();
					z1.domain(["AnzahlEin","AnzahlAus"]);

					// declare y axis with ticks
					var yAxisJanis = d3.axisLeft(yJanis);
					yAxisJanis.ticks(5);
					 
					// create y axis
					svg1.append("g")
						.call(yAxisJanis);
					  
					// axis label for y axis
					svg1.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 0 - 40)
						.attr("x",0 - (height1 / 1.65))
						.attr("dy", "1em")
						.style("text-anchor", "middle")
						.style ("font-size", "10px")
						.style ("font-weight", "bold")
						.text("Ein/AnzahlAus");

				  
					// add the x Axis
					svg1.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height1 + ")")
						.call(d3.axisBottom(xJanis))
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
				  
					// create legend Ein/AnzahlAus
					var legend = svg1.selectAll(".legend")
							.data(["AnzahlAus","AnzahlEin"])
							.enter().append("g")
							  .attr("class", "legend")
							  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
							  .style("font", "10px sans-serif");

						  legend.append("rect")
							  .attr("x", width1 + 18)
							  .attr("width", 18)
							  .attr("height", 18)
							  .attr("fill", z1);

						  legend.append("text")
							  .attr("x", width1 + 44)
							  .attr("y", 9)
							  .attr("dy", ".35em")
							  .attr("text-anchor", "start")
							  .text(function(d) { return d; });
							  
							  
					// create bars, tooltip, hover		  
					var barsJanis = svg1.selectAll(".bar")
					.data(stack.keys(["AnzahlAus","AnzahlEin"])(data))
					.enter().append("g")
					  .attr("class", "bar")
					  .attr("fill", function(d) { return z1(d.key); })
					.selectAll("rect")
					.data(function(d) { return d; })
					.enter().append("rect")
					  .attr("x", function(d) { return xJanis(d.data.Datum); })
					  .attr("y", function(d) { return yJanis(d[1]); })
					  .attr("height", function(d) { return yJanis(d[0]) - yJanis(d[1]); })
					  .attr("width", xJanis.bandwidth())
						.on("mousemove", function(d){
							tooltipJanis
							.style("left", d3.event.pageX - 50 + "px")
							.style("top", d3.event.pageY - 90 + "px")
							.style("display", "inline-block")
							.html((d.data.Datum) + "<br>" + "Personen: " + ((d[1] - d[0])));
						})
						.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
					
				
					d3.selectAll("rect").on("click", function(d) {
						alert((d.data.Datum));
					});
								
			}
		
			if(ein.checked && !aus.checked == true) {
			
					
					var data = [{Datum:"Woche3", AnzahlEin:28, AnzahlAus:30},
								{Datum:"Woche4", AnzahlEin:38, AnzahlAus:30},
								{Datum:"Woche5", AnzahlEin:48, AnzahlAus:30},
								{Datum:"Woche6", AnzahlEin:58, AnzahlAus:30}]  
					data.sort(function(a) { return a.total; });
					
					// format the data
					data.forEach(function(d) {
						d.AnzahlEin = +d.AnzahlEin;
					});
					
					
					// Scale the range of the data in the domains
					xJanis.domain(data.map(function(d) { return d.Datum; }));
					yJanis.domain([0, (d3.max(data, function(d) { return d.AnzahlEin }))]);
					

					// declare y axis with ticks
					var yAxisJanis = d3.axisLeft(yJanis);
					yAxisJanis.ticks(5);
					 
					// create y axis
					svg1.append("g")
						.call(yAxisJanis);
					  
					// axis label for y axis
					svg1.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 0 - 40)
						.attr("x",0 - (height1 / 1.65))
						.attr("dy", "1em")
						.style("text-anchor", "middle")
						.style ("font-size", "10px")
						.style ("font-weight", "bold")
						.text("Ein/AnzahlAus");

				  
					// add the x Axis
					svg1.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height1 + ")")
						.call(d3.axisBottom(xJanis))
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
				  
					// create legend Ein/AnzahlAus
					var legend = svg1.selectAll(".legend")
							.data(["AnzahlEin"])
							.enter().append("g")
							  .attr("class", "legend")
							  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
							  .style("font", "10px sans-serif");

						  legend.append("rect")
							  .attr("x", width1 + 18)
							  .attr("width", 18)
							  .attr("height", 18)
							  .attr("fill", z1);

						  legend.append("text")
							  .attr("x", width1 + 44)
							  .attr("y", 9)
							  .attr("dy", ".35em")
							  .attr("text-anchor", "start")
							  .text(function(d) { return d; });
							  
							  
					// create bars, tooltip, hover		  
					var barsJanis = svg1.selectAll(".bar").data(data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) { return "translate(" + xJanis(d.Datum) + ", " + yJanis(d.AnzahlEin) + ")" });
				var rectsJanis = barsJanis.append("rect")
				// ---- add a className for easy selecting 
					.attr("class", "bar")
					.attr("width", xJanis.bandwidth())
					.attr("height", function(d){return height1 - yJanis(d.AnzahlEin);})
					.attr("fill", "steelblue")					
					.on("mousemove", function(d){
						tooltipJanis
						.style("left", d3.event.pageX - 50 + "px")
						.style("top", d3.event.pageY - 90 + "px")
						.style("display", "inline-block")
						.html((d.Datum) + "<br>" + "Ein: " + (d.AnzahlEin));
					})
					.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
					
					// Wenn ein Barchart angeklickt wird
					/* $( "rect" ).click(function() {
					  
					  alert( "Handler for .click() called." + d3.select(this).attr("x"));
					}); */
					d3.selectAll("rect").on("click", function(d) {
						alert((d.Datum));
					});
					
								
			}
		
			if(aus.checked && !ein.checked == true) {
			
					
					var data = [{Datum:"Woche3", AnzahlEin:28, AnzahlAus:30},
								{Datum:"Woche4", AnzahlEin:38, AnzahlAus:30},
								{Datum:"Woche5", AnzahlEin:48, AnzahlAus:30},
								{Datum:"Woche6", AnzahlEin:58, AnzahlAus:30}]  
					data.sort(function(a) { return a.total; });
					
					// format the data
					data.forEach(function(d) {
						d.AnzahlAus = +d.AnzahlAus;
					});
					
					
					// Scale the range of the data in the domains
					xJanis.domain(data.map(function(d) { return d.Datum; }));
					yJanis.domain([0, (d3.max(data, function(d) { return d.AnzahlAus }))]);
					

					// declare y axis with ticks
					var yAxisJanis = d3.axisLeft(yJanis);
					yAxisJanis.ticks(5);
					 
					// create y axis
					svg1.append("g")
						.call(yAxisJanis);
					  
					// axis label for y axis
					svg1.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 0 - 40)
						.attr("x",0 - (height1 / 1.65))
						.attr("dy", "1em")
						.style("text-anchor", "middle")
						.style ("font-size", "10px")
						.style ("font-weight", "bold")
						.text("Ein/AnzahlAus");

				  
					// add the x Axis
					svg1.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height1 + ")")
						.call(d3.axisBottom(xJanis))
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
				  
					// create legend Ein/AnzahlAus
					var legend = svg1.selectAll(".legend")
							.data(["AnzahlAus"])
							.enter().append("g")
							  .attr("class", "legend")
							  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
							  .style("font", "10px sans-serif");

						  legend.append("rect")
							  .attr("x", width1 + 18)
							  .attr("width", 18)
							  .attr("height", 18)
							  .attr("fill", "#aec7e8");

						  legend.append("text")
							  .attr("x", width1 + 44)
							  .attr("y", 9)
							  .attr("dy", ".35em")
							  .attr("text-anchor", "start")
							  .text(function(d) { return d; });
							  
							  
					// create bars, tooltip, hover		  
					var barsJanis = svg1.selectAll(".bar").data(data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) { return "translate(" + xJanis(d.Datum) + ", " + yJanis(d.AnzahlAus) + ")" });
				var rectsJanis = barsJanis.append("rect")
				// ---- add a className for easy selecting 
					.attr("class", "bar")
					.attr("width", xJanis.bandwidth())
					.attr("height", function(d){return height1 - yJanis(d.AnzahlAus);})
					.attr("fill", "#aec7e8")					
					.on("mousemove", function(d){
						tooltipJanis
						.style("left", d3.event.pageX - 50 + "px")
						.style("top", d3.event.pageY - 90 + "px")
						.style("display", "inline-block")
						.html((d.Datum) + "<br>" + "Aussteiger: " + (d.AnzahlAus));
					})
					.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
					
					// Wenn ein Barchart angeklickt wird
					/* $( "rect" ).click(function() {
					  
					  alert( "Handler for .click() called." + d3.select(this).attr("x"));
					}); */
					d3.selectAll("rect").on("click", function(d) {
						alert("Datum: " + d.Datum);
					});
					
								
			}
		}
		if (timestep == 2){
			
			d3.csv("data/BarChart_w.csv", function(error, data) {
			if (error) throw error;
				console.log(data);
				console.log(data.columns.slice(1));
				console.log(data.columns.slice(1).reverse());
				data.sort(function(a, b) { return b.total - a.total; });
				
				// format the data
				data.forEach(function(d) {
					d.einsteigerJanis = +d.einsteigerJanis;
					d.aussteigerJanis = +d.aussteigerJanis;
				});
				
				// Scale the range of the data in the domains
				xJanis.domain(data.map(function(d) { return d.timeJanis; }));
				yJanis.domain([0, (d3.max(data, function(d) { return d.einsteigerJanis })) + (d3.max(data, function(d) { return d.aussteigerJanis }))]).nice();
				z1.domain(data.columns.slice(1));

				// declare y axis with ticks
				var yAxisJanis = d3.axisLeft(yJanis);
				yAxisJanis.ticks(5);
				 
				// create y axis
				svg1.append("g")
					.call(yAxisJanis);
				  
				// axis label for y axis
				svg1.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - 40)
					.attr("x",0 - (height1 / 1.65))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.style ("font-size", "10px")
					.style ("font-weight", "bold")
					.text("Ein/aussteigerJanis");

			  
				// add the x Axis
				svg1.append("g")
					.attr("class", "axis axis--x")
					.attr("transform", "translate(0," + height1 + ")")
					.call(d3.axisBottom(xJanis))
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
			  
				// create legend Ein/aussteigerJanis
				var legend = svg1.selectAll(".legend")
						.data(data.columns.slice(1).reverse())
						.enter().append("g")
						  .attr("class", "legend")
						  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
						  .style("font", "10px sans-serif");

					  legend.append("rect")
						  .attr("x", width1 + 18)
						  .attr("width", 18)
						  .attr("height", 18)
						  .attr("fill", z1);

					  legend.append("text")
						  .attr("x", width1 + 44)
						  .attr("y", 9)
						  .attr("dy", ".35em")
						  .attr("text-anchor", "start")
						  .text(function(d) { return d; });
						  
						  
				// create bars, tooltip, hover		  
				var barsJanis = svg1.selectAll(".bar")
				.data(stack.keys(data.columns.slice(1))(data))
				.enter().append("g")
				  .attr("class", "bar")
				  .attr("fill", function(d) { return z1(d.key); })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				  .attr("x", function(d) { return xJanis(d.data.timeJanis); })
				  .attr("y", function(d) { return yJanis(d[1]); })
				  .attr("height", function(d) { return yJanis(d[0]) - yJanis(d[1]); })
				  .attr("width", xJanis.bandwidth())
					.on("mousemove", function(d){
						tooltipJanis
						.style("left", d3.event.pageX - 50 + "px")
						.style("top", d3.event.pageY - 90 + "px")
						.style("display", "inline-block")
						.html((d.data.timeJanis) + "<br>" + "Personen: " + ((d[1] - d[0])));
					})
					.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
			});
		}	
		
		if (timestep == 3){
			d3.csv("data/BarChart_d.csv", function(error, data) {
			if (error) throw error;
				
				data.sort(function(a, b) { return b.total - a.total; });
				
				// format the data
				data.forEach(function(d) {
					d.einsteigerJanis = +d.einsteigerJanis;
					d.aussteigerJanis = +d.aussteigerJanis;
				});
				
				// Scale the range of the data in the domains
				xJanis.domain(data.map(function(d) { return d.timeJanis; }));
				yJanis.domain([0, (d3.max(data, function(d) { return d.einsteigerJanis })) + (d3.max(data, function(d) { return d.aussteigerJanis }))]).nice();
				z1.domain(data.columns.slice(1));

				// declare y axis with ticks
				var yAxisJanis = d3.axisLeft(yJanis);
				yAxisJanis.ticks(5);
				 
				// create y axis
				svg1.append("g")
					.call(yAxisJanis);
				  
				// axis label for y axis
				svg1.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - 40)
					.attr("x",0 - (height1 / 1.65))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.style ("font-size", "10px")
					.style ("font-weight", "bold")
					.text("Ein/aussteigerJanis");

			  
				// add the x Axis
				svg1.append("g")
					.attr("class", "axis axis--x")
					.attr("transform", "translate(0," + height1 + ")")
					.call(d3.axisBottom(xJanis))
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
					
				// add ticks for xAxis
				var ticksJanis = d3.selectAll("#barchart .tick text");
				ticksJanis.style("display", function (d, i) { return i % 5 ? "none" : "initial" })
			  
				// create legend Ein/aussteigerJanis
				var legend = svg1.selectAll(".legend")
						.data(data.columns.slice(1).reverse())
						.enter().append("g")
						  .attr("class", "legend")
						  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
						  .style("font", "10px sans-serif");

					  legend.append("rect")
						  .attr("x", width1 + 18)
						  .attr("width", 18)
						  .attr("height", 18)
						  .attr("fill", z1);

					  legend.append("text")
						  .attr("x", width1 + 44)
						  .attr("y", 9)
						  .attr("dy", ".35em")
						  .attr("text-anchor", "start")
						  .text(function(d) { return d; });
						  
						  
				// create bars, tooltip, hover		  
				var barsJanis = svg1.selectAll(".bar")
				.data(stack.keys(data.columns.slice(1))(data))
				.enter().append("g")
				  .attr("class", "bar")
				  .attr("fill", function(d) { return z1(d.key); })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				  .attr("x", function(d) { return xJanis(d.data.timeJanis); })
				  .attr("y", function(d) { return yJanis(d[1]); })
				  .attr("height", function(d) { return yJanis(d[0]) - yJanis(d[1]); })
				  .attr("width", xJanis.bandwidth())
					.on("mousemove", function(d){
						tooltipJanis
						.style("left", d3.event.pageX - 50 + "px")
						.style("top", d3.event.pageY - 90 + "px")
						.style("display", "inline-block")
						.html((d.data.timeJanis) + "<br>" + "Personen: " + ((d[1] - d[0])));
					})
					.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
			});
		}
}




