<?php
$filefolder = "data";


//Request an entsprechende Funktion weiterleiten
if(!empty($_POST)){
	$view = urldecode($_POST['view']);
	$timestep = intval(urldecode($_POST['timestep']));
	$selectedTime = urldecode($_POST['selectedTime']); //2016-12-01
	if($selectedTime == "0"){
		$selectedTime = "";
	}
	if($selectedTime != ""){
		$selectedTime = date('d.m.Y', strtotime(urldecode($_POST['selectedTime'])));
	}
	$passenger = intval(urldecode($_POST['passenger']));
	$varianz = urldecode($_POST['varianz']) === 'true'? true: false;
	$stations = explode(",", urldecode($_POST['stations']));	
	$lines = explode(",", urldecode($_POST['lines']));
	
	if($view == "1"){
		loadView1($timestep, $selectedTime, $passenger);
	}
	else if($view == "2"){
		loadView2($timestep, $selectedTime, $passenger, $varianz);
	}
	else if($view == "3"){
		loadView3($timestep, $selectedTime, $stations, $lines, $passenger);
	}
	else if($view == "4"){
		loadView4($timestep, $selectedTime, $stations, $lines, $passenger);
	}
	else if($view == "5"){
		loadView5($timestep, $selectedTime, $stations, $lines, $passenger, $varianz);
	}
	else if($view == "zoom"){
		loadViewZoom($timestep, $selectedTime, $stations, $lines, $passenger);
	}
}


function loadView1($timestep, $selectedTime, $passenger){
	global $filefolder;
	
	//Data-files View 1 & Zoom
	$dataView1_Complete = $filefolder."/2017_mapzoom_complete.csv";
	$dataView1_Days = $filefolder."/2017_mapzoom_days.csv";
	$dataView1_Months = $filefolder."/2017_mapzoom_months.csv";
	$dataView1_Weeks = $filefolder."/2017_mapzoom_weeks.csv";

	if($timestep == 0){
		$data = $dataView1_Complete;
	}else if($timestep == 1){
		$data = $dataView1_Months;
		$selectedDay = date('m.Y', strtotime($selectedTime));
	}else if($timestep == 2){	
		$data = $dataView1_Weeks;
		$selectedDay = date('d.m.Y', strtotime($selectedTime));
		$Day2OfWeek = date('d.m.Y', strtotime("+1 day", strtotime($selectedTime)));
		$Day3OfWeek = date('d.m.Y', strtotime("+2 day", strtotime($selectedTime)));
		$Day4OfWeek = date('d.m.Y', strtotime("+3 day", strtotime($selectedTime)));
		$Day5OfWeek =  date('d.m.Y', strtotime("+4 day", strtotime($selectedTime)));
		$Day6OfWeek = date('d.m.Y', strtotime("+5 day", strtotime($selectedTime)));
		$Day7OfWeek = date('d.m.Y', strtotime("+6 day", strtotime($selectedTime)));
	}else if($timestep == 3){
		$data = $dataView1_Days;
	}
	
	$resultList = [];

	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); 
		
		if($spalten[1] != "Station" && $timestep == 2){
			$spalten0 = date('d.m.Y', strtotime($spalten[0]));
		}
		//data: [0] Timestamp, [1] Station, [2] Linie, [3] Einsteiger, [4] Aussteiger, [5] Durchschnitt
		if($spalten[1] != "Station"
				&& (( $timestep == 0 && $selectedTime == "") //gesamt
				|| ($timestep == 1 && date('m.Y', strtotime($spalten[0])) == $selectedDay)// monat -> alle wo monat im datum ist
				|| ($timestep == 2 && ($spalten0 == $selectedDay  //weeks -> für ab datum + 7 tage
				|| $spalten0 == $Day2OfWeek
				|| $spalten0 == $Day3OfWeek 
				|| $spalten0 == $Day4OfWeek
				|| $spalten0 == $Day5OfWeek
				|| $spalten0 == $Day6OfWeek
				|| $spalten0 == $Day7OfWeek
			)) ||($timestep == 3 && date('d.m.Y', strtotime($spalten[0])) == $selectedTime)) //alle für den tag
		
		){ 
			if($passenger == 0){ //in + out
			
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = $resultList[$spalten[1]] + intval($spalten[5]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[5]);
				}
			}
			
			else if($passenger == 1){ //in
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = $resultList[$spalten[1]] + intval($spalten[3]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[3]);
				}
			}
			
			else if($passenger == 2){ //out
				if(array_key_exists($spalten[1], $resultList)){
					$resultList [$spalten[1]] = $resultList[$spalten[1]] + intval($spalten[4]);
				}else{
					$resultList [$spalten[1]] = intval($spalten[4]);
				}
			}
		}
	} 
	fclose($fp); 
	
	$result = [];
	foreach($resultList as $key => $value){
		$station = new \stdClass();
		$station->Name = getCompleteStationname($key);
		$station->Anzahl = $value;
		array_push($result, $station);
	}
	//Ausgabe 
	echo json_encode($result);
}

function loadViewZoom($timestep, $selectedTime, $stations, $lines, $passenger){
	global $filefolder;
	
	//Data-files View 1 & Zoom
	$dataView1_Complete = $filefolder."/2017_mapzoom_complete.csv";
	$dataView1_Days = $filefolder."/2017_mapzoom_days.csv";
	$dataView1_Months = $filefolder."/2017_mapzoom_months.csv";
	$dataView1_Weeks = $filefolder."/2017_mapzoom_weeks.csv";
	
	if($timestep == 0){
		$data = $dataView1_Complete;
	}else if($timestep == 1){
		$data = $dataView1_Months;
		$selectedDay = date('m.Y', strtotime($selectedTime));
	}else if($timestep == 2){	
		$data = $dataView1_Weeks;
		$selectedDay = date('d.m.Y', strtotime($selectedTime));
		$Day2OfWeek = date('d.m.Y', strtotime("+1 day", strtotime($selectedTime)));
		$Day3OfWeek = date('d.m.Y', strtotime("+2 day", strtotime($selectedTime)));
		$Day4OfWeek = date('d.m.Y', strtotime("+3 day", strtotime($selectedTime)));
		$Day5OfWeek =  date('d.m.Y', strtotime("+4 day", strtotime($selectedTime)));
		$Day6OfWeek = date('d.m.Y', strtotime("+5 day", strtotime($selectedTime)));
		$Day7OfWeek = date('d.m.Y', strtotime("+6 day", strtotime($selectedTime)));
	}else if($timestep == 3){
		$data = $dataView1_Days;
	}
	
	$stations = array_map("getAbkStationname",$stations);
	
	$resultList = [];
	
	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); 
		
		if($spalten[1] != "Station" && $timestep == 2){
			$spalten0 = date('d.m.Y', strtotime($spalten[0]));
		}
		
		//data: [0] Timestemp, [1] Station, [2] Linie, [3] Einsteiger, [4] Aussteiger, [5] Durchschnitt
		if($spalten[1] != "Station" && in_array($spalten[1], $stations) && (in_array($spalten[2],$lines) || count($lines) == 0 || (count($lines) == 1 && $lines[0] == ""))
		&& (( $timestep == 0 && $selectedTime == "") //gesamt
				|| ($timestep == 1 && date('m.Y', strtotime($spalten[0])) == $selectedDay)// monat -> alle wo monat im datum ist
				|| ($timestep == 2 && ($spalten0 == $selectedDay  //weeks -> für ab datum + 7 tage
				|| $spalten0 == $Day2OfWeek
				|| $spalten0 == $Day3OfWeek 
				|| $spalten0 == $Day4OfWeek
				|| $spalten0 == $Day5OfWeek
				|| $spalten0 == $Day6OfWeek
				|| $spalten0 == $Day7OfWeek
			)) ||($timestep == 3 && date('d.m.Y', strtotime($spalten[0])) == $selectedTime)) //alle für den tag
		){
			if($passenger == 0){ //in + out
				if(array_key_exists($spalten[2], $resultList)){
					$resultList [$spalten[2]] = intval($resultList[$spalten[2]]) + intval($spalten[5]);
				}else{
					$resultList [$spalten[2]] = intval($spalten[5]);
				}				
			}
			
			else if($passenger == 1){ //in
				if(array_key_exists($spalten[2], $resultList)){
					$resultList [$spalten[2]] = intval($resultList[$spalten[2]]) + intval($spalten[3]);
				}else{
					$resultList [$spalten[2]] = intval($spalten[3]);
				}				
			}
			
			else if($passenger == 2){ //out
				if(array_key_exists($spalten[2], $resultList)){
					$resultList [$spalten[2]] = intval($resultList[$spalten[2]]) + intval($spalten[4]);
				}else{
					$resultList [$spalten[2]] = intval($spalten[4]);
				}				
			}
		
		}
	} 
	fclose($fp); 
	
	$result = [];
	foreach($resultList as $key => $value){
		if($value != 0){
			$station = new \stdClass();
			$station->Linie = $key;
			$station->Anzahl = $value;
			array_push($result, $station);
		}
	}
	//Ausgabe 
	echo json_encode($result);
}

function loadView2($timestep, $selectedTime, $passenger, $varianz){
	global $filefolder;
	
	//Data-files View 2
	$dataView2_Complete = $filefolder."/2017_timeline_complete.csv";
	$dataView2_Days = $filefolder."/2017_timeline_days.csv";
	$dataView2_Months = $filefolder."/2017_timeline_months.csv";
	$dataView2_Weeks = $filefolder."/2017_timeline_weeks.csv";

	if($timestep == 0){
		$data = $dataView2_Complete;
	}else if($timestep == 1){
		$data = $dataView2_Months;
	}else if($timestep == 2){	
		$data = $dataView2_Weeks;
	}else if($timestep == 3){
		$data = $dataView2_Days;
	}
	
	$resultList = [];
	$in = 1;
	$out = 2;
	$inAndOut = 3;
	if($varianz){
		$in = 4;
		$out = 5;
		$inAndOut = 6;
	}
	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); 
		
		//data: [0] Timestemp, [1] Einsteiger, [2] Aussteiger, [3] Avg, [4] AbwEin, [5] AbwAus, [6] AbwAvg
		
		if($spalten[0] != "Timestamp"){
			if($passenger == 0){ //in + out
				$station = new \stdClass();
				$station->Datum = $spalten[0];
				$station->Anzahl = $spalten[$inAndOut];
				array_push($resultList, $station);
			}
			
			else if($passenger == 1){ //in
				$station = new \stdClass();
				$station->Datum = $spalten[0];
				$station->Anzahl = $spalten[$in];
				array_push($resultList, $station);
			}
			
			else if($passenger == 2){ //out
				$station = new \stdClass();
				$station->Datum = $spalten[0];
				$station->Anzahl = $spalten[$out];
				array_push($resultList, $station);
			}
		}
	} 
	fclose($fp); 
	
	//Ausgabe 
	echo json_encode($resultList);	
}

function loadView3($timestep, $selectedTime, $stations, $lines, $passenger){
	global $filefolder;
	
	//Data-files View 2
	$dataView3_Complete = $filefolder."/2017_duration_complete.csv";
	$dataView3_Days = $filefolder."/2017_duration_days.csv";
	$dataView3_Months = $filefolder."/2017_duration_months.csv";
	$dataView3_Weeks = $filefolder."/2017_duration_weeks.csv";

	if($timestep == 0){
		$data = $dataView3_Complete;
	}else if($timestep == 1){
		$data = $dataView3_Months;
		$selectedDay = date('m.Y', strtotime($selectedTime));
	}else if($timestep == 2){	
		$data = $dataView3_Weeks;
		$selectedDay = date('d.m.Y', strtotime($selectedTime));
		$Day2OfWeek = date('d.m.Y', strtotime("+1 day", strtotime($selectedTime)));
		$Day3OfWeek = date('d.m.Y', strtotime("+2 day", strtotime($selectedTime)));
		$Day4OfWeek = date('d.m.Y', strtotime("+3 day", strtotime($selectedTime)));
		$Day5OfWeek =  date('d.m.Y', strtotime("+4 day", strtotime($selectedTime)));
		$Day6OfWeek = date('d.m.Y', strtotime("+5 day", strtotime($selectedTime)));
		$Day7OfWeek = date('d.m.Y', strtotime("+6 day", strtotime($selectedTime)));
	}else if($timestep == 3){
		$data = $dataView3_Days;
	}
	
	$stations = array_map("getAbkStationname",$stations);
	
	$resultList = [];

	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); 
		
		if($spalten[1] != "Station" && $timestep == 2){
			$spalten0 = date('d.m.Y', strtotime($spalten[0]));
		}
		
		//data: [0] Timestamp, [1] Station, [2] Linie, [3] Bin, [4] EinHalte, [5] AusHalte, [6] DurchschnittHalte
		
		if($spalten[0] != "Timestamp" &&  in_array($spalten[1], $stations) && (in_array($spalten[2],$lines) || count($lines) == 0 || (count($lines) == 1 && $lines[0] == ""))
				&& (( $timestep == 0 && $selectedTime == "") //gesamt
				|| ($timestep == 1 && date('m.Y', strtotime($spalten[0])) == $selectedDay)// monat -> alle wo monat im datum ist
				|| ($timestep == 2 && ($spalten0 == $selectedDay  //weeks -> für ab datum + 7 tage
				|| $spalten0 == $Day2OfWeek
				|| $spalten0 == $Day3OfWeek 
				|| $spalten0 == $Day4OfWeek
				|| $spalten0 == $Day5OfWeek
				|| $spalten0 == $Day6OfWeek
				|| $spalten0 == $Day7OfWeek
			)) ||($timestep == 3 && date('d.m.Y', strtotime($spalten[0])) == $selectedTime)) //alle für den tag		
		){
			if($passenger == 0){ //in + out
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = array_merge($resultList [$spalten[3]], array_map('intval', explode(",", $spalten[6])));
				}else{
					$resultList [$spalten[3]] = array_map('intval', explode(",", $spalten[6]));
				}				
			}
			
			else if($passenger == 1){ //in
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = array_merge($resultList [$spalten[3]], array_map('intval', explode(",", $spalten[4])));
				}else{
					$resultList [$spalten[3]] = array_map('intval', explode(",", $spalten[4]));
				}				
			}
			
			else if($passenger == 2){ //out
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = array_merge($resultList [$spalten[3]], array_map('intval', explode(",", $spalten[5])));
				}else{
					$resultList [$spalten[3]] = array_map('intval', explode(",", $spalten[5]));
				}				
			}
		}
	} 
	fclose($fp); 
	
	$result = [];
	foreach($resultList as $key => $value){
		if($value != 0){
			$station = new \stdClass();
			$station->Bin = $key;
			$station->Haltezeiten = $value;
			array_push($result, $station);
		}
	}
	//Ausgabe 
	echo json_encode($result);	
}

function loadView4($timestep, $selectedTime, $stations, $lines, $passenger){
	global $filefolder;
	
	//Data-files View 4
	$dataView5_Complete = $filefolder."/2017_calendar_complete.csv";
	$dataView5_Months = $filefolder."/2017_calendar_months.csv";
	$dataView5_Weeks = $filefolder."/2017_calendar_weeks.csv";
	
	if($timestep == 0){
		$data = $dataView5_Complete;
	}else if($timestep == 1){
		$data = $dataView5_Months;
		$selectedDay = date('m.Y', strtotime($selectedTime));
	}else if($timestep == 2 || $timestep == 3){	
		$data = $dataView5_Weeks;
		$selectedDay = date('d.m.Y', strtotime($selectedTime));
		$Day2OfWeek = date('d.m.Y', strtotime("+1 day", strtotime($selectedTime)));
		$Day3OfWeek = date('d.m.Y', strtotime("+2 day", strtotime($selectedTime)));
		$Day4OfWeek = date('d.m.Y', strtotime("+3 day", strtotime($selectedTime)));
		$Day5OfWeek =  date('d.m.Y', strtotime("+4 day", strtotime($selectedTime)));
		$Day6OfWeek = date('d.m.Y', strtotime("+5 day", strtotime($selectedTime)));
		$Day7OfWeek = date('d.m.Y', strtotime("+6 day", strtotime($selectedTime)));
	}
	
	$resultList = [];
	$in = 4;
	$out = 5;
	$inAndOut = 6;
	
	$stations = array_map("getAbkStationname",$stations);
	
	$resultList = [];
	
	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 
		$spalten = explode(";", $zeile); 
		
		if($spalten[1] != "Station" && ($timestep == 2 || $timestep == 3)){
			$spalten0 = date('d.m.Y', strtotime($spalten[0]));
		}
		
		//data: [0] Timestamp, [1] Station, [2] Linie, [3] Timeslot, [4] Einsteiger, [5] Aussteiger, [6] Durchschnitt
		if($spalten[1] != "Station" && in_array($spalten[1], $stations) && (in_array($spalten[2],$lines) || count($lines) == 0 || (count($lines) == 1 && $lines[0] == ""))
			&& (( $timestep == 0 && $selectedTime == "") //gesamt
				|| ($timestep == 1 && date('m.Y', strtotime($spalten[0])) == $selectedDay)// monat -> alle wo monat im datum ist
				|| (($timestep == 2 || $timestep == 3) && ($spalten0 == $selectedDay  //weeks -> für ab datum + 7 tage
				|| $spalten0 == $Day2OfWeek
				|| $spalten0 == $Day3OfWeek 
				|| $spalten0 == $Day4OfWeek
				|| $spalten0 == $Day5OfWeek
				|| $spalten0 == $Day6OfWeek
				|| $spalten0 == $Day7OfWeek
			)) //alle für den tag
		)){
			
			if($passenger == 0){ //in + out
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = intval($resultList[$spalten[3]]) + intval($spalten[$inAndOut]);
				}else{
					$resultList [$spalten[3]] = intval($spalten[$inAndOut]);
				}				
			}
			
			else if($passenger == 1){ //in
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = intval($resultList[$spalten[3]]) + intval($spalten[$in]);
				}else{
					$resultList [$spalten[3]] = intval($spalten[$in]);
				}				
			}
			
			else if($passenger == 2){ //out
				if(array_key_exists($spalten[3], $resultList)){
					$resultList [$spalten[3]] = intval($resultList[$spalten[3]]) + intval($spalten[$out]);
				}else{
					$resultList [$spalten[3]] = intval($spalten[$out]);
				}				
			}
		
		}
	} 
	fclose($fp); 
	
	$result = [];
	
	if($timestep != 3){
		foreach($resultList as $key => $value){
			if($value != 0){
				$entry = new \stdClass();
				$entry->Tag = getTag($key);
				$entry->Uhrzeit = getUhrzeit($key);
				$entry->Anzahl = $value;
				array_push($result, $entry);
			}
		}
	}else{
		//nur den Tag 
		$day = date('w', strtotime($selectedTime)); //0 für sonntag, 6 für samstag
		foreach($resultList as $key => $value){
			$tag = getTag($key); //1 Mo -> 7 So
			if($value != 0 && ($day == $tag || ($day == 0 && $tag == 7))){
				$entry = new \stdClass();
				$entry->Tag = $tag; 
				$entry->Uhrzeit = getUhrzeit($key);
				$entry->Anzahl = $value;
				array_push($result, $entry);
			}
		}
	}
	
	//Ausgabe 
	echo json_encode($result);
}

function loadView5($timestep, $selectedTime, $stations, $lines, $passenger, $varianz){
	global $filefolder;
	
	//Data-files View 5
	$dataView5_Complete = $filefolder."/2017_timedetail_complete.csv"; //-> Monate summieren [{Zeitpunkt: 01.11.2017, Anzahl: 2000}, {Zeitpunkt: 01.12.2017, Anzahl: 4000}]
	$dataView5_Days = $filefolder."/2017_timedetail_days.csv"; //-> alle 3 Stunden summieren [{Zeitpunkt: 01.12.2017 00:00, Anzahl: 2000}, {Zeitpunkt: 01.12.2017 03:00, Anzahl: 2000}]
	$dataView5_Months = $filefolder."/2017_timedetail_months.csv"; //-> Wochen summieren [{Zeitpunkt: 01.12.2017, Anzahl: 2000}, {Zeitpunkt: 08.12.2017, Anzahl: 2000}]
	$dataView5_Weeks = $filefolder."/2017_timedetail_weeks.csv"; //-> Tage summieren [{Zeitpunkt: 01.12.2017, Anzahl: 2000}, {Zeitpunkt: 02.12.2017, Anzahl: 2000}]
	
	$timeformat = 'd.m.Y H:i';
	if($timestep == 0){
		$data = $dataView5_Complete;
		$timeformat = 'd.m.Y';
	}else if($timestep == 1){
		$data = $dataView5_Months;
		$timeformat = 'd.m.Y';
		$selectedDay = date('m.Y', strtotime($selectedTime));
	}else if($timestep == 2){	
		$data = $dataView5_Weeks;
		$timeformat = 'd.m.Y';
		$selectedDay = date('d.m.Y', strtotime($selectedTime));
		$Day2OfWeek = date('d.m.Y', strtotime("+1 day", strtotime($selectedTime)));
		$Day3OfWeek = date('d.m.Y', strtotime("+2 day", strtotime($selectedTime)));
		$Day4OfWeek = date('d.m.Y', strtotime("+3 day", strtotime($selectedTime)));
		$Day5OfWeek =  date('d.m.Y', strtotime("+4 day", strtotime($selectedTime)));
		$Day6OfWeek = date('d.m.Y', strtotime("+5 day", strtotime($selectedTime)));
		$Day7OfWeek = date('d.m.Y', strtotime("+6 day", strtotime($selectedTime)));
	}else if($timestep == 3){
		$data = $dataView5_Days;
		$timeformat = 'H:i'; 
	}
	
	//berechne varianz
	$count = 0;
	$sum = 0;
	
	$resultList = [];
	$in = 3;
	$out = 4;
	$inAndOut = 5;
	
	$stations = array_map("getAbkStationname",$stations);
	
	$resultList = [];
	
	$fp = @fopen($data, "r") or die ("Datei nicht lesbar"); 
	while($zeile = fgets($fp)) 
	{ 

		$spalten = explode(";", $zeile); 
		
		if($spalten[1] != "Station" && $timestep == 2){
			$spalten0 = date('d.m.Y', strtotime($spalten[0]));
		}
		
		//data: [0] Timestamp, [1] Station, [2] Linie, [3] Einsteiger, [4] Aussteiger, [5] Durchschnitt
		if($spalten[1] != "Station" && in_array($spalten[1], $stations) && (in_array($spalten[2],$lines) || count($lines) == 0 || (count($lines) == 1 && $lines[0] == ""))
			&& (( $timestep == 0 && $selectedTime == "") //gesamt
				|| ($timestep == 1 && date('m.Y', strtotime($spalten[0])) == $selectedDay)// monat -> alle wo monat im datum ist
				|| ($timestep == 2 && ($spalten0 == $selectedDay  //weeks -> für ab datum + 7 tage
				|| $spalten0 == $Day2OfWeek
				|| $spalten0 == $Day3OfWeek 
				|| $spalten0 == $Day4OfWeek
				|| $spalten0 == $Day5OfWeek
				|| $spalten0 == $Day6OfWeek
				|| $spalten0 == $Day7OfWeek
			)) ||($timestep == 3 && date('d.m.Y', strtotime($spalten[0])) == $selectedTime)) //alle für den tag
		){
			
			
			$timeEntry = date($timeformat, strtotime($spalten[0]));
		
			if($passenger == 0){ //in + out
				if(array_key_exists($timeEntry, $resultList)){
					$resultList [$timeEntry] = intval($resultList[$timeEntry]) + intval($spalten[$inAndOut]);
				}else{
					$resultList [$timeEntry] = intval($spalten[$inAndOut]);
					if($varianz){
						$count = $count +1;
					}
				}	
				if($varianz){
					$sum = $sum + intval($spalten[$inAndOut]);
				}
			}
			
			else if($passenger == 1){ //in
				if(array_key_exists($timeEntry, $resultList)){
					$resultList [$timeEntry] = intval($resultList[$timeEntry]) + intval($spalten[$in]);
				}else{
					$resultList [$timeEntry] = intval($spalten[$in]);
					if($varianz){
						$count = $count +1;
					}
				}		
				if($varianz){
					$sum = $sum + intval($spalten[$in]);
				}				
			}
			
			else if($passenger == 2){ //out
				if(array_key_exists($timeEntry, $resultList)){
					$resultList [$timeEntry] = intval($resultList[$timeEntry]) + intval($spalten[$out]);
				}else{
					$resultList [$timeEntry] = intval($spalten[$out]);
					if($varianz){
						$count = $count +1;
					}
				}	
				if($varianz){
					$sum = $sum + intval($spalten[$out]);
				}				
			}
		
		}
	} 
	fclose($fp); 
	
	$result = [];
	if($varianz){
		$mean = intval($sum / $count);
		foreach($resultList as $key => $value){
			if($value != 0){
				$entry = new \stdClass();
				$entry->Zeitpunkt = $key;
				$entry->Anzahl = intval($value - $mean);
				array_push($result, $entry);
			}
		}
	}else{
		foreach($resultList as $key => $value){
			if($value != 0){
				$entry = new \stdClass();
				$entry->Zeitpunkt = $key;
				$entry->Anzahl = $value;
				array_push($result, $entry);
			}
		}
	}
	//Ausgabe 
	echo json_encode($result);
	
//[{Uhrzeit: 10.00 Uhr, Anzahl: 10}, {Uhrzeit: 11.00 Uhr, Anzahl: 30}, {Uhrzeit: 12.00 Uhr, Anzahl: 20}]
}


//Help-methods

function getTag($key){
	$day = $key[0].$key[1];
	if($day == "Mo"){
		return 1;
	}
	else if($day == "Di"){
		return 2;
	}
	else if($day == "Mi"){
		return 3;
	}
	else if($day == "Do"){
		return 4;
	}
	else if($day == "Fr"){
		return 5;
	}
	else if($day == "Sa"){
		return 6;
	}
	else if($day == "So"){
		return 7;
	}
}

function getUhrzeit($key){
	$uhr = $key[2].$key[3];
	if($uhr == "00"){
		return 1;
	}
	else if($uhr == "01"){
		return 2;
	}
	else if($uhr == "02"){
		return 3;
	}
	else if($uhr == "03"){
		return 4;
	}
	else if($uhr == "04"){
		return 5;
	}
	else if($uhr == "05"){
		return 6;
	}
	else if($uhr == "06"){
		return 7;
	}
	else if($uhr == "07"){
		return 8;
	}
	else if($uhr == "08"){
		return 9;
	}
	else if($uhr == "09"){
		return 10;
	}
	else if($uhr == "10"){
		return 11;
	}
	else if($uhr == "11"){
		return 12;
	}
	else if($uhr == "12"){
		return 13;
	}
	else if($uhr == "13"){
		return 14;
	}
	else if($uhr == "14"){
		return 15;
	}
	else if($uhr == "15"){
		return 16;
	}
	else if($uhr == "16"){
		return 17;
	}
	else if($uhr == "17"){
		return 18;
	}
	else if($uhr == "18"){
		return 19;
	}
	else if($uhr == "19"){
		return 20;
	}
	else if($uhr == "20"){
		return 21;
	}
	else if($uhr == "21"){
		return 22;
	}
	else if($uhr == "22"){
		return 23;
	}
	else if($uhr == "23"){
		return 24;
	}
}

function getCompleteStationname($abk){
	if($abk == "ABG"){
		return "Agathenburg";
	}else if($abk == "AH"){
		return "Aumuehle";
	}else if($abk == "AI"){
		return "Hamburg Airport";
	}else if($abk == "ALH"){
		return "Allermoehe";
	}else if($abk == "AS"){
		return "Hamburg-Altona";
	}else if($abk == "AW"){
		return "Alte Woehr";
	}else if($abk == "B"){
		return "Blankenese";
	}else if($abk == "BAF"){
		return "Bahrenfeld";
	}else if($abk == "BAP"){
		return "Barmbek";
	}else if($abk == "BGS"){
		return "Hamburg-Bergedorf";
	}else if($abk == "BTSL"){
		return "Berliner Tor";
	}else if($abk == "BWM"){
		return "Billwerder-Moorfleet";
	}else if($abk == "BX"){
		return "Buxtehude";
	}else if($abk == "DR"){
		return "Dollern";
	}else if($abk == "DST"){
		return "Dammtor";
	}else if($abk == "DT"){
		return "Diebstreich";
	}else if($abk == "EGS"){
		return "Elbgaustrasse";
	}else if($abk == "EST"){
		return "Eidelstedt";
	}else if($abk == "FB"){
		return "Klein Flottbek";
	}else if($abk == "FBG"){
		return "Friedrichsberg";
	}else if($abk == "FIB"){
		return "Fischbek";
	}else if($abk == "HAB"){
		return "Hammerbrook";
	}else if($abk == "HCH"){
		return "Hoheneichen";
	}else if($abk == "HFS"){
		return "Heimfeld";
	}else if($abk == "HKS"){
		return "Halstenbek";
	}else if($abk == "HOG"){
		return "Horneburg";
	}else if($abk == "HPS"){
		return "Hochkamp";
	}else if($abk == "HRF"){
		return "Harburg Rathaus";
	}else if($abk == "HRS"){
		return "Hamburg-Harburg";
	}else if($abk == "HS"){
		return "Hamburg Hbf";
	}else if($abk == "HSB"){
		return "Hasselbrook";
	}else if($abk == "HST"){
		return "Holstenstrasse";
	}else if($abk == "IS"){
		return "Iserbrook";
	}else if($abk == "JUS"){
		return "Jungfernstieg";
	}else if($abk == "KRS"){
		return "Krupunder";
	}else if($abk == "KS"){
		return "Koenigstrasse";
	}else if($abk == "KWS"){
		return "Kornweg";
	}else if($abk == "LAN"){
		return "Landwehr";
	}else if($abk == "LAS"){
		return "Landungsbruecken";
	}else if($abk == "LST"){
		return "Langenfelde";
	}else if($abk == "ML"){
		return "Mittlerer Landweg";
	}else if($abk == "NL"){	
		return "Neukloster";
	}else if($abk == "NRS"){
		return "Neugraben";
	}else if($abk == "NTB"){
		return "Nettelnburg";
	}else if($abk == "NWF"){
		return "Neu Wulmstorf";
	}else if($abk == "NWS"){
		return "Neuwiedenthal";
	}else if($abk == "OH"){
		return "Othmarschen";
	}else if($abk == "OPS"){
		return "Ohlsdorf";
	}else if($abk == "PB"){
		return "Poppenbuettel";
	}else if($abk == "PS"){
		return "Pinneberg";
	}else if($abk == "RBK"){	
		return "Reinbek";
	}else if($abk == "RES"){
		return "Reeperbahn";
	}else if($abk == "RI"){
		return "Rissen";
	}else if($abk == "ROP"){
		return "Rothenburgsort";
	}else if($abk == "RP"){
		return "Ruebenkamp";
	}else if($abk == "SDF"){
		return "Suelldorf";
	}else if($abk == "SHS"){
		return "Stadthausbruecke";
	}else if($abk == "SST"){
		return "Sternschanze";
	}else if($abk == "ST"){
		return "Stade";
	}else if($abk == "STS"){
		return "Stellingen";
	}else if($abk == "THS"){
		return "Thesdorf";
	}else if($abk == "TK"){
		return "Tiefstack";
	}else if($abk == "VLS"){
		return "Veddel";
	}else if($abk == "WBS"){
		return "Wellingsbuettel";
	}else if($abk == "WCH"){
		return "Wandsbeker Chaussee";
	}else if($abk == "WFS"){
		return "Wilhelmsburg";
	}else if($abk == "WL"){
		return "Wedel";
	}else if($abk == "WLF"){
		return "Wohltorf";
	}else{
		return "";
	}
}

function getAbkStationname($name){
	if($name == "Agathenburg"){
		return "ABG";
	}else if($name == "Aumuehle"){
		return "AH";
	}else if($name == "Hamburg Airport"){
		return "AI";
	}else if($name == "Allermoehe"){
		return "ALH";
	}else if($name == "Hamburg-Altona"){
		return "AS";
	}else if($name == "Alte Woehr"){
		return "AW";
	}else if($name == "Blankenese"){
		return "B";
	}else if($name == "Bahrenfeld"){
		return "BAF";
	}else if($name == "Barmbek"){
		return "BAP";
	}else if($name == "Hamburg-Bergedorf"){
		return "BGS";
	}else if($name == "Berliner Tor"){
		return "BTSL";
	}else if($name == "Billwerder-Moorfleet"){
		return "BWM";
	}else if($name == "Buxtehude"){
		return "BX";
	}else if($name == "Dollern"){
		return "DR";
	}else if($name == "Dammtor"){
		return "DST";
	}else if($name == "Diebstreich"){
		return "DT";
	}else if($name == "Elbgaustrasse"){
		return "EGS";
	}else if($name == "Eidelstedt"){
		return "EST";
	}else if($name == "Klein Flottbek"){
		return "FB";
	}else if($name == "Friedrichsberg"){
		return "FBG";
	}else if($name == "Fischbek"){
		return "FIB";
	}else if($name == "Hammerbrook"){
		return "HAB";
	}else if($name == "Hoheneichen"){
		return "HCH";
	}else if($name == "Heimfeld"){
		return "HFS";
	}else if($name == "Halstenbek"){
		return "HKS";
	}else if($name == "Horneburg"){
		return "HOG";
	}else if($name == "Hochkamp"){
		return "HPS";
	}else if($name == "Harburg Rathaus"){
		return "HRF";
	}else if($name == "Hamburg-Harburg"){
		return "HRS";
	}else if($name == "Hamburg Hbf"){
		return "HS";
	}else if($name == "Hasselbrook"){
		return "HSB";
	}else if($name == "Holstenstrasse"){
		return "HST";
	}else if($name == "Iserbrook"){
		return "IS";
	}else if($name == "Jungfernstieg"){
		return "JUS";
	}else if($name == "Krupunder"){
		return "KRS";
	}else if($name == "Koenigstrasse"){
		return "KS";
	}else if($name == "Kornweg"){
		return "KWS";
	}else if($name == "Landwehr"){
		return "LAN";
	}else if($name == "Landungsbruecken"){
		return "LAS";
	}else if($name == "Langenfelde"){
		return "LST";
	}else if($name == "Mittlerer Landweg"){
		return "ML";
	}else if($name == "Neukloster"){	
		return "NL";
	}else if($name == "Neugraben"){
		return "NRS";
	}else if($name == "Nettelnburg"){
		return "NTB";
	}else if($name == "Neu Wulmstorf"){
		return "NWF";
	}else if($name == "Neuwiedenthal"){
		return "NWS";
	}else if($name == "Othmarschen"){
		return "OH";
	}else if($name == "Ohlsdorf"){
		return "OPS";
	}else if($name == "Poppenbuettel"){
		return "PB";
	}else if($name == "Pinneberg"){
		return "PS";
	}else if($name == "Reinbek"){	
		return "RBK";
	}else if($name == "Reeperbahn"){
		return "RES";
	}else if($name == "Rissen"){
		return "RI";
	}else if($name == "Rothenburgsort"){
		return "ROP";
	}else if($name == "Ruebenkamp"){
		return "RP";
	}else if($name == "Suelldorf"){
		return "SDF";
	}else if($name == "Stadthausbruecke"){
		return "SHS";
	}else if($name == "Sternschanze"){
		return "SST";
	}else if($name == "Stade"){
		return "ST";
	}else if($name == "Stellingen"){
		return "STS";
	}else if($name == "Thesdorf"){
		return "THS";
	}else if($name == "Tiefstack"){
		return "TK";
	}else if($name == "Veddel"){
		return "VLS";
	}else if($name == "Wellingsbuettel"){
		return "WBS";
	}else if($name == "Wandsbeker Chaussee"){
		return "WCH";
	}else if($name == "Wilhelmsburg"){
		return "WFS";
	}else if($name == "Wedel"){
		return "WL";
	}else if($name == "Wohltorf"){
		return "WLF";
	}else{
		return "";
	}
}

?>