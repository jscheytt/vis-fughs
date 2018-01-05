function showView2(data) {
	//DataCommunication Zeile 150 einkommentieren, dann wird der Wert des Paramerters valueJanis ein Array mit den Daten vom Server im Format valueJanis = [{Datum: "01.11.2000", AnzahlEin: 1200, AnzahlAus: 3000}, {Datum: "01.12.2000", AnzahlEin: 2300, AnzahlAus: 600}]
	//Zugriff: valueJanis[0].Datum -> "01.11.2000", valueJanis[0].AnzahlEin ->1200, valueJanis[0].AnzahlAus -> 600
	
	
	//clear region for bar-chart
	var formatTime = d3.timeFormat("%d.%m.%Y");
	var regionBarChart = document.getElementById("barchart");
	if(regionBarChart != null){
		regionBarChart.innerHTML = "";
	}
	
	// set the dimensions and margin1s of the graph
	var margin1 = {top: 15, right: 120, bottom: 20, left: 80},
		width1 = 900 - margin1.left - margin1.right,
		height1 = 130 - margin1.top - margin1.bottom;

	// declarate Tooltip
	var tooltipJanis = d3.select("div").append("div").attr("class", "toolTipJanis");

	var xJanis = d3.scaleBand()
			  .range([0, width1])
			  .padding(0.5);
			 
	var yJanis = d3.scaleLinear()
			  .range([height1, 0]);
			  
  
	// var z1 = d3.scaleOrdinal(d3.schemeCategory20);
	var colorBlue = "steelblue";
	var ein = document.getElementById("EinsteigerCheckbox");
	var aus = document.getElementById("AussteigerCheckbox");
	var mittel = document.getElementById("MittelwertCheckbox");
	if(aus.checked && !ein.checked == true) {
		colorBlue = "lightsteelblue";
	}   
	if(mittel.checked == true) {
		colorBlue = "#00335e";
	}
	
	
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
	
	
					/* data.sort(function(a) { return a.total; }); */
					
					// format the data
					data.forEach(function(d) {
						d.Anzahl = +d.Anzahl;
					});
					data.forEach(function(d) {
						d.Datum = formatTime(new Date(d.Datum));
					}); 
					
					
					// Scale the range of the data in the domains
					xJanis.domain(data.map(function(d) { return d.Datum; }));
					yJanis.domain([0, (d3.max(data, function(d) { return d.Anzahl }))]);
					

					// declare y axis with ticks
					var yAxisJanis = d3.axisLeft(yJanis);
					yAxisJanis.ticks(5);					  
					
					if (timestep == 2 || timestep == 3) {
						yAxisJanis.ticks(7);					  
					}
					
					 
					// create y axis
					svg1.append("g")
						.call(yAxisJanis);
					  
					// axis label for y axis
					svg1.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 0 - 80)
						.attr("x",0 - (height1 / 1.75))
						.attr("dy", "1em")
						.style("text-anchor", "middle")
						.style ("font-size", "10px")
						.style ("font-weight", "bold")
						.text("Anzahl");

				  
					// add the x Axis
					svg1.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height1 + ")")
						.call(d3.axisBottom(xJanis))
						// rotate elements on x axis 
						.selectAll("text")
						.attr("y", 15)
						.attr("x", 0)
						.attr("dx", "-0.18em")
						.attr("dy", ".35em")
						
						.style("text-anchor", "middle");
				
					
					// x axis label
					svg1.append("text")
						.attr("class", "axis axis--y")
						.attr("transform", "translate(" + (width1*1.01) + " ," + (height1*1) + ")")
						.style("text-anchor", "right")
						.style ("font-size", "10px")
						.style ("font-weight", "bold")
						.text("Tage");
				  
					var ticksJanis = d3.selectAll("#barchart .axis--x text");
					if (timestep == 2) {
						ticksJanis.style("display", function (d, i) { return i % 2 ? "none" : "initial" })						  
					}
					if (timestep == 3) {
						ticksJanis.style("display", function (d, i) { return i % 10 ? "none" : "initial" })						  
					}
							  
					// create bars, tooltip, hover		  
					var barsJanis = svg1.selectAll(".bar").data(data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) { return "translate(" + xJanis(d.Datum) + ", " + yJanis(d.Anzahl) + ")" });
				var rectsJanis = barsJanis.append("rect")
				// ---- add a className for easy selecting 
					.attr("class", "bar")
					.attr("width", xJanis.bandwidth())
					.attr("height", function(d){return height1 - yJanis(d.Anzahl);})
					.attr("fill", colorBlue)		
					.attr("name", function(d){return d.Datum;})
					//Text attribut auf d.Datum stetzen
					.on("mousemove", function(d){
						tooltipJanis
						.style("left", d3.event.pageX - 50 + "px")
						.style("top", d3.event.pageY - 90 + "px")
						.style("display", "inline-block")
						.html((d.Datum) + "<br>" + "Anzahl: " + (d.Anzahl));
					})
					.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
					
					// Wenn ein Barchart angeklickt wird
					/* $( "rect" ).click(function() {
					  
					  alert( "Handler for .click() called." + d3.select(this).attr("x"));
					}); */
					d3.selectAll("rect").on("click", function(d) {
						onSelectedTimeChange(d.Datum);
						$('.highlightBarChart').removeClass('highlightBarChart');
						$(this).addClass('highlightBarChart');
					});
					
					if (timestep == 0) {
						document.getElementById('VarianzCheckbox').disabled = true;
					} 
					else {
						document.getElementById('VarianzCheckbox').disabled = false;
					}
			
			if(selectedTime == ""){
				eventFire(document.getElementsByClassName("bar")[1], 'click');
			}else{
				eventFire(document.getElementsByName(selectedTime)[0], 'click');
			}
			//simulate click on first bar after load
			
}


function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}



