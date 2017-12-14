var margin = { top: 20, right: 20, bottom: 0, left: 40 },
	width = 350 - margin.left - margin.right,
	height = 180 - margin.top - margin.bottom,
	gridSizeWidth = Math.floor(width / 7),
	gridSizeHeight = Math.floor(height / 24),
	legendElementWidth = gridSizeWidth/2,
	buckets = 9,
	colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'], // alternatively colorbrewer.YlGnBu[9]
	days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
	times = ['', '2 Uhr', '', '', '', '6 Uhr', '', '', '', '10 Uhr', '', '', '', '14 Uhr', '', '', '', '18 Uhr', '', '', '', '22 Uhr', '', ''];

function showView4(data){
	//clear region for chart
	var regionChart = document.getElementById("heatmap");
	if(regionChart != null){
		regionChart.innerHTML = "";
	}
	
	
	var svg = d3.select('#heatmap').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
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
	var colorScale = d3.scaleQuantile()
				.domain([0, buckets - 1, d3.max(data, function(d) {return d.Anzahl})])
				.range(colors);
				
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
		.data([0].concat(colorScale.quantiles()), function(d) { return d; });
	
	var g = legend.enter().append('g')
		.attr('class', 'legend');
		g.append('rect')
		.attr('x', function(d, i) { return legendElementWidth * i; })
		.attr('y', height -4)
		.attr('width', legendElementWidth)
		.attr('height', 4)
		.style('fill', function(d, i) { return colors[i]; })
		
		g.append('text')
		.attr('class', 'mono')
		.text(function(d) { return '≥ ' + Math.round(d); })
		.attr('x', function(d, i) { return legendElementWidth * i; })
		.attr('y', height + gridSizeHeight -11);
	
	legend.exit().remove();
	};