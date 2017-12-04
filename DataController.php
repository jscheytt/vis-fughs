<?php

session_start();
date_default_timezone_set("Europe/Berlin");

//Request an entsprechende Funktion weiterleiten
if(!empty($_POST)){
	$view = urldecode($_POST['view']);
	$passenger = intval(urldecode($_POST['passenger']));
	$varianz = urldecode($_POST['varianz']) === 'true'? true: false;
	$stations = explode(",", urldecode($_POST['stations']));	
	$line = urldecode($_POST['line']);
	
	if($view == "1"){
		loadView1();
	}
	else if($view == "2"){
		//loadView2();
	}
	else if($view == "3"){
		//loadView3();
	}
	else if($view == "4"){
		//loadView4();
	}
	else if($view == "5"){
		//loadView5();
	}
	else if($view == "zoom"){
		loadViewZoom($stations, $line);
	}
	// if (array_key_exists('room', $_POST)){
		// getOPInfos(urldecode($_POST['room']));
	// }else if (array_key_exists('state', $_POST)){
		// getOPStates(urldecode($_POST['state']));
	// }
	//loadCSV();
}


function loadView1(){
	$resultList = [];
	
	$fp = @fopen("data.csv", "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); //[0] station, [1] line, [2] count
		if($spalten[0] != "station"){
		if(array_key_exists($spalten[0], $resultList)){
			$resultList [$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[2]);
			//$resultList[$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[2]);
		}else{
			$resultList [$spalten[0]] = intval($spalten[2]);
			//$station = new \stdClass();
			//$station->Name = $spalten[0];
			//$station->Anzahl = intval($spalten[2]);
			//array_push($resultList, $station);
		}
		//if(in_array($spalten[1], $lines){
			//$station->Anzahl = $station->Anzahl + intval($spalten[2]);
		//}
		}
	} 
	fclose($fp); 
	
	$result = [];
	foreach($resultList as $key => $value){
		$station = new \stdClass();
		$station->Name = $key;
		$station->Anzahl = $value;
		array_push($result, $station);
	}
	//Ausgabe 
	echo json_encode($result);
}

function loadViewZoom($stations, $line){
	$resultList = [];
	
	$fp = @fopen("data.csv", "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); //[0] station, [1] line, [2] count
		if($spalten[0] != "station" && in_array($spalten[0], $stations) && ($spalten[1] == $line || $line == "")){
			if(array_key_exists($spalten[1], $resultList)){
				$resultList [$spalten[1]] = $resultList[$spalten[1]] + intval($spalten[2]);
			//$resultList[$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[2]);
			}else{
				$resultList [$spalten[1]] = intval($spalten[2]);
			//$station = new \stdClass();
			//$station->Name = $spalten[0];
			//$station->Anzahl = intval($spalten[2]);
			//array_push($resultList, $station);
			}
		//if(in_array($spalten[1], $lines){
			//$station->Anzahl = $station->Anzahl + intval($spalten[2]);
		//}
		}
	} 
	fclose($fp); 
	
	$result = [];
	foreach($resultList as $key => $value){
		$station = new \stdClass();
		$station->Linie = $key;
		$station->Anzahl = $value;
		array_push($result, $station);
	}
	//Ausgabe 
	echo json_encode($result);
}

?>