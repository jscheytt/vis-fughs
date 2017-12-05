var requestData1;
var requestData2;
var requestData3;
var requestData4;
var requestData5;
var requestDataZoom;


function loadData(){ //wird bei onload der Seite aufgerufen  
	//requestDataForView("2", "", ""); //timeline laden
}

function onCheckChange(id){
	var ein = document.getElementById("EinsteigerCheckbox");
	var aus = document.getElementById("AussteigerCheckbox");
	if(!ein.checked && !aus.checked){
		if(id == "EinsteigerCheckbox"){
			aus.checked = true;
		}
		if(id == "AussteigerCheckbox"){
			ein.checked = true;
		}
	}
	requestDataForView("2", "", "");
}

//onVarianz change -> requestData("2") -> select timeslot again
//onEinAus change -> requestData("2") -> select timeslot again
//onRaster change -> requestData("2") -> select first timeslot
//onSelectionView2 change -> requestData("1")
//onSelectionView1 change -> requestData("3"), requestData("4"), requestData("5")
//onSelectionZoom change -> requestData("3"), requestData("4"), requestData("5")
function requestDataForView(view, stations, lines){
	
	// if(requestData1 != null ||
	   // requestData2 != null ||
	   // requestData3 != null ||
	   // requestData4 != null ||
	   // requestData5 != null ||
	   // requestDataZoom != null){
			// return;
	   // }
	var varianz = document.getElementById("VarianzCheckbox").checked;
	
	var passenger = 0;
	var ein = document.getElementById("EinsteigerCheckbox");
	var aus = document.getElementById("AussteigerCheckbox");
	if(ein.checked && !aus.checked){
		passenger = 1;
	}else if (!ein.checked && aus.checked){
		passenger = 2;
	}
	
	if(view == "1"){
		if(window.XMLHttpRequest){
			requestData1 = new XMLHttpRequest();
		}else{
			requestData1 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestData1.open('post', 'DataController.php', true);
		requestData1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestData1.onreadystatechange = handleResponseView1;
		requestData1.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
	else if(view == "2"){
		if(window.XMLHttpRequest){
			requestData2 = new XMLHttpRequest();
		}else{
			requestData2 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestData2.open('post', 'DataController.php', true);
		requestData2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestData2.onreadystatechange = handleResponseView2;
		requestData2.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
	else if(view == "3"){
		if(window.XMLHttpRequest){
			requestData3 = new XMLHttpRequest();
		}else{
			requestData3 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestData3.open('post', 'DataController.php', true);
		requestData3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestData3.onreadystatechange = handleResponseView3;
		requestData3.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
		//alert ("view="+view+"    stations="+stations+"     lines="+lines+"    passenger="+passenger+"     varianz="+varianz);
	}
	else if(view == "4"){
		if(window.XMLHttpRequest){
			requestData4 = new XMLHttpRequest();
		}else{
			requestData4 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestData4.open('post', 'DataController.php', true);
		requestData4.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestData4.onreadystatechange = handleResponseView4;
		requestData4.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
	else if(view == "5"){
		if(window.XMLHttpRequest){
			requestData5 = new XMLHttpRequest();
		}else{
			requestData5 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestData5.open('post', 'DataController.php', true);
		requestData5.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestData5.onreadystatechange = handleResponseView5;
		requestData5.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
	else if(view == "zoom"){
		if(window.XMLHttpRequest){
			requestDataZoom = new XMLHttpRequest();
		}else{
			requestDataZoom = new ActiveXObject("Microsoft.XMLHTTP");
		}
		requestDataZoom.open('post', 'DataController.php', true);
		requestDataZoom.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		requestDataZoom.onreadystatechange = handleResponseViewZoom;
		requestDataZoom.send("view="+view+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
}

function handleResponseView1(){
	if (requestData1.readyState == 4 && requestData1.status == 200){
		showView1(JSON.parse(requestData1.responseText));
		requestData1 = null;
	}
}

function handleResponseViewZoom(){
	if (requestDataZoom.readyState == 4 && requestDataZoom.status == 200){
		showViewZoom(JSON.parse(requestDataZoom.responseText));
		requestDataZoom = null;
	}
}

function handleResponseView2(){
	if (requestData2.readyState == 4 && requestData2.status == 200){
		//showView2(JSON.parse(requestData2.responseText));
		//alert(requestData2.responseText);
		requestData2 = null;
		requestDataForView("1", getStations(selectedStations[0], selectedStations[1]), line);
	}
}

function handleResponseView3(){
	if (requestData3.readyState == 4 && requestData3.status == 200){
		//showView3(JSON.parse(requestData.responseText));
		//alert(requestData3.responseText);
		requestData3 = null;
	}
}

function handleResponseView4(){
	if (requestData4.readyState == 4 && requestData4.status == 200){
		//showView4(JSON.parse(requestData.responseText));
		//alert(requestData4.responseText);
		requestData4 = null;
	}
}

function handleResponseView5(){
	if (requestData5.readyState == 4 && requestData5.status == 200){
		//showView5(JSON.parse(requestData.responseText));
		//alert(requestData5.responseText);
		requestData5 = null;
	}
}