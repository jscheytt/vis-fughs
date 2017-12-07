# vis-fughs
Visualisierung WS1718 Team FUGHS

## IDs der Map-Elemente zur Änderung bei Click
* Linien: `line_SX` -> X entsprechende Nummer der Linie
* Linien-Label: `label_SX` -> X entsprechende Nummer der Linie
* Stationen-Label: `label_X`
* Stationen: `Name der Station` -> X entsprechender Name der Station
* Bobbel über Station: `bobbel_X` -> X entsprechender Name der Station

## OnClick-Events
* Linien-Label -> `selectLine(this.id)`
* Station -> `selectStation(this.id)`

## Hover-Events 
* Bobbel
  * `onmousemove="showTooltip(evt, this.id)"`
  * `onmouseout="hideTooltip()"`

## Liste der Stationsnamen
Station lang | Station kurz | Stations-ID
--- | --- | ---
Aumühle | AH | *Aumuehle*
Wohltorf | WLF | Wohltorf
Reinbek | RBK | Reinbek
Bergedorf | BGS | *Hamburg-Bergedorf*
Nettelnburg | NTB | Nettelnburg
Allermöhe | ALH | *Allermoehe*
Mittlerer Landweg | ML | Mittlerer Landweg
Billwerder-Moorfleet | BWM | Billwerder-Moorfleet
Tiefstack | TK | Tiefstack
Rothenburgsort | ROP | Rothenburgsort
Berliner Tor 2 **(wurde überschrieben mit Berliner Tor 1)** | BTSB | *Berliner Tor*
Hauptbahnhof | HS | *Hamburg Hbf*
Dammtor | DST | Dammtor
Sternschanze | SST | Sternschanze
Holstenstraße | HST | *Holstenstrasse*
Diebsteich | DT | *Diebstreich*
Langenfelde | LST | Langenfelde
Stellingen | STS | Stellingen
Eidelstedt | EST | Eidelstedt
Elbgaustraße | EGS | *Elbgaustrasse*
Wedel | WL | Wedel
Rissen | RI | Rissen
Sülldorf | SDF | Suelldorf
Iserbrook | IS | Iserbrook
Blankenese | B | Blankenese
Hochkamp | HPS | Hochkamp
Klein Flottbek | FB | Klein Flottbek
Othmarschen | OH | Othmarschen
Bahrenfeld | BAF | Bahrenfeld
Altona | AS | *Hamburg-Altona*
Königstraße | KS | *Koenigstrasse*
Reeperbahn | RES | Reeperbahn
Landungsbrücken | LAS | *Landungsbruecken*
Stadthausbrücke | SHS | *Stadthausbruecke*
Jungfernstieg | JUS | Jungfernstieg
Berliner Tor 1 | BTSL | *Berliner Tor*
Landwehr | LAN | Landwehr
Hasselbrook | HSB | Hasselbrook
Wandsbeker Chaussee | WCH | Wandsbeker Chaussee
Friedrichsberg | FBG | Friedrichsberg
Barmbek | BAP | Barmbek
Alte Wöhr | AW | *Alte Woehr*
Rübenkamp | RP | *Ruebenkamp*
Ohlsdorf | OPS | Ohlsdorf
Airport | AI | *Hamburg Airport*
Kornweg | KWS | Kornweg
Hoheneichen | HCH | Hoheneichen
Wellingsbüttel | WBS | *Wellingsbuettel*
Poppenbüttel | PB | *Poppenbuettel*
Hammerbrook | HAB | Hammerbrook
Veddel | VLS | Veddel
Wilhelmsburg | WFS | Wilhelmsburg
Harburg | HRS | *Hamburg-Harburg*
Harburg-Rathaus | HRF | *Harburg Rathaus*
Neugraben | NRS | Neugraben
Neuwiedenthal | NWS | Neuwiedenthal
Heimfeld | HFS | Heimfeld
Buxtehude | BX | Buxtehude
Neu Wulmstorf | NWF | Neu Wulmstorf
Fischbek | FIB | Fischbek
Krupunder | KRS | Krupunder
Halstenbek | HKS | Halstenbek
Thesdorf | THS | Thesdorf
Pinneberg | PS | Pinneberg
Neukloster | NL | Neukloster
Horneburg | HOG | Horneburg
Dollern | DR | Dollern
Agathenburg | ABG | Agathenburg
Stade | ST | Stade

# Format der Daten

## Für #2 Timeline
Timestamp | Einsteiger | Aussteiger | Avg | AbwEin | AbwAus | AbwAvg
--- | --- | --- | --- | --- | --- | ---
2016-12-31 | 123 | 321 | 222 | -27 | 171 | 72

Es gibt insgesamt 4 Files für den Gesamtzeitraum, die Monate, die Wochen und die Tage. Der Timestamp ist für den **Gesamtzeitraum** ```0```, für **Monate** ```YYYY-MM-01```, für **Wochen** ```YYYY-MM-[Montag der Woche, 1-31]``` und für **Tage** ```YYYY-MM-DD```. _Avg_ ist ```(Einsteiger + Aussteiger) / 2```, _AbwEin_ ist ```Einsteiger - Mittelwert(Einsteiger_[Rasterung])```, _AbwAus_ ist ```Aussteiger - Mittelwert(Aussteiger_[Rasterung])``` und _AbwAvg_ ist ```Avg - Mittelwert(Avg_[Rasterung])```.

## Für #1 Map und #9 Zoom
Timestamp | Station | Linie | Einsteiger | Aussteiger | Avg
--- | --- | --- | --- | --- | ---
2016-12-31 | [68] | [6] | 123 | 321 | 222

Es gibt insgesamt 4 Files mit Timestamps analog zu #2. Zahlen in [eckigen Klammern] zeigen an, wie viele kategorische Werte pro Timestamp angenommen werden. Die Anzahl an Zeilen pro Timestamp ist das Produkt aller Zahlen in Klammern, also hier z. B. ```68 * 6 = 408```.

## Für #3 Duration
Timestamp | Station | Linie | Bin | EinsteigerHaltezeiten | AussteigerHaltezeiten | AvgHaltezeiten
--- | --- | --- | --- | --- | --- | ---
2016-12-31 | [68] | [6] | [7] | 10,10,11,23,... | s. vorherige Spalte | s. vorherige Spalte

Es gibt insgesamt 4 Files mit Timestamps analog zu #2. Jede _Haltezeiten_-Spalte ist eine komma-separarierte Liste von Werten (in Sekunden). Bei einer Zusammenfassung mehrerer _Haltezeiten_-Listen (z. B. Bin #4 der _EinsteigerHaltezeiten_ aller Stationen und aller Linien) werden die Listen aneinandergehängt.

## Für #4 Calendar
Timestamp | Station | Linie | Zeitslot | Einsteiger | Aussteiger | Avg
--- | --- | --- | --- | --- | --- | ---
2016-12-31 | [68] | [6] | [168, z. B. ```Fr11```] | 123 | 321 | 222

Es gibt insgesamt 3 Files für den Gesamtzeitraum, die Monate und die Wochen. Die Timestamps sind analog zu denen von #2. Das Format der Zeitslots ist ```[erste 2 Buchstaben Wochentag][Startuhrzeit des Intervalls]```. Bspw. entspricht ```Sa00``` dem Intervall "Samstag von 0 bis 1 Uhr".

## Für #5 TimeDetail
Timestamp | Station | Linie | Einsteiger | Aussteiger | Avg | AbwEin | AbwAus | AbwAvg
--- | --- | --- | --- | --- | --- | --- | --- | ---
2016-12-31 03:00 | [68] | [6] | 123 | 321 | 222 | -27 | 171 | 72

Es gibt insgesamt 4 Files analog zu #2. Die Aufteilung ist wie folgt:

Rasterungsbezug des Files | Genauigkeit | Timestamp
--- | --- | ---
Gesamtzeitraum | auf Wochen | ```YYYY-MM-[Montag der Woche, 1-31]```
Monate | auf Tage | ```YYYY-MM-DD```
Wochen | auf 6 Stunden | ```YYYY-MM-DD [Anfang des Intervalls, z. B. 06]:00```
Tage | auf Stunden | ```YYYY-MM-DD HH:00```
