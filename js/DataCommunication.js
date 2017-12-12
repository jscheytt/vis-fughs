var requestData1;
var requestData2;
var requestData3;
var requestData4;
var requestData5;
var requestDataZoom;


// 0 -> gesamt, 1 -> months, 2 -> weeks, 3 -> days
var timestep = 0;
var selectedTime = "";


function loadData(){ //wird bei onload der Seite aufgerufen  
	requestDataForView("2", "", ""); //timeline laden
}

function onCheckChange(id){	
	//Checkboxen Ein-/Aussteiger
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

function onTimestepChange (step){
	timestep = step;
	requestDataForView("2", "", "");
}

//onVarianz change -> requestData("2") -> select timeslot again
//onEinAus change -> requestData("2") -> select timeslot again
//onRaster change -> requestData("2") -> select first timeslot
//onSelectionView2 change -> requestData("1")
//onSelectionView1 change -> requestData("3"), requestData("4"), requestData("5")
//onSelectionZoom change -> requestData("3"), requestData("4"), requestData("5")
function requestDataForView(view, stations, lines){
	
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
		requestData1.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
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
		requestData2.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
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
		requestData3.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
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
		requestData4.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
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
		requestData5.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
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
		requestDataZoom.send("view="+view+"&timestep="+timestep+"&selectedTime="+selectedTime+"&passenger="+passenger+"&varianz="+varianz+"&stations="+stations+"&lines="+lines);
	}
}

function handleResponseView1(){
	if (requestData1 != null && requestData1.readyState == 4 && requestData1.status == 200){
		showView1(JSON.parse(requestData1.responseText));
		requestData1 = null;
	}
}

function handleResponseViewZoom(){
	if (requestDataZoom != null && requestDataZoom.readyState == 4 && requestDataZoom.status == 200){
		showViewZoom(JSON.parse(requestDataZoom.responseText));
		requestDataZoom = null;
	}
}

function handleResponseView2(){
	if (requestData2 != null && requestData2.readyState == 4 && requestData2.status == 200){
		requestData2 = null;
		//showView2(JSON.parse(requestData2.responseText)); -> einkommentieren
		showView2 (timestep); //löschen wenn das darüber einkommentiert
		requestDataForView("1", getStations(selectedStations[0], selectedStations[1]), line);
	}
}

function handleResponseView3(){
	if (requestData3 != null && requestData3.readyState == 4 && requestData3.status == 200){
		//showView3(JSON.parse(requestData.responseText)); -> einkommentieren
		
		//Die Methode showView3 wird mit einem Array als Parameter aufgerufen das die Daten für die View in folgendem Format enthält: 
		//JSON.parse(requestData.responseText) -> [{Bin: 1, Haltezeiten: [10, 17, 35]}, {Bin: 2, Haltezeiten: [22, 24]}, {Bin: 3, Haltezeiten: [8, 19, 200]}]
		//Zugriff auf die Daten:
		//data[0].Bin -> 1, data[0].Haltezeiten -> [10, 17, 35]
		requestData3 = null;
	}
}

function handleResponseView4(){
	if (requestData4 != null && requestData4.readyState == 4 && requestData4.status == 200){
		//showView4(JSON.parse(requestData.responseText));
		requestData4 = null;
	}
}

function handleResponseView5(){
	if (requestData5 != null && requestData5.readyState == 4 && requestData5.status == 200){
		//showView5(JSON.parse(requestData.responseText));
		requestData5 = null;
	}
}