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
	data = dataP;
	
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
				.domain([0, buckets - 1, d3.max(data, function(d) {return d.value})])
				.range(colors);
				
	var cards = svg.selectAll('.day')
		.data(data, function(d) {return d.hour+':'+d.day;});
	
	cards.append('title');
	
	cards.enter().append('rect')
		.attr('x', function(d) { return (d.day - 1) * gridSizeWidth; })
		.attr('y', function(d) { return (d.hour - 1) * gridSizeHeight; })
		.attr('class', 'hour bordered')
		.attr('width', gridSizeWidth)
		.attr('height', gridSizeHeight)
		.style('fill', function(d) { return colorScale(d.value);})
		.text(function(d) { return d.value; });
	
	
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


var dataP = [{"day":1,"hour":1,"value":"30"},{"day":1,"hour":2,"value":"47"},{"day":1,"hour":3,"value":"1"},{"day":1,"hour":4,"value":"32"},{"day":1,"hour":5,"value":"65"},{"day":1,"hour":6,"value":"70"},{"day":1,"hour":7,"value":"66"},{"day":1,"hour":8,"value":"97"},{"day":1,"hour":9,"value":"93"},{"day":1,"hour":10,"value":"61"},{"day":1,"hour":11,"value":"18"},{"day":1,"hour":12,"value":"9"},{"day":1,"hour":13,"value":"82"},{"day":1,"hour":14,"value":"69"},{"day":1,"hour":15,"value":"21"},{"day":1,"hour":16,"value":"59"},{"day":1,"hour":17,"value":"6"},{"day":1,"hour":18,"value":"70"},{"day":1,"hour":19,"value":"11"},{"day":1,"hour":20,"value":"51"},{"day":1,"hour":21,"value":"16"},{"day":1,"hour":22,"value":"59"},{"day":1,"hour":23,"value":"69"},{"day":1,"hour":24,"value":"24"},{"day":2,"hour":1,"value":"83"},{"day":2,"hour":2,"value":"56"},{"day":2,"hour":3,"value":"26"},{"day":2,"hour":4,"value":"18"},{"day":2,"hour":5,"value":"56"},{"day":2,"hour":6,"value":"73"},{"day":2,"hour":7,"value":"57"},{"day":2,"hour":8,"value":"54"},{"day":2,"hour":9,"value":"35"},{"day":2,"hour":10,"value":"66"},{"day":2,"hour":11,"value":"14"},{"day":2,"hour":12,"value":"98"},{"day":2,"hour":13,"value":"67"},{"day":2,"hour":14,"value":"16"},{"day":2,"hour":15,"value":"49"},{"day":2,"hour":16,"value":"54"},{"day":2,"hour":17,"value":"93"},{"day":2,"hour":18,"value":"9"},{"day":2,"hour":19,"value":"26"},{"day":2,"hour":20,"value":"3"},{"day":2,"hour":21,"value":"62"},{"day":2,"hour":22,"value":"82"},{"day":2,"hour":23,"value":"13"},{"day":2,"hour":24,"value":"81"},{"day":3,"hour":1,"value":"43"},{"day":3,"hour":2,"value":"15"},{"day":3,"hour":3,"value":"45"},{"day":3,"hour":4,"value":"31"},{"day":3,"hour":5,"value":"96"},{"day":3,"hour":6,"value":"49"},{"day":3,"hour":7,"value":"35"},{"day":3,"hour":8,"value":"95"},{"day":3,"hour":9,"value":"45"},{"day":3,"hour":10,"value":"58"},{"day":3,"hour":11,"value":"100"},{"day":3,"hour":12,"value":"28"},{"day":3,"hour":13,"value":"52"},{"day":3,"hour":14,"value":"65"},{"day":3,"hour":15,"value":"93"},{"day":3,"hour":16,"value":"30"},{"day":3,"hour":17,"value":"23"},{"day":3,"hour":18,"value":"72"},{"day":3,"hour":19,"value":"75"},{"day":3,"hour":20,"value":"2"},{"day":3,"hour":21,"value":"89"},{"day":3,"hour":22,"value":"85"},{"day":3,"hour":23,"value":"34"},{"day":3,"hour":24,"value":"34"},{"day":4,"hour":1,"value":"50"},{"day":4,"hour":2,"value":"96"},{"day":4,"hour":3,"value":"43"},{"day":4,"hour":4,"value":"91"},{"day":4,"hour":5,"value":"8"},{"day":4,"hour":6,"value":"39"},{"day":4,"hour":7,"value":"57"},{"day":4,"hour":8,"value":"23"},{"day":4,"hour":9,"value":"94"},{"day":4,"hour":10,"value":"79"},{"day":4,"hour":11,"value":"80"},{"day":4,"hour":12,"value":"1"},{"day":4,"hour":13,"value":"33"},{"day":4,"hour":14,"value":"60"},{"day":4,"hour":15,"value":"81"},{"day":4,"hour":16,"value":"32"},{"day":4,"hour":17,"value":"60"},{"day":4,"hour":18,"value":"20"},{"day":4,"hour":19,"value":"17"},{"day":4,"hour":20,"value":"69"},{"day":4,"hour":21,"value":"98"},{"day":4,"hour":22,"value":"52"},{"day":4,"hour":23,"value":"97"},{"day":4,"hour":24,"value":"23"},{"day":5,"hour":1,"value":"17"},{"day":5,"hour":2,"value":"75"},{"day":5,"hour":3,"value":"19"},{"day":5,"hour":4,"value":"90"},{"day":5,"hour":5,"value":"87"},{"day":5,"hour":6,"value":"84"},{"day":5,"hour":7,"value":"35"},{"day":5,"hour":8,"value":"91"},{"day":5,"hour":9,"value":"28"},{"day":5,"hour":10,"value":"83"},{"day":5,"hour":11,"value":"53"},{"day":5,"hour":12,"value":"95"},{"day":5,"hour":13,"value":"59"},{"day":5,"hour":14,"value":"83"},{"day":5,"hour":15,"value":"38"},{"day":5,"hour":16,"value":"5"},{"day":5,"hour":17,"value":"1"},{"day":5,"hour":18,"value":"62"},{"day":5,"hour":19,"value":"63"},{"day":5,"hour":20,"value":"56"},{"day":5,"hour":21,"value":"55"},{"day":5,"hour":22,"value":"36"},{"day":5,"hour":23,"value":"79"},{"day":5,"hour":24,"value":"11"},{"day":6,"hour":1,"value":"81"},{"day":6,"hour":2,"value":"26"},{"day":6,"hour":3,"value":"52"},{"day":6,"hour":4,"value":"90"},{"day":6,"hour":5,"value":"25"},{"day":6,"hour":6,"value":"60"},{"day":6,"hour":7,"value":"39"},{"day":6,"hour":8,"value":"95"},{"day":6,"hour":9,"value":"74"},{"day":6,"hour":10,"value":"94"},{"day":6,"hour":11,"value":"93"},{"day":6,"hour":12,"value":"33"},{"day":6,"hour":13,"value":"88"},{"day":6,"hour":14,"value":"52"},{"day":6,"hour":15,"value":"47"},{"day":6,"hour":16,"value":"32"},{"day":6,"hour":17,"value":"72"},{"day":6,"hour":18,"value":"27"},{"day":6,"hour":19,"value":"99"},{"day":6,"hour":20,"value":"59"},{"day":6,"hour":21,"value":"97"},{"day":6,"hour":22,"value":"76"},{"day":6,"hour":23,"value":"67"},{"day":6,"hour":24,"value":"83"},{"day":7,"hour":1,"value":"80"},{"day":7,"hour":2,"value":"68"},{"day":7,"hour":3,"value":"32"},{"day":7,"hour":4,"value":"59"},{"day":7,"hour":5,"value":"18"},{"day":7,"hour":6,"value":"89"},{"day":7,"hour":7,"value":"34"},{"day":7,"hour":8,"value":"89"},{"day":7,"hour":9,"value":"15"},{"day":7,"hour":10,"value":"51"},{"day":7,"hour":11,"value":"92"},{"day":7,"hour":12,"value":"34"},{"day":7,"hour":13,"value":"55"},{"day":7,"hour":14,"value":"70"},{"day":7,"hour":15,"value":"1"},{"day":7,"hour":16,"value":"61"},{"day":7,"hour":17,"value":"83"},{"day":7,"hour":18,"value":"93"},{"day":7,"hour":19,"value":"22"},{"day":7,"hour":20,"value":"47"},{"day":7,"hour":21,"value":"96"},{"day":7,"hour":22,"value":"86"},{"day":7,"hour":23,"value":"61"},{"day":7,"hour":24,"value":"5"}]