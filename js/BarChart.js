// set the dimensions and margin1s of the graph
var margin1 = {top: 20, right: 20, bottom: 30, left: 20},
    width1 = 700 - margin1.left - margin1.right,
    height1 = 120 - margin1.top - margin1.bottom;

// set the ranges
var x1 = d3.scaleBand()
          .range([0, width1])
          .padding(0.1);
var y1 = d3.scaleLinear()
          .range([height1, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin1
var svg1 = d3.select("#barchart").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin1.left + "," + margin1.top + ")");

// get the data
d3.csv("data/BarChart_w.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.passenger = +d.passenger;
  });

  // Scale the range of the data in the domains
  x1.domain(data.map(function(d) { return d.time; }));
  y1.domain([0, d3.max(data, function(d) { return d.passenger; })]);

  // append the rectangles for the bar chart
  svg1.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x1(d.time); })
      .attr("width", x1.bandwidth())
      .attr("y", function(d) { return y1(d.passenger); })
      .attr("height", function(d) { return height1 - y1(d.passenger); });

  // add the x Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height1 + ")")
      .call(d3.axisBottom(x1));

  // add the y Axis
  svg1.append("g")
      .call(d3.axisLeft(y1));

});