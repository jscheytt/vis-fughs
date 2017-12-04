var requestData;


function loadData(){ //wird bei onload der Seite aufgerufen  
	//requestDataForView("2"); //timeline laden
}

//onVarianz change -> requestData("2") -> select timeslot again
//onEinAus change -> requestData("2") -> select timeslot again
//onRaster change -> requestData("2") -> select first timeslot
//onSelectionView2 change -> requestData("1")
//onSelectionView1 change -> requestData("3"), requestData("4"), requestData("5")
//onSelectionZoom change -> requestData("3"), requestData("4"), requestData("5")
function requestDataForView(view, stations, line){
	if(window.XMLHttpRequest){
		requestData = new XMLHttpRequest();
	}else{
		requestData = new ActiveXObject("Microsoft.XMLHTTP");
	}
	requestData.open('post', 'DataController.php', true);
	requestData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
	if(view == "1"){
		requestData.onreadystatechange = handleResponseView1;
	}
	else if(view == "2"){
		requestData.onreadystatechange = handleResponseView2;
	}
	else if(view == "3"){
		requestData.onreadystatechange = handleResponseView3;
	}
	else if(view == "4"){
		requestData.onreadystatechange = handleResponseView4;
	}
	else if(view == "5"){
		requestData.onreadystatechange = handleResponseView5;
	}
	else if(view == "zoom"){
		requestData.onreadystatechange = handleResponseViewZoom;
	}
	
	//view = '1' -> view1, '2' -> view2, '3' -> view3, '4' -> vew4, '5' -> view5, 'zoom' -> viewZoom
	//passenger = '0' -> ein & aus, '1' -> ein, '2' -> aus
	//varianz = 'true' -> an, 'false' -> aus
	//stationstart = 'stationname', '' -> keine gewählt
	//stationend = 'stationname', '' -> keine gewählt
	//line= 'linename'
	requestData.send("view="+view+"&passenger=0&varianz=false&stations="+stations+"&line="+line);
}

function handleResponseView1(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showView1(JSON.parse(requestData.responseText));
		requestData = null;
	}
}

function handleResponseViewZoom(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showViewZoom(JSON.parse(requestData.responseText));
		requestData = null;
	}
}

function handleResponseView2(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showView2(JSON.parse(requestData.responseText));
	}
}

function handleResponseView3(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showView3(JSON.parse(requestData.responseText));
	}
}

function handleResponseView4(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showView4(JSON.parse(requestData.responseText));
	}
}

function handleResponseView5(){
	if (requestData.readyState == 4 && requestData.status == 200){
		showView5(JSON.parse(requestData.responseText));
	}
}