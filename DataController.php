<?php

session_start();
date_default_timezone_set("Europe/Berlin");

//Request an entsprechende Funktion weiterleiten
if(!empty($_POST)){
	$view = urldecode($_POST['view']);
	$passenger = intval(urldecode($_POST['passenger']));
	$varianz = urldecode($_POST['varianz']) === 'true'? true: false;
	$stations = explode(",", urldecode($_POST['stations']));	
	$lines = explode(",", urldecode($_POST['lines']));
	
	if($view == "1"){
		loadView1($passenger, $varianz);
	}
	else if($view == "2"){
		loadView2();
	}
	else if($view == "3"){
		loadView3();
	}
	else if($view == "4"){
		loadView4();
	}
	else if($view == "5"){
		loadView5();
	}
	else if($view == "zoom"){
		loadViewZoom($stations, $lines, $passenger, $varianz);
	}
}


function loadView1($passenger, $varianz){
	$resultList = [];
	$in = 2;
	$out = 3;
	if($varianz){
		$in = 4;
		$out = 5;
	}
	$fp = @fopen("data.csv", "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); //[0] station, [1] line, [2] in, [3] out, [4] varin, [5] varout
		if($spalten[0] != "station"){
			if($passenger == 0){ //in + out
			
				if(array_key_exists($spalten[0], $resultList)){
					$resultList [$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[$in]) + intval($spalten[$out]);
				}else{
					$resultList [$spalten[0]] = intval($spalten[$in]) + intval($spalten[$out]);
				}
			}
			
			if($passenger == 1){ //in
				if(array_key_exists($spalten[0], $resultList)){
					$resultList [$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[$in]);
				}else{
					$resultList [$spalten[0]] = intval($spalten[$in]);
				}
			}
			
			if($passenger == 2){ //out
				if(array_key_exists($spalten[0], $resultList)){
					$resultList [$spalten[0]] = $resultList[$spalten[0]] + intval($spalten[$out]);
				}else{
					$resultList [$spalten[0]] = intval($spalten[$out]);
				}
			}
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

function loadViewZoom($stations, $lines, $passenger, $varianz){
	$resultList = [];
	$in = 2;
	$out = 3;
	if($varianz){
		$in = 4;
		$out = 5;
	}
	
	$fp = @fopen("data.csv", "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); //[0] station, [1] line, [2] in, [3] out, [4] varin, [5] varout
		if($spalten[0] != "station" && in_array($spalten[0], $stations) && (in_array($spalten[1],$lines) || count($lines) == 0 || (count($lines) == 1 && $lines[0] == ""))){
			if($passenger == 0){ //in + out
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = intval($resultList[$spalten[1]]) + intval($spalten[$in])+ intval($spalten[$out]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[$in]) + intval($spalten[$out]);
				}				
			}
			
			if($passenger == 1){ //in
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = intval($resultList[$spalten[1]]) + intval($spalten[$in]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[$in]);
				}				
			}
			
			if($passenger == 2){ //out
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = intval($resultList[$spalten[1]]) + intval($spalten[$out]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[$out]);
				}				
			}
		
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

function loadView2(){
	echo "data view 2";	
}

function loadView3(){
	echo "data view 3";	
}

function loadView4(){
	echo "data view 4";	
}

function loadView5(){
	echo "data view 5";	
}


?>