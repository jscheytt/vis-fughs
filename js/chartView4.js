var margin4 = { top: 20, right: 20, bottom: 0, left: 40 },
	width4 = 350 - margin4.left - margin4.right,
	height4 = 180 - margin4.top - margin4.bottom,
	gridSizeWidth = Math.floor(width4 / 7),
	gridSizeHeight = Math.floor(height4 / 24),
	legendElementWidth = gridSizeWidth/2,
	buckets = 9,
	// colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'], // alternatively colorbrewer.YlGnBu[9]
	// colors = ['#ffffff','#ffebeb','#ffd8d8','#ffc4c4','#ffb1b1','#ff9d9d','#ff8989','#ff7676','#ff6262','#ff4e4e','#ff3b3b','#ff2727','#ff1414'], // alternatively colorbrewer.YlGnBu[9]
	// colors = ['#ff3800','#f53e0a','#eb4314','#e2491d','#d84e27','#ce5431','#c4593b','#ba5f45','#b1644e','#a76a58','#9d6f62','#93756c','#897a76'], // alternatively colorbrewer.YlGnBu[9]
	// colors = ['#ff7800','#ff6300','#ff4d00','#ff3800','#ff2300','#ff0e00','#ff0008'], // alternatively colorbrewer.YlGnBu[9]
	colors = ['#15ff00','#88ff4c', '#aaff00','#d2ff4d','#ffff00','#ffaa00','#ff5500','#ff0000', '#b30000'], // alternatively colorbrewer.YlGnBu[9]
	// colors = ['#0000ff','#2a00ff','#5500ff','#8000ff','#aa00ff','#d500ff','#ff00ff','#ff00d5','#ff00aa','#ff0080','#ff0055','#ff002b','#ff0000'], // alternatively colorbrewer.YlGnBu[9]
	days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
	times = ['', '2 Uhr', '', '', '', '6 Uhr', '', '', '', '10 Uhr', '', '', '', '14 Uhr', '', '', '', '18 Uhr', '', '', '', '22 Uhr', '', ''],
	ranges = [];

function showView4(data){
	//clear region for chart
	var regionChart = document.getElementById("heatmap");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	
	var svg = d3.select('#heatmap').append('svg')
		.attr('width', width4 + margin4.left + margin4.right)
		.attr('height', height4 + margin4.top + margin4.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin4.left + ',' + margin4.top + ')');
	
	svg.selectAll('.timeLabel')
		.data(times)
		.enter().append('text')
		.text(function (d) { return d; })
		.attr('x', 0)
		.attr('y', function (d, i) { return i * gridSizeHeight; })
		.style('text-anchor', 'end')
		.attr('transform', 'translate(-6,' + gridSizeHeight / 1.5 + ')')
		.attr('class', function (d, i) { return ((i >= 0 && i <= 4) ? 'timeLabel mono axis axis-workweek' : 'timeLabel mono axis'); })
		.attr('id', function (d) { return d; });
	
	svg.selectAll('.dayLabel')
		.data(days)
		.enter().append('text')
		.text(function(d) { return d; })
		.attr('x', function(d, i) { return i * gridSizeWidth; })
		.attr('y', 0)
		.style('text-anchor', 'middle')
		.attr('transform', 'translate(' + gridSizeWidth / 2 + ', -6)')
		.attr('class', function(d, i) { return ((i >= 7 && i <= 16) ? 'dayLabel mono axis axis-worktime' : 'dayLabel mono axis'); });

	generateView4(svg, data);
}

function generateView4 (svg, data) {
	var maxData = d3.max(data, function(e) {return e.Anzahl;});
	var values = data.map(function(obj) {return obj.Anzahl;}); 
	
	var colorScale = function (f) {
		if(f <= ranges[1]){
			return colors[0];
		}else if(f <= ranges[2]){
			return colors[1];
		}else if(f <= ranges[3]){
			return colors[2];
		}else if(f <= ranges[4]){
			return colors[3];
		}else if(f <= ranges[5]){
			return colors[4];
		}else if(f <= ranges[6]){
			return colors[5];
		}else if(f <= ranges[7]){
			return colors[6];
		}else if(f <= ranges[8]){
			return colors[7];
		}else {
			return colors[8];
		}
	};
				
	var step = maxData / 9;
	ranges = [0, step, 2*step, 3* step, 4*step, 5*step, 6*step, 7* step, 8*step];
				
	var cards = svg.selectAll('.day')
		.data(data, function(d) {return d.Uhrzeit+':'+d.Tag;});
	
	cards.append('title');
	
	cards.enter().append('rect')
		.attr('x', function(d) { return (d.Tag - 1) * gridSizeWidth; })
		.attr('y', function(d) { return (d.Uhrzeit - 1) * gridSizeHeight; })
		.attr('class', 'hour bordered')
		.attr('width', gridSizeWidth)
		.attr('height', gridSizeHeight)
		.style('fill', function(d) { return colorScale(d.Anzahl);})
		.text(function(d) { return d.Anzahl; });
	
	
	cards.exit().remove();
	
	var legend = svg.selectAll('.legend')
		.data(ranges, function(d) { return d; });
	
	//legend x-axis
	var g = legend.enter().append('g')
		.attr('class', 'legend');
		g.append('rect')
		.attr('x', function(d, i) { return legendElementWidth * i; })
		.attr('y', height4 -4)
		.attr('width', legendElementWidth)
		.attr('height', 4)
		.style('fill', function(d, i) {  return colors[i]; })
		
		g.append('text')
		.attr('class', 'mono')
		.text(function(g) { 
		if(g== 0){ return '≥ 0';} 
		else if(g == step*2){ return '≥ ' + Math.round(2*step); } 
		else if(g ==  step*4){ return '≥ ' + Math.round(4*step);} 
		else if(g == step*6){  return '≥ ' + Math.round(6*step);} 
		else if(g == step*8){return '≥ ' + Math.round(8*step);} 
		return ""; })
		.attr('x', function(d, i) { return legendElementWidth * i; })
		.attr('y', height4 + gridSizeHeight -11);
	
	legend.exit().remove();
	};