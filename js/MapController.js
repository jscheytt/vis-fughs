var selectedStations = [
"",
""
];

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
	
	loadPassengerCount(stationData);
}


function loadPassengerCount(passengersPerStation){
	var maxRadius = 20;
	var minRadius = 0;
	
	var maxValue =  d3.max(passengersPerStation, function(d) { return d.count; });
	var minValue = 0;
	
	var factor = 1/(maxValue/maxRadius);
	
	var bobbels = document.querySelectorAll('*[id^="bobbel_"]');
	for (i = 0; i < bobbels.length; i++){
		var stationname = bobbels[i].id.replace("bobbel_", "");
		var stationvalue = passengersPerStation.find(function(e) { return e.station === stationname; });
		if (stationvalue != null){
			bobbels[i].name = stationvalue.count;
			var bobbelvalue = stationvalue.count * factor;
			bobbels[i].setAttributeNS(null,"r", bobbelvalue);
		}
	}
}	
	
function showTooltip(evt, id){	
	var div = document.getElementById("infoDiv");
	var map = document.getElementById("Map");
	tooltip.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1500/map.clientWidth +25);
	tooltip.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight + 48);
	tooltip.firstChild.data = getMouseoverText(id);  
	tooltip.setAttributeNS(null,"visibility","visible");
	tooltip_bg.setAttributeNS(null,"x",(evt.clientX - div.offsetLeft) * 1500/map.clientWidth  +21);
	tooltip_bg.setAttributeNS(null,"y",(evt.clientY - div.offsetTop) * 920/map.clientHeight +28); 	
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

function selectLine (id){
	var newID = id.replace("label", "line");
	var lineS1 = document.getElementById("line_S1");
	var lineS2 = document.getElementById("line_S2");
	var lineS3 = document.getElementById("line_S3");
	var lineS11 = document.getElementById("line_S11");
	var lineS21 = document.getElementById("line_S21");
	var lineS31 = document.getElementById("line_S31");
	
	var line = document.getElementById(newID);
	if(line.getAttribute('opacity') == 0.3){
		lineS1.setAttributeNS(null,"opacity",0.3);
		lineS2.setAttributeNS(null,"opacity",0.3);
		lineS3.setAttributeNS(null,"opacity",0.3);
		lineS11.setAttributeNS(null,"opacity",0.3);
		lineS21.setAttributeNS(null,"opacity",0.3);
		lineS31.setAttributeNS(null,"opacity",0.3);
		line.setAttributeNS(null,"opacity",1);
	}else if (lineS1.getAttribute('opacity') == 1 && lineS2.getAttribute('opacity') == 1
	&& lineS3.getAttribute('opacity') == 1 && lineS11.getAttribute('opacity') == 1
	&& lineS21.getAttribute('opacity') == 1 && lineS31.getAttribute('opacity') == 1){
		lineS1.setAttributeNS(null,"opacity",0.3);
		lineS2.setAttributeNS(null,"opacity",0.3);
		lineS3.setAttributeNS(null,"opacity",0.3);
		lineS11.setAttributeNS(null,"opacity",0.3);
		lineS21.setAttributeNS(null,"opacity",0.3);
		lineS31.setAttributeNS(null,"opacity",0.3);
		line.setAttributeNS(null,"opacity",1);
	}else{
		lineS1.setAttributeNS(null,"opacity",1);
		lineS2.setAttributeNS(null,"opacity",1);
		lineS3.setAttributeNS(null,"opacity",1);
		lineS11.setAttributeNS(null,"opacity",1);
		lineS21.setAttributeNS(null,"opacity",1);
		lineS31.setAttributeNS(null,"opacity",1);
		line.setAttributeNS(null,"opacity",1);
	}
	
	
}

function selectStation (id){
	id = id.replace("label_", "");
	var station = document.getElementById(id);
	
	//second click on selected station -> remove station, make second to first
	if(station.style.strokeWidth == 4){
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
	
	showZoomView();
}

function showZoomView(){
	var zoomView = document.getElementById("zoomView");
	
	//no station, no route seleted
	if(selectedStations[0] == "" && selectedStations[1] == ""){
		zoomView.innerHTML = "Nothing selected";
		
	}
	//only one station, no route
	else if(selectedStations[0] != "" && selectedStations[1] == ""){
		var lines = linesOfStations.find(function(f) { return f.station === selectedStations[0]; }).lines;
		zoomView.innerHTML = selectedStations[0] + " Station selected: "+lines.length;
	}
	//route selected
	else{
		var lines1 = linesOfStations.find(function(f) { return f.station === selectedStations[0]; }).lines;
		var lines2 = linesOfStations.find(function(f) { return f.station === selectedStations[1]; }).lines;
		var lines = lines1.filter((n) => lines2.includes(n))
		zoomView.innerHTML = selectedStations[0] +" -> "+selectedStations[1]+" Route selected: "+lines.length;
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

var stationData= [
{station: "Pinneberg", 				count: 20},
{station: "Thesdorf", 				count: 30},
{station: "Halstenbek", 			count: 50},
{station: "Krupunder", 				count: 12},
{station: "Elbgaustrasse", 			count: 25},
{station: "Eidelstedt", 			count: 14},
{station: "Stellingen", 			count: 4},
{station: "Langenfelde", 			count: 18},
{station: "Diebstreich", 			count: 28},
{station: "Holstenstrasse", 		count: 45},
{station: "Sternschanze", 			count: 20},
{station: "Dammtor", 				count: 30},
{station: "Hamburg Hbf",			count: 69},
{station: "Berliner Tor", 			count: 57},
{station: "Landwehr", 				count: 24},
{station: "Hasselbrook", 			count: 26},
{station: "Wandsbeker Chaussee", 	count: 33},
{station: "Friedrichsberg", 		count: 17},
{station: "Barmbek", 				count: 20},
{station: "Alte Woehr", 			count: 17},
{station: "Ruebenkamp", 			count: 10},
{station: "Ohlsdorf", 				count: 8},
{station: "Hamburg Airport", 		count: 36},
{station: "Kornweg", 				count: 7},
{station: "Hoheneichen", 			count: 22},
{station: "Wellingsbuettel", 		count: 19},
{station: "Poppenbuettel", 			count: 10},
{station: "Aumuehle", 				count: 20},
{station: "Wohltorf", 				count: 7},
{station: "Reinbek", 				count: 13},
{station: "Hamburg-Bergedorf", 		count: 16},
{station: "Nettelnburg", 			count: 20},
{station: "Allermoehe", 			count: 30},
{station: "Mittlerer Landweg", 		count: 14},
{station: "Billwerder-Moorfleet", 	count: 26},
{station: "Tiefstack", 				count: 6},
{station: "Rothenburgsort", 		count: 13},
{station: "Hammerbrook", 			count: 4},
{station: "Veddel", 				count: 40},
{station: "Wilhelmsburg", 			count: 34},
{station: "Hamburg-Harburg", 		count: 50},
{station: "Harburg Rathaus", 		count: 29},
{station: "Heimfeld", 				count: 19},
{station: "Neuwiedenthal", 			count: 8},
{station: "Neugraben", 				count: 5},
{station: "Fischbek", 				count: 30},
{station: "Neu Wulmstorf", 			count: 12}, 
{station: "Buxtehude", 				count: 46},
{station: "Neukloster", 			count: 30},
{station: "Horneburg", 				count: 17},
{station: "Dollern", 				count: 12},
{station: "Agathenburg", 			count: 28},
{station: "Stade", 					count: 22},
{station: "Jungfernstieg", 			count: 11},
{station: "Stadthausbruecke", 		count: 10},
{station: "Landungsbruecken", 		count: 21},
{station: "Reeperbahn", 			count: 13},
{station: "Koenigstrasse",		 	count: 58},
{station: "Hamburg-Altona", 		count: 30},
{station: "Bahrenfeld", 			count: 24},
{station: "Othmarschen", 			count: 18},
{station: "Klein Flottbek", 		count: 9},
{station: "Hochkamp", 				count: 6},
{station: "Blankenese", 			count: 33},
{station: "Iserbrook", 				count: 25},
{station: "Suelldorf", 				count: 16},
{station: "Rissen", 				count: 8},
{station: "Wedel", 					count: 11}
];

