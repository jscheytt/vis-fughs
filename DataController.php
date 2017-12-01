<?php

session_start();
date_default_timezone_set("Europe/Berlin");

//Request an entsprechende Funktion weiterleiten
if(!empty($_POST)){
	// if (array_key_exists('room', $_POST)){
		// getOPInfos(urldecode($_POST['room']));
	// }else if (array_key_exists('state', $_POST)){
		// getOPStates(urldecode($_POST['state']));
	// }
	loadCSV();
}

function loadCSV(){
	
	$sumEin = 0;
	$sumAus = 0;
	
	$fp = @fopen("data.csv", "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp, 1000)) 
	{ 
		$spalten = explode(";", $zeile); 
		$sumEin += intval($spalten[2]);  //Einsteiger
		$sumAus += intval($spalten[3]);  //Aussteiger
	} 
	fclose($fp); 
	
	//Ausgabe 
	echo "Einsteiger: " .$sumEin; 
	echo "Aussteiger: " .$sumAus; 
}

function getNextOPArt($room){

}

?>