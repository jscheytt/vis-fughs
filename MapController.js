var selectedStations;

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
}

function showTooltip(evt, id){	
	var div = document.getElementById("MapDiv");
	var map = document.getElementById("Map");
	tooltip.setAttributeNS(null,"x",(evt.pageX - div.offsetLeft) * 1500/map.clientWidth +21);
	tooltip.setAttributeNS(null,"y",(evt.pageY - div.offsetTop) * 920/map.clientHeight + 37 -480);
	tooltip.firstChild.data = getMouseoverText(id);  
	tooltip.setAttributeNS(null,"visibility","visible");
	tooltip_bg.setAttributeNS(null,"x",(evt.pageX - div.offsetLeft) * 1500/map.clientWidth  +18);
	tooltip_bg.setAttributeNS(null,"y",(evt.pageY - div.offsetTop) * 920/map.clientHeight +26 - 480); 	
	tooltip_bg.setAttributeNS(null,"visibility","visible");
	length = tooltip.getComputedTextLength();
	tooltip_bg.setAttributeNS(null,"width",length+8);
}

function getMouseoverText (id){
	return "Anzahl "+id;
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
	var station = document.getElementById(id);
	if(station.style.strokeWidth != 4){	
		station.style.strokeWidth = 4;
		station.style.fill = "#000000";
	}else{
		station.style.strokeWidth = 0.8;
		station.style.fill = "#ffffff";
	}
}



