// this file contains functions to draw the sea level vizualization at the bottom of the page
const drawFloodChart = () => {
  let margin = {
    top: 75,
    left: 75,
    right: 250,
    bottom: 75
  },
  width = 1400 - margin.left - margin.right;
  height = 1100 - margin.top - margin.bottom;

  // svg canvas for all visualizations appearing in this portion of the site
  const svg = d3.select("#vis-svg-5")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);


  // make paths look drawn on page
  const pathTransition = pathId => {
  // select path by id
  const path = d3.select(pathId);

  // determine length of path
  const pathLength = path.node().getTotalLength();

  // use default or given transition
  const transitionPath = d3.transition()
    .delay(500)
    .ease(d3.easeSin)
    .duration(2500);

  // use transition, path length and stroke-dash attributes to
  // make path appear as though it is being drawn
  path
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);
  }

  d3.csv("data/projected_sea_rise.csv",
  function(d){
    return { 
      year : d3.timeParse("%Y")(d.year), 
      intermediate : d.intermediate,
      high: d.high,
      city: d.city
    }
  }).then( 
    function(data) {
      // x-scale
      const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);

      // x-axis
      svg.append("g")
        .attr('stroke-width', 2.5)
        .style("font-size",24)
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
      
      // x-axis label
      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year")
        .style("font-size",28);

      // y-scale
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.high; }) + 10])
        .range([ height, 0 ]);

      // y-axis
      svg.append("g")
        .style("font-size",24)
        .attr('stroke-width', 2.5)
        .call(d3.axisLeft(y));
      
      // y-axis label
      svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 6)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Inches of Sea Level Rise")
          .style("font-size",28);

      // chart title
      svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -16)
        .text("Future Sea Level Rise in Boston")
        .style("font-size",32)
        .style("text-anchor", "middle");

      // legend 
      svg.append("circle")
        .attr("cx",1155)
        .attr("cy",30)
        .attr("r", 8)
        .style("fill", "#cf1111")
        .attr('id', 'highCirc');
      svg.append("circle")
        .attr("cx",1155)
        .attr("cy",55)
        .attr("r", 8)
        .style("fill", "#FF8C00")
        .attr('id', 'intCirc');
      svg.append("text")
        .attr("x", 1175)
        .attr("y", 30)
        .text("High")
        .style("font-size", 26)
        .attr("alignment-baseline","middle")
        .attr('id', 'highLabel');
      svg.append("text")
        .attr("x", 1175)
        .attr("y", 55)
        .text("Intermediate")
        .style("font-size", 26)
        .attr("alignment-baseline","middle")
        .attr('id', 'intLabel');


      svg.append("text")
        .attr("x", 1085)
        .attr("y", 707)
        .text("Development Code")
        .style("font-size", 26)
        .attr("alignment-baseline","middle")
        .attr('id', 'intLabel');

      // path for city code of development
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#FFBF00')
        .attr("stroke-width", 2.5)
        .attr("stroke-dasharray", 5)
        .attr("d", d3.line()
          .x(function(d) {return x(d.year)})
          .y(function(d) {return y(d.city)})
        );

      // path for high estimate data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#cf1111')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) {return x(d.year)})
          .y(function(d) {return y(d.high)})
        )
        .attr('id', 'highPath');

      // path for intermediate estimate data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#FF8C00')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) {return x(d.year)})
          .y(function(d) {return y(d.intermediate)})
        )
        .attr('id', 'intPath');
      
      // draw paths
      pathTransition('#highPath');
      pathTransition('#intPath');
    }
  )
}

// scrolls to and draws chart 
const showFuture = () => {
  document.getElementById('future-chart').scrollIntoView();
  drawFloodChart();
}