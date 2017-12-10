var selectedStations = [
"",
""
];

var zoomSelection = [];
var zoomLines = [];
var line ="";
var firstSelectedStation = true;

function init(evt)
{
	if ( window.svgDocument == null )
	{
		svgDocument = evt.target.ownerDocument;
	}
	tooltip = svgDocument.getElementById('tooltip');
	tooltip_bg = svgDocument.getElementById('tooltip_bg');
	
	
	var lineS1 = document.getElementById("line_S1");
	var lineS2 = document.getElementById("line_S2");
	var lineS3 = document.getElementById("line_S3");
	var lineS11 = document.getElementById("line_S11");
	var lineS21 = document.getElementById("line_S21");
	var lineS31 = document.getElementById("line_S31");
	
	lineS1.setAttributeNS(null,"opacity",1);
	lineS2.setAttributeNS(null,"opacity",1);
	lineS3.setAttributeNS(null,"opacity",1);
	lineS11.setAttributeNS(null,"opacity",1);
	lineS21.setAttributeNS(null,"opacity",1);
	lineS31.setAttributeNS(null,"opacity",1);
	
	requestDataForView("1", "", "");
}


function showView1(passengersPerStation){
	var maxRadius = 20;
	var minRadius = 0;
	
	var maxValue =  d3.max(passengersPerStation, function(d) { return d.Anzahl; });
	var minValue = 0;
	
	var factor = 1/(maxValue/maxRadius);
	
	var bobbels = document.querySelectorAll('*[id^="bobbel_"]');
	for (i = 0; i < bobbels.length; i++){
		var stationname = bobbels[i].id.replace("bobbel_", "");
		var stationvalue = passengersPerStation.find(function(e) { return e.Name === stationname; });
		if (stationvalue != null){
			bobbels[i].name = stationvalue.Anzahl;
			var bobbelvalue = stationvalue.Anzahl * factor;
			if(isNaN(bobbelvalue)){
			 bobbelvalue = 0;	
			}
			bobbels[i].setAttributeNS(null,"r", bobbelvalue);
		}
	}
	requestDataForView("zoom", getStations(selectedStations[0], selectedStations[1]), zoomLines);
}	
	
function showTooltip(evt, id){	

	var div = document.getElementById("infoDiv");
	var map = document.getElementById("Map");
		
	if(id.includes("_lineS")){
		tooltip.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1370/map.clientWidth -39);
		tooltip.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight + 15);
		tooltip_bg.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1370/map.clientWidth  -42);
		tooltip_bg.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight - 6);
	}else{
		tooltip.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1410/map.clientWidth +25);
		tooltip.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight + 48);
		tooltip_bg.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1410/map.clientWidth  +21);
		tooltip_bg.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight +28); 	
	}
	tooltip.firstChild.data = getMouseoverText(id);  
	tooltip.setAttributeNS(null,"visibility","visible");
	tooltip_bg.setAttributeNS(null,"visibility","visible");
	length = tooltip.getComputedTextLength();
	tooltip_bg.setAttributeNS(null,"width",length+8);
}

function getMouseoverText (id){
	var bobbel = document.getElementById(id);
	return bobbel.name;
}

function hideTooltip (){
	tooltip.setAttributeNS(null,"visibility","hidden");
	tooltip_bg.setAttributeNS(null,"visibility","hidden");
}

function onLineSelectionChange (id){
	var checkEle = document.getElementById("lineDescription"+id);
	highlightOrDisableLine("line_"+id, checkEle.checked);
	highlightOrDisableLine("lineSmall_"+id, checkEle.checked);
	if(checkEle.checked && !zoomSelection.includes(id)){
		zoomSelection.push(id);
	}else{
		zoomSelection = zoomSelection.filter (function (r) { return r != id;});
	}	
	requestDataForView("3", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
	requestDataForView("4", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
	requestDataForView("5", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
}

function selectLine (id){
	var zoomView = document.getElementById("zoomView");
	zoomView.innerHTML = "";
	zoomView.style.borderStyle = "none";
	
	if(selectedStations[0] != "" || selectedStations[1] != ""){
		if(selectedStations[0] != ""){
			var oldFirst = selectedStations[0];	
			var oldStationFirst = document.getElementById(oldFirst);
			oldStationFirst.style.strokeWidth = 0.8;
			oldStationFirst.style.fill = "#ffffff";	
		}
		if(selectedStations[1] != ""){
			var oldSecond = selectedStations[1];
			var oldStationSecond = document.getElementById(oldSecond);
			oldStationSecond.style.strokeWidth = 0.8;
			oldStationSecond.style.fill = "#ffffff";
		}
		selectedStations[0] = "";
		selectedStations[1] = "";
		var zoomView = document.getElementById("zoomView");
		zoomView.innerHTML = "";
	}
	
	var newID = id.replace("label", "line");
	highlightOneLine(newID);
}

function highlightOneLine(newID){
	var lineS1 = document.getElementById("line_S1");
	var lineS2 = document.getElementById("line_S2");
	var lineS3 = document.getElementById("line_S3");
	var lineS11 = document.getElementById("line_S11");
	var lineS21 = document.getElementById("line_S21");
	var lineS31 = document.getElementById("line_S31");
	
	var selline = document.getElementById(newID);
	if(selline.getAttribute('opacity') == 0.3){
		lineS1.setAttributeNS(null,"opacity",0.3);
		lineS2.setAttributeNS(null,"opacity",0.3);
		lineS3.setAttributeNS(null,"opacity",0.3);
		lineS11.setAttributeNS(null,"opacity",0.3);
		lineS21.setAttributeNS(null,"opacity",0.3);
		lineS31.setAttributeNS(null,"opacity",0.3);
		selline.setAttributeNS(null,"opacity",1);
		line = newID.replace("line_", "");
		var stations = stationsOfLine.find(function (i) {return i.line === line}).stations;
		selectStation("label_"+stations[0])
		selectStation("label_"+stations[stations.length -1]);
	}else if (lineS1.getAttribute('opacity') == 1 && lineS2.getAttribute('opacity') == 1
	&& lineS3.getAttribute('opacity') == 1 && lineS11.getAttribute('opacity') == 1
	&& lineS21.getAttribute('opacity') == 1 && lineS31.getAttribute('opacity') == 1){
		lineS1.setAttributeNS(null,"opacity",0.3);
		lineS2.setAttributeNS(null,"opacity",0.3);
		lineS3.setAttributeNS(null,"opacity",0.3);
		lineS11.setAttributeNS(null,"opacity",0.3);
		lineS21.setAttributeNS(null,"opacity",0.3);
		lineS31.setAttributeNS(null,"opacity",0.3);
		selline.setAttributeNS(null,"opacity",1);
		line = newID.replace("line_", "");
		var stations = stationsOfLine.find(function (i) {return i.line === line}).stations;
		selectStation("label_"+stations[0])
		selectStation("label_"+stations[stations.length -1]);
	}else{
		lineS1.setAttributeNS(null,"opacity",1);
		lineS2.setAttributeNS(null,"opacity",1);
		lineS3.setAttributeNS(null,"opacity",1);
		lineS11.setAttributeNS(null,"opacity",1);
		lineS21.setAttributeNS(null,"opacity",1);
		lineS31.setAttributeNS(null,"opacity",1);
		selline.setAttributeNS(null,"opacity",1);
		line = "";
		zoomSelection = [];
		zoomLines = [];
		requestDataForView("3", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
		requestDataForView("4", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
		requestDataForView("5", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
	}
}


function highlightMultiLines(lines){
	line = "";
	var lineS1 = document.getElementById("line_S1");
	var lineS2 = document.getElementById("line_S2");
	var lineS3 = document.getElementById("line_S3");
	var lineS11 = document.getElementById("line_S11");
	var lineS21 = document.getElementById("line_S21");
	var lineS31 = document.getElementById("line_S31");
	
	if(!lines.includes("S1")){
		lineS1.setAttributeNS(null,"opacity",0.3);
	}
	if(!lines.includes("S2")){
		lineS2.setAttributeNS(null,"opacity",0.3);
	}
	if(!lines.includes("S3")){
		lineS3.setAttributeNS(null,"opacity",0.3);
	}
	if(!lines.includes("S11")){
		lineS11.setAttributeNS(null,"opacity",0.3);
	}
	if(!lines.includes("S21")){
		lineS21.setAttributeNS(null,"opacity",0.3);
	}
	if(!lines.includes("S31")){
		lineS31.setAttributeNS(null,"opacity",0.3);
	}
	
	for(i = 0; i<lines.length; i++){
		var selline = document.getElementById("line_"+lines[i]);
		selline.setAttributeNS(null,"opacity",1);
	}
	
}

function highlightOrDisableLine(id, highlight){
	var selline = document.getElementById(id);
	if(highlight){
		selline.setAttributeNS(null,"opacity",1);
	}else{
		selline.setAttributeNS(null,"opacity",0.3);
	}
}

function selectStation (id){
	//show all lines
	id = id.replace("label_", "");
	var station = document.getElementById(id);
	
	//second click on selected station -> remove station, make second to first
	if(station.style.strokeWidth == 4){
		line = "";
		station.style.strokeWidth = 0.8;
		station.style.fill = "#ffffff";
		
		if(selectedStations[0] == id){
			selectedStations[0] = selectedStations[1];
			selectedStations[1] = "";
		}
		else if(selectedStations[1] == id){
			selectedStations[1] = "";
		}
	}
	else{
		//first selected station
		
		if(selectedStations[0] == ""){
			selectedStations[0] = id;
		}
		
		//second selected station
		else if(selectedStations[1] == ""){
			var lines1 = linesOfStations.find(function(f) { return f.station === selectedStations[0]; }).lines;
			var lines2 = linesOfStations.find(function(f) { return f.station === id; }).lines;
			var lines = lines1.filter((n) => lines2.includes(n))
			if(lines.length != 0){
				selectedStations[1] = id;
			}else{
				var oldStationFirst = document.getElementById(selectedStations[0]);
				oldStationFirst.style.strokeWidth = 0.8;
				oldStationFirst.style.fill = "#ffffff";
				selectedStations[0] = id;
			}
		}
		//new route, delete selection and set selected as first
		else{
			line = "";
			var oldFirst = selectedStations[0];
			var oldSecond = selectedStations[1];
			var oldStationFirst = document.getElementById(oldFirst);
			var oldStationSecond = document.getElementById(oldSecond);
			
			oldStationFirst.style.strokeWidth = 0.8;
			oldStationFirst.style.fill = "#ffffff";
			oldStationSecond.style.strokeWidth = 0.8;
			oldStationSecond.style.fill = "#ffffff";
			
			selectedStations[0] = id;
			selectedStations[1] = "";
		}
		station.style.strokeWidth = 4;
		station.style.fill = "#000000";
	}
	if(selectedStations[0] != ""){
		requestDataForView("zoom", getStations(selectedStations[0], selectedStations[1]), line);
	}else{
		showViewZoom("");
		var lineS1 = document.getElementById("line_S1");
		var lineS2 = document.getElementById("line_S2");
		var lineS3 = document.getElementById("line_S3");
		var lineS11 = document.getElementById("line_S11");
		var lineS21 = document.getElementById("line_S21");
		var lineS31 = document.getElementById("line_S31");
		lineS1.setAttributeNS(null,"opacity",1);
		lineS2.setAttributeNS(null,"opacity",1);
		lineS3.setAttributeNS(null,"opacity",1);
		lineS11.setAttributeNS(null,"opacity",1);
		lineS21.setAttributeNS(null,"opacity",1);
		lineS31.setAttributeNS(null,"opacity",1);
	}
}

function showViewZoom(dataLines){
	zoomSelection = [];
	zoomLines = [];
	var zoomView = document.getElementById("zoomView");
	
	if(dataLines != ""){
		var maxRadius = 20;
		var maxValue =  d3.max(dataLines, function(d) { return d.Anzahl; });	
		var factor = 1/(maxValue/maxRadius);
	}
	
	//no station, no route seleted
	if(selectedStations[0] == "" && selectedStations[1] == ""){
		zoomView.innerHTML = "";
		zoomView.style.borderStyle = "none";
	}
	//only one station, no route
	else if(selectedStations[0] != "" && selectedStations[1] == ""){
		zoomView.style.borderStyle = "groove";
		
		var lines = dataLines.map(function (f) { return f.Linie});
		//linesOfStations.find(function(f) { return f.station === selectedStations[0]; }).lines;
		//show titel -> Stationname
		//show possible lines for station (checked checkbox, linename, station-image in according color) 
		
		highlightMultiLines(lines);
		
		var lineoptions = "";
		for(j = 0; j<lines.length; j++){
			var lineColor = lineColors.find(function(g) {return g.line === lines[j];}).color;
			var bobbelWidth = dataLines.find(function(h) {return h.Linie ===lines[j];}).Anzahl;
			lineoptions +=
			"<div style=\"display:inline-block; position:relative; height:50px; width:100%\"><input type=\"checkbox\" id=\"lineDescription"+lines[j]+"\" style=\"display: inline-block; float:left; margin-top: 30px; margin-left: 2px;\" onchange=\"onLineSelectionChange(this.id)\" checked>"+
			"<label for=\"lineDescription"+j+"\" style=\"float:left; margin-top: 28px; margin-left: 2px;\">"+lines[j]+"</label>"+
			"<svg xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" version=\"1.1\" id=\"Station\" sodipodi:docname=\"Station.svg\" inkscape:version=\"0.92.2 (5c3e80d, 2017-08-06)\" x=\"0px\" y=\"0px\" display=\"inline-block\" viewBox=\"0 0 170 28.260856\" enable-background=\"new 0 0 170 28.260856\" xml:space=\"preserve\" onload=\"init(evt)\" style=\"display:inline-block; height: 50px; width: 100px; float:right\"><metadata id=\"metadata4732\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image/svg+xml</dc:format><dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id=\"defs4730\" /><sodipodi:namedview pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1\" objecttolerance=\"10\" gridtolerance=\"10\" guidetolerance=\"10\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:window-width=\"1920\" inkscape:window-height=\"1001\" id=\"namedview4728\" showgrid=\"false\" inkscape:snap-smooth-nodes=\"false\" inkscape:object-nodes=\"true\" inkscape:object-paths=\"false\" inkscape:zoom=\"0.625\" inkscape:cx=\"660.83357\" inkscape:cy=\"431.84027\" inkscape:window-x=\"-9\" inkscape:window-y=\"-9\" inkscape:window-maximized=\"1\" inkscape:current-layer=\"layer1\" /><g id=\"layer1\" transform=\"translate(5673.9687,-1482.2978)\" inkscape:label=\"Livello 1\" inkscape:groupmode=\"layer\">"+
			"<path sodipodi:nodetypes=\"cc\" inkscape:connector-curvature=\"0\" d=\"m -5507.3861,1514.9395 -163.1486,-0.1178\" style=\"fill:none;stroke:"+lineColor+";stroke-width:7;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.8\" id=\"lineSmall_"+lines[j]+"\" />"+
			"<rect  x=\"-5592.5132\" y=\"1510.5\" width=\"9\" height=\"9\" style=\"fill:rgb(0, 0, 0);fill-opacity:1;stroke:rgb(0, 0, 0);stroke-width:4;stroke-linejoin:round\" cursor=\"pointer\" />"+
			"<circle style=\"fill:#b3b3b3;fill-opacity:0.71022728;stroke:none;stroke-width:2.70710683;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" id=\"bobbel_Neu Wulmstorf_line"+lines[j]+"\" cx=\"5588.542\" cy=\"1486.1528\" transform=\"scale(-1,1)\" onmousemove=\"showTooltip(evt, this.id)\" onmouseout=\"hideTooltip()\" r=\""+(bobbelWidth*factor)+"\" /></g></svg>"+"</div>";
			zoomSelection.push(lines[j]);
			zoomLines.push(lines[j]);
		}
		zoomView.innerHTML = selectedStations[0] + lineoptions;
		for(j = 0; j<lines.length; j++){
			document.getElementById("bobbel_Neu Wulmstorf_line"+lines[j]).name = dataLines.find(function(h) {return h.Linie ===lines[j];}).Anzahl;
		}
	}
	//route selected
	else{
		zoomView.style.borderStyle = "groove";
		
		var lines1 = linesOfStations.find(function(f) { return f.station === selectedStations[0]; }).lines;
		var lines2 = linesOfStations.find(function(f) { return f.station === selectedStations[1]; }).lines;
		var lines = lines1.filter((n) => lines2.includes(n))
		if(line != ""){
			var lines = dataLines.map(function (g) {return g.Linie;});	
		}
		highlightMultiLines(lines);
		
		var lineoptions = "";
		for(j = 0; j<lines.length; j++){
			var lineColor = lineColors.find(function(g) {return g.line === lines[j];}).color;
			var bobbelWidth = dataLines.find(function(h) {return h.Linie ===lines[j];}).Anzahl;
			lineoptions +=
			"<div style=\"display:inline-block; position:relative; height:50px; width:100%\"><input type=\"checkbox\" id=\"lineDescription"+lines[j]+"\" style=\"display: inline-block; float:left; margin-top: 30px; margin-left: 2px;\" onchange=\"onLineSelectionChange(this.id)\" checked>"+
			"<label for=\"routeDescription"+j+"\" style=\"float:left; margin-top: 28px; margin-left: 2px;\">"+lines[j]+"</label>"+
			"<svg xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" version=\"1.1\" id=\"Station\" sodipodi:docname=\"Station.svg\" inkscape:version=\"0.92.2 (5c3e80d, 2017-08-06)\" x=\"0px\" y=\"0px\" display=\"inline-block\" viewBox=\"0 0 170 28.260856\" enable-background=\"new 0 0 170 28.260856\" xml:space=\"preserve\" onload=\"init(evt)\" style=\"display:inline-block; height: 50px; width: 100px; float:right\"><metadata id=\"metadata4732\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image/svg+xml</dc:format><dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id=\"defs4730\" /><sodipodi:namedview pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1\" objecttolerance=\"10\" gridtolerance=\"10\" guidetolerance=\"10\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:window-width=\"1920\" inkscape:window-height=\"1001\" id=\"namedview4728\" showgrid=\"false\" inkscape:snap-smooth-nodes=\"false\" inkscape:object-nodes=\"true\" inkscape:object-paths=\"false\" inkscape:zoom=\"0.625\" inkscape:cx=\"660.83357\" inkscape:cy=\"431.84027\" inkscape:window-x=\"-9\" inkscape:window-y=\"-9\" inkscape:window-maximized=\"1\" inkscape:current-layer=\"layer1\" />"+
			
			"<g id=\"layer1\" transform=\"translate(5673.9687,-1482.2978)\" inkscape:label=\"Livello 1\" inkscape:groupmode=\"layer\">"+
			"<path id=\"lineSmall_"+lines[j]+"\" sodipodi:nodetypes=\"cc\" inkscape:connector-curvature=\"0\" d=\"m -5507.3861,1514.9395 -163.1486,-0.1178\" style=\"fill:none;stroke:"+lineColor+";stroke-width:7;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.8\" />"+
			
			"<rect x=\"-5670.2241\" y=\"1511.188\" width=\"7.1999998\" height=\"7.1989999\" style=\"fill:rgb(0, 0, 0);fill-opacity:1;stroke:rgb(0, 0, 0);stroke-width:4;stroke-linejoin:round\" cursor=\"pointer\" />"+
			
			"<circle style=\"fill:#b3b3b3;fill-opacity:0.71022728;stroke:none;stroke-width:2.70710683;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" id=\"bobbel_Neu Wulmstorf_line"+lines[j]+"\" cx=\"5588.542\" cy=\"1486.1528\" transform=\"scale(-1,1)\" onmousemove=\"showTooltip(evt, this.id)\" onmouseout=\"hideTooltip()\" r=\""+(bobbelWidth*factor)+"\" />"+
			
			"<rect x=\"-5514.8521\" y=\"1511.188\" width=\"7.1999998\" height=\"7.1989999\" style=\"display:block;fill:rgb(0, 0, 0);fill-opacity:1;stroke:rgb(0, 0, 0);stroke-width:4;stroke-linejoin:round\" cursor=\"pointer\" />"
	   
			+"</g></svg>"+"</div>";
			
			zoomSelection.push(lines[j]);
			zoomLines.push(lines[j]);
		}
		zoomView.innerHTML = selectedStations[0] +" -> "+selectedStations[1] + lineoptions;
		for(j = 0; j<lines.length; j++){
			document.getElementById("bobbel_Neu Wulmstorf_line"+lines[j]).name = 
			dataLines.find(function(h) {return h.Linie ===lines[j];}).Anzahl;
		}
	}
	requestDataForView("3", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
	requestDataForView("4", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
	requestDataForView("5", getStations(selectedStations[0], selectedStations[1]), zoomSelection);
}

function getStations(start, end){
	//nothing selected
	if(start == ""){
		return linesOfStations.map(function (t) {return t.station;});
	}
	//station selected
	else if(end == ""){
		return start;
	}
	//route selected
	else{
		var lines1 = linesOfStations.find(function(f) { return f.station === start; }).lines;
		var lines2 = linesOfStations.find(function(g) { return g.station === end; }).lines;
		var lines = lines1.filter((n) => lines2.includes(n));
		if(lines.length == 0){
			return "";
		}else{
			if(lines.length > 1){
				if(lines[0] == "S11" || lines[0] == "S31"){
					var res = stationsOfLine.find(function(h) { return h.line === lines[1];}).stations;
					var startIndex = res.indexOf(start);
					var endIndex = res.indexOf(end);
					if(startIndex < endIndex){
						return res.slice(startIndex, endIndex+1);
					}else{
						return res.slice(endIndex, startIndex+1);
					}
				}else{
					var res = stationsOfLine.find(function(h) { return h.line === lines[0];}).stations;
					var startIndex = res.indexOf(start);
					var endIndex = res.indexOf(end);
					if(startIndex < endIndex){
						return res.slice(startIndex, endIndex+1);
					}else{
						return res.slice(endIndex, startIndex+1);
					}
				}
			}else{
				var res = stationsOfLine.find(function(h) { return h.line === lines[0];}).stations;
				var startIndex = res.indexOf(start);
					var endIndex = res.indexOf(end);
					if(startIndex < endIndex){
						return res.slice(startIndex, endIndex+1);
					}else{
						return res.slice(endIndex, startIndex+1);
					}
			}
		}
	}
}

var lineColors = [
{line: "S1", 	color: "#27bb29"},
{line: "S2", 	color: "#e08343"},
{line: "S3", 	color: "#4861b4"},
{line: "S11", 	color: "#c837ab"},
{line: "S21", 	color: "#b41043"},
{line: "S31", 	color: "#751d72"},
];

var linesOfStations = [
{station: "Pinneberg", 				lines: ["S3"]},
{station: "Thesdorf", 				lines: ["S3"]},
{station: "Halstenbek", 			lines: ["S3"]},
{station: "Krupunder", 				lines: ["S3"]},
{station: "Elbgaustrasse", 			lines: ["S21", "S3"]},
{station: "Eidelstedt", 			lines: ["S21", "S3"]},
{station: "Stellingen", 			lines: ["S21", "S3"]},
{station: "Langenfelde", 			lines: ["S21", "S3"]},
{station: "Diebstreich", 			lines: ["S21", "S3"]},
{station: "Holstenstrasse", 		lines: ["S11", "S21", "S31"]},
{station: "Sternschanze", 			lines: ["S11", "S21", "S31"]},
{station: "Dammtor", 				lines: ["S11", "S21", "S31"]},
{station: "Hamburg Hbf",			lines: ["S11", "S1", "S21", "S2", "S31", "S3"]},
{station: "Berliner Tor", 			lines: ["S11", "S1", "S21", "S2", "S31"]},
{station: "Landwehr", 				lines: ["S11", "S1"]},
{station: "Hasselbrook", 			lines: ["S11", "S1"]},
{station: "Wandsbeker Chaussee", 	lines: ["S11", "S1"]},
{station: "Friedrichsberg", 		lines: ["S11", "S1"]},
{station: "Barmbek", 				lines: ["S11", "S1"]},
{station: "Alte Woehr", 			lines: ["S11", "S1"]},
{station: "Ruebenkamp", 			lines: ["S11", "S1"]},
{station: "Ohlsdorf", 				lines: ["S11", "S1"]},
{station: "Hamburg Airport", 		lines: ["S1"]},
{station: "Kornweg", 				lines: ["S11", "S1"]},
{station: "Hoheneichen", 			lines: ["S11", "S1"]},
{station: "Wellingsbuettel", 		lines: ["S11", "S1"]},
{station: "Poppenbuettel", 			lines: ["S11", "S1"]},
{station: "Aumuehle", 				lines: ["S21"]},
{station: "Wohltorf", 				lines: ["S21"]},
{station: "Reinbek", 				lines: ["S21"]},
{station: "Hamburg-Bergedorf", 		lines: ["S21", "S2"]},
{station: "Nettelnburg", 			lines: ["S21", "S2"]},
{station: "Allermoehe", 			lines: ["S21", "S2"]},
{station: "Mittlerer Landweg", 		lines: ["S21", "S2"]},
{station: "Billwerder-Moorfleet", 	lines: ["S21", "S2"]},
{station: "Tiefstack", 				lines: ["S21", "S2"]},
{station: "Rothenburgsort", 		lines: ["S21", "S2"]},
{station: "Hammerbrook", 			lines: ["S3", "S31"]},
{station: "Veddel", 				lines: ["S3", "S31"]},
{station: "Wilhelmsburg", 			lines: ["S3", "S31"]},
{station: "Hamburg-Harburg", 		lines: ["S3", "S31"]},
{station: "Harburg Rathaus", 		lines: ["S3", "S31"]},
{station: "Heimfeld", 				lines: ["S3", "S31"]},
{station: "Neuwiedenthal", 			lines: ["S3", "S31"]},
{station: "Neugraben", 				lines: ["S3", "S31"]},
{station: "Fischbek", 				lines: ["S3"]},
{station: "Neu Wulmstorf", 			lines: ["S3"]}, 
{station: "Buxtehude", 				lines: ["S3"]},
{station: "Neukloster", 			lines: ["S3"]},
{station: "Horneburg", 				lines: ["S3"]},
{station: "Dollern", 				lines: ["S3"]},
{station: "Agathenburg", 			lines: ["S3"]},
{station: "Stade", 					lines: ["S3"]},
{station: "Jungfernstieg", 			lines: ["S1", "S2", "S3"]},
{station: "Stadthausbruecke", 		lines: ["S1", "S2", "S3"]},
{station: "Landungsbruecken", 		lines: ["S1", "S2", "S3"]},
{station: "Reeperbahn", 			lines: ["S1", "S2", "S3"]},
{station: "Koenigstrasse",		 	lines: ["S1", "S2", "S3"]},
{station: "Hamburg-Altona", 		lines: ["S11", "S31", "S1", "S2", "S3"]},
{station: "Bahrenfeld", 			lines: ["S11", "S1"]},
{station: "Othmarschen", 			lines: ["S11", "S1"]},
{station: "Klein Flottbek", 		lines: ["S11", "S1"]},
{station: "Hochkamp", 				lines: ["S11", "S1"]},
{station: "Blankenese", 			lines: ["S11", "S1"]},
{station: "Iserbrook", 				lines: ["S1"]},
{station: "Suelldorf", 				lines: ["S1"]},
{station: "Rissen", 				lines: ["S1"]},
{station: "Wedel", 					lines: ["S1"]}
];


var stationsOfLine = [
{line: "S1", stations:["Wedel", "Rissen", "Suelldorf", "Iserbrook", "Blankenese", "Hochkamp", "Klein Flottbek", "Othmarschen", "Bahrenfeld", "Hamburg-Altona", "Koenigstrasse", "Reeperbahn", "Landungsbruecken", "Stadthausbruecke", "Jungfernstieg", "Hamburg Hbf", "Berliner Tor", "Landwehr", "Hasselbrook", "Wandsbeker Chaussee", "Friedrichsberg", "Barmbek", "Alte Woehr", "Ruebenkamp", "Ohlsdorf", "Hamburg Airport", "Kornweg", "Hoheneichen", "Wellingsbuettel", "Poppenbuettel"]},
{line: "S11", stations:["Blankenese", "Hochkamp", "Klein Flottbek", "Othmarschen", "Bahrenfeld", "Hamburg-Altona", "Holstenstrasse", "Sternschanze", "Dammtor","Hamburg Hbf", "Berliner Tor", "Landwehr", "Hasselbrook", "Wandsbeker Chaussee", "Friedrichsberg", "Barmbek", "Alte Woehr", "Ruebenkamp", "Ohlsdorf", "Kornweg", "Hoheneichen", "Wellingsbuettel", "Poppenbuettel"]},
{line: "S2", stations:["Hamburg-Altona", "Koenigstrasse", "Reeperbahn", "Landungsbruecken", "Stadthausbruecke", "Jungfernstieg", "Hamburg Hbf", "Berliner Tor", "Rothenburgsort", "Tiefstack", "Billwerder-Moorfleet", "Mittlerer Landweg", "Allermoehe", "Nettelnburg", "Hamburg-Bergedorf"]},
{line: "S21", stations:["Elbgaustrasse", "Eidelstedt", "Stellingen", "Langenfelde", "Diebstreich", "Holstenstrasse", "Sternschanze", "Dammtor", "Hamburg Hbf", "Berliner Tor", "Rothenburgsort", "Tiefstack", "Billwerder-Moorfleet", "Mittlerer Landweg", "Allermoehe", "Nettelnburg", "Hamburg-Bergedorf", "Reinbek", "Wohltorf", "Aumuehle"]},
{line: "S3", stations:["Pinneberg", "Thesdorf", "Halstenbek", "Krupunder", "Elbgaustrasse", "Eidelstedt", "Stellingen", "Langenfelde", "Diebstreich", "Hamburg-Altona", "Koenigstrasse", "Reeperbahn", "Landungsbruecken", "Stadthausbruecke", "Jungfernstieg", "Hamburg Hbf", "Hammerbrook", "Veddel", "Wilhelmsburg", "Hamburg-Harburg", "Harburg Rathaus", "Heimfeld", "Neuwiedenthal", 	"Neugraben", "Fischbek", "Neu Wulmstorf", "Buxtehude", "Neukloster", "Horneburg", "Dollern", "Agathenburg", "Stade"]},
{line: "S31", stations:["Hamburg-Altona", "Holstenstrasse", "Sternschanze", "Dammtor", "Hamburg Hbf", "Berliner Tor", "Hammerbrook", "Veddel", "Wilhelmsburg", "Hamburg-Harburg", "Harburg Rathaus", "Heimfeld", "Neuwiedenthal", "Neugraben"]},
];

