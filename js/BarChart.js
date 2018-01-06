function showView2(data) {
	// Zahlen der y-Achse werden damit formatiert
	var formatNumber = d3.format("");	
	var formatM = d3.format(".2s");	
	
	// Datums in der x-Achse werden damit formatiert
	var formatTime = d3.timeFormat("%d.%m.%Y");
	
	// Klasse Barchart wird immer geleert, wenn neuer Radiobutton ausgewählt wird
	var regionBarChart = document.getElementById("barchart");
	if(regionBarChart != null){
		regionBarChart.innerHTML = "";
	}
	
	// set the dimensions and margin1s of the graph
	var margin1 = {top: 15, right: 120, bottom: 20, left: 50},
		width1 = 900 - margin1.left - margin1.right,
		height1 = 130 - margin1.top - margin1.bottom;

	// declarate Tooltip
	var tooltipJanis = d3.select("div").append("div").attr("class", "toolTipJanis");

	var xJanis = d3.scaleBand()
			  .range([0, width1])
			  .padding(0.5);

	var yJanis = d3.scaleLinear()
			  .range([height1, 0]);
  
	// Farben der Bars für Einsteiger/Aussteiger/Mittelwert
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


	// formatiere Datum und die Werte für die Bars aufsummieren
	data.forEach(function(d) {
		d.Anzahl = +d.Anzahl;
		d.Datum = formatTime(new Date(d.Datum));
		if(timestep == 0) {
			d.Datum = "Gesamt";
		}
	}); 
	
	// Scale the range of the data in the x-domain
	xJanis.domain(data.map(function(d) { return d.Datum; }));
	
	// Unterschiedliche Skalierung der y-Achse je nachdem ob Varianz ausgewählt ist oder nicht
	if(document.getElementById("VarianzCheckbox").checked){
		yJanis.domain(d3.extent(data, function(d) { 
		return d.Anzahl;
		})).nice();
		
		document.getElementById('radio1').disabled = true;
	}
	else {
		yJanis.domain([0, (d3.max(data, function(d) { return d.Anzahl }))]);
		document.getElementById('radio1').disabled = false;
	}
	
	// declare y axis with ticks
	var yAxisJanis = d3.axisLeft(yJanis);
	if (timestep == 0) {
		yAxisJanis.ticks(3).tickFormat(function(d) { return formatM(d)});
	}
	if(timestep == 1 && document.getElementById("VarianzCheckbox").checked) {
		yAxisJanis.ticks(7).tickFormat(function(d) { return formatM(d)});
	}
	else if (timestep == 3) {
		yAxisJanis.ticks(5).tickFormat(function(d) { return formatM(d)});
	} else {
		yAxisJanis.ticks(7).tickFormat(function(d) { return formatM(d)});					  
	}

	// create y axis
	svg1.append("g")
		.call(yAxisJanis);
	  
	// axis label for y axis
	svg1.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - 50)
		.attr("x",0 - (height1 / 1.75))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style ("font-size", "10px")
		.style ("font-weight", "bold")
		.text("Anzahl");

  
	// add the x Axis
	if(document.getElementById("VarianzCheckbox").checked) {
	svg1.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height1 + ")")
		.call(d3.axisBottom(xJanis))
		.select(".domain").remove()
		
		// x Achse Linie
	svg1.append("g")
		.attr("class", "x axis")
		.append("line")
		.attr("y1", yJanis(0))
		.attr("y2", yJanis(0))
		.attr("x2", width1); 
	}
	else {
		svg1.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height1 + ")")
		.call(d3.axisBottom(xJanis))
		.selectAll("text")
		.attr("y", 15)
		.attr("dx", "-0.18em")
		.attr("dy", ".35em")
		.style("text-anchor", "middle");
	}
	
	// x axis label
	svg1.append("text")
		.attr("class", "axis axis--y")
		.attr("transform", "translate(" + (width1*1.01) + " ," + (height1*1) + ")")
		.style("text-anchor", "right")
		.style ("font-size", "10px")
		.style ("font-weight", "bold")
		.text("Tage");
  
	// Ticks für die x-Achse
	var ticksJanis = d3.selectAll("#barchart .axis--x text");
	ticksJanis.style("display", function (d, i) { return i % 1 ? "none" : "initial" })
	if (timestep == 2) {
		ticksJanis.style("display", function (d, i) { return i % 2 ? "none" : "initial" })						  
	}
	if (timestep == 3) {
		ticksJanis.style("display", function (d, i) { return i % 10 ? "none" : "initial" })						  
	}
		
			  
	// create bars, tooltip, hover		  
	var barsJanis = svg1.selectAll(".bar").data(data)
	.enter().append("g")
	.attr("class", "barhover")
	.attr("transform", function(d) {

		if (d.Anzahl > 0){
			return "translate(" + xJanis(d.Datum) + ", " + yJanis(d.Anzahl) + ")"
		} 
		else {
			return "translate(" + xJanis(d.Datum) + ", " + yJanis(0) + ")"
		}

	});
	var rectsJanis = barsJanis.append("rect")
	// ---- add a className for easy selecting 
	.attr("class", "bar")
	.attr("width", xJanis.bandwidth())
	.attr("height", function(d){return Math.abs(yJanis(d.Anzahl) - yJanis(0));})
	.attr("fill", colorBlue)		
	.attr("name", function(d){return d.Datum;})
	.on("mousemove", function(d){
		tooltipJanis
		.style("left", d3.event.pageX - 50 + "px")
		.style("top", d3.event.pageY - 90 + "px")
		.style("display", "inline-block")
		.html((d.Datum) + "<br>" + "Anzahl: " + (d.Anzahl));
	})
	.on("mouseout", function(d){ tooltipJanis.style("display", "none");});
	
	// Clickevent den Bars hinzufügen
	d3.selectAll("rect").on("click", function(d) {
		onSelectedTimeChange(d.Datum);
		$('.highlightBarChart').removeClass('highlightBarChart');
		$(this).addClass('highlightBarChart');
	});
	
	// Falls Varianz aktiviert ist, soll der Radiobutton der Gesamtansicht disabled werden
	if (timestep == 0) {
		document.getElementById('VarianzCheckbox').disabled = true;
	} 
	else {
		document.getElementById('VarianzCheckbox').disabled = false;
	}

	// Wenn ein Balken ausgewählt ist soll dieser auch ausgewählt bleiben wenn zwischen Einsteiger/Aussteiger/Mittelwert navigiert wird
	if(selectedTime == ""){
		eventFire(document.getElementsByClassName("bar")[0], 'click');
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