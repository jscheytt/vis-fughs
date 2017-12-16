var requestData1;
var requestData2;
var requestData3;
var requestData4;
var requestData5;
var requestDataZoom;

var spinner3;
var spinner4;
var spinner5;

var timeForView1;
var timeForView2;
var timeForView3;
var timeForView4;
var timeForView5;

// 0 -> gesamt, 1 -> months, 2 -> weeks, 3 -> days
var timestep = 0;
var selectedTime = "";


function loadData(){ //wird bei onload der Seite aufgerufen  
	requestDataForView("2", "", ""); //timeline laden
}

function onCheckChange(id){	
	//Checkboxen Ein-/Aussteiger
	requestDataForView("2", "", "");
}

function onTimestepChange (step){
	timestep = step;
	requestDataForView("2", "", "");
}

function onSelectedTimeChange(selTime){
	selectedTime = selTime;
	requestDataForView("1", getStations(selectedStations[0], selectedStations[1]), line);
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
	var mittel = document.getElementById("MittelwertCheckbox");
	if(ein.checked){
		passenger = 0;
	}else if (aus.checked){
		passenger = 1;
	}else if (mittel.checked){
		passenger = 2;
	}
	
	if(view == "1"){
		if(window.XMLHttpRequest){
			requestData1 = new XMLHttpRequest();
		}else{
			requestData1 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		timeForView1 = Date.now();
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
		timeForView2 = Date.now();
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
		
		//clear view 3
		var regionChart = document.getElementById("view3Diagram");
		if(regionChart != null){
			regionChart.innerHTML = "";
		}
		if(spinner3 == null){
			spinner3 = new Spinner();
		}
		spinner3.spin();
		regionChart.appendChild(spinner3.el);
		
		timeForView3 = Date.now();
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
		
		//clear view 4
		var regionChart = document.getElementById("heatmap");
		if(regionChart != null){
			regionChart.innerHTML = "";
		}
		if(spinner4 == null){
			spinner4 = new Spinner();
		}
		spinner4.spin();
		regionChart.appendChild(spinner4.el);
		
		timeForView4 = Date.now();
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
		
		//clear view 5		
		var regionChart = document.getElementById("view5Diagram");
		if(regionChart != null){
			regionChart.innerHTML = "";
		}
		if(spinner5 == null){
			spinner5 = new Spinner();
		}
		spinner5.spin();
		regionChart.appendChild(spinner5.el);
		
		timeForView5 = Date.now();
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
		
		timeForView1 = Date.now() - timeForView1;
		console.log("Loading Time View 1: "+timeForView1+" ms\n");
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
		showView2(JSON.parse(requestData2.responseText));
		requestData2 = null;
		
		timeForView2 = Date.now() - timeForView2;
		console.log("Loading Time View 2: "+timeForView2+" ms\n");
	}
}

function handleResponseView3(){
	if (requestData3 != null && requestData3.readyState == 4 && requestData3.status == 200){
		showView3(JSON.parse(requestData3.responseText));
		spinner3.stop();
		requestData3 = null;
		
		timeForView3 = Date.now() - timeForView3;
		console.log("Loading Time View 3: "+timeForView3+" ms\n");
	}
}

function handleResponseView4(){
	if (requestData4 != null && requestData4.readyState == 4 && requestData4.status == 200){
		showView4(JSON.parse(requestData4.responseText));
		spinner4.stop();
		requestData4 = null;
		
		timeForView4 = Date.now() - timeForView4;
		console.log("Loading Time View 4: "+timeForView4+" ms\n");
	}
}

function handleResponseView5(){
	if (requestData5 != null && requestData5.readyState == 4 && requestData5.status == 200){
		showView5(JSON.parse(requestData5.responseText));
		spinner5.stop();
		requestData5 = null;
		
		timeForView5 = Date.now() - timeForView5;
		console.log("Loading Time View 5: "+timeForView5+" ms\n");
	}
}