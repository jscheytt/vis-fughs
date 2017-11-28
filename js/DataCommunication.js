var requestData;


function loadData(){ //wird bei onload der Seite aufgerufen  
	if(window.XMLHttpRequest){
		requestData = new XMLHttpRequest();
	}else{
		requestData = new ActiveXObject("Microsoft.XMLHTTP");
	}
	requestData.open('post', 'DataController.php', true);
	requestData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
	requestData.onreadystatechange = showData;
	requestData.send("einsteiger=true");
}

function showData(){
	if (requestData.readyState == 4 && requestData.status == 200){
		//alert(requestData.responseText); //einkommentieren um alertfenster darzustellen
	}
}