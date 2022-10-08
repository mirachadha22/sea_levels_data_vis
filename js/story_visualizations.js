// created some global variables in this file to eliminate code repetition across functions
// multiple functions so multiple visualizations can be shown on the same SVG canvas using
// CSS

// boolean variable: is the precipitation storyline being shown?
let precipitation = false;

// function to change precipitation boolean variablle
const setPrecipitation = val => {
  precipitation = val;
}

// boolean variable: has the flooding storyline
// already been shown? (helps with transition
// between storylines)
let alreadyShown = false;

// sets alreadyShown to given val
const setAlreadyShown = val => {
  alreadyShown = val;
}

// variable tracks the current slide for the flood storyline
let floodSlide = 1;

// function to change floodSlide variablle
const setFloodSlide = val => {
  floodSlide = val;
}

// variable tracks the current slide for the precipitation storyline
let precSlide = 1;

// function to change precSlide variablle
const setPrecSlide = val => {
  precSlide = val;
}

// function to switch the storyline from prec to flood or vice versa
// takes a boolean variable representing whether or not switching to
// precipitation storyline
const switchStory = prec => {
  // set precipitation global variable to passed in variable
  setPrecipitation(prec);
  // if precipitation is true, show all precipitation elements
  // and hide all flooding elements
  // scroll to precipitation storyline
  if (precipitation) {
    document.getElementById('prec-text').className = 'storyboard-section';
    document.getElementById('prec-content').className = 'storyboard-section';
    document.getElementById('flooding-text').className = 'hidden';
    document.getElementById('flooding-content').className = 'hidden';
    document.getElementById('prec-text').scrollIntoView();
  }
  // if precipitation is false, show all flooding elements
  // and hide all precipitation elements
  // scroll to flooding storyline
  else {
    document.getElementById('prec-text').className = 'hidden';
    document.getElementById('prec-content').className = 'hidden';
    document.getElementById('flooding-text').className = 'storyboard-section';
    document.getElementById('flooding-content').className = 'storyboard-section';
    document.getElementById('flooding-text').scrollIntoView();
  }
}

// scrolls back to whichever storyline is currently being shown
// when user clicks back button from transition text
const backToStory = () => {
  if (precipitation) {
    document.getElementById('prec-content').scrollIntoView();
  }
  else {
    document.getElementById('flooding-content').scrollIntoView();
  }
}

// fucntion to show/scroll to precipitation graph and captions
// when user clicks next button from precipitation text
const showPrecipitation = () => {
  // set precipitation slide to 1 in case it isn't already
  setPrecSlide(1);
  document.getElementById('prec-content').scrollIntoView();
  // make bars appear on chart
  drawPrecipitationChart();
}

// fucntion to show/scroll to flooding graph and captions
// when user clicks next button from flooding text
const showFlooding = () => {
  // set flooding slide to 1
  setFloodSlide(1);
  document.getElementById('flooding-content').scrollIntoView();
  // shown first flood slide, which might be hidden
  document.getElementById('flood-slide-1').className = '';
  // draw first set of lines on chart
  drawChart();

  // if storyline has already been shown, remove whatever is
  // on the chart now
  if (alreadyShown) {
    thirdFloodBackClick(true);
  }
}

// dimensions for flooding SVG canvas
let margin = {
  top: 60,
  left: 100,
  right: 200,
  bottom: 35
},
width = 1100 - margin.left - margin.right;
height = 1260 - margin.top - margin.bottom;

// dimensions for precipitation SVG canvas
let margin2 = {
  top: 75,
  left: 80,
  right: 80,
  bottom: 85
};
width2 = 1100 - margin2.left - margin2.right;
height2 = 1260 - margin2.top - margin2.bottom;

// svg canvas for flooding visualization
const svg = d3.select("#vis-svg-3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// svg canvas for precipitation visualization
const svg2 = d3.select('#vis-svg-4')
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",`translate(${margin2.left},${margin2.top})`);

// x-axis for the first two flooding slides
// domain/range so that data can appear in chunks
// x-scale based on decade data
const x = d3.scaleTime()
  .domain([d3.timeParse("%Y")(1920), d3.timeParse("%Y")(2010)])
  .range([ 0, width ]);

// line/ticks for first two slides x-axis
svg.append("g")
  .style("font-size",24)
  .attr("stroke-width", 2.5)
  .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .attr('id', 'xaxis');

// label for first two slides x-axis
svg.append("text")
  .attr("class", "xlabel")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("Decade")
  .style("font-size",28)
  .attr('id', 'xlabel');

// y-axis for first two flood slides
// domain/range set for whole dataset so that data can appear in chunks
// y-scale based on number of flood days
const y = d3.scaleLinear()
  .domain([0, 160])
  .range([ height, 0 ]);

// line/ticks for first two sllides y-axis
svg.append("g")
  .attr("stroke-width", 2.5)
  .style("font-size",24)
  .call(d3.axisLeft(y))
  .attr('id', 'yaxis');

// label for first two slides y-axis
svg.append("text")
  .attr("class", "ylabel")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Number of High-Tide Flood Days")
  .style("font-size",28)
  .attr('id', 'ylabel');

// title for first two slides vis
svg.append("text")
  .attr("x", width / 2 )
  .attr("y", -16)
  .text("Past High-Tide Flooding")
  .style("font-size",32)
  .style("text-anchor", "middle")
  .attr('id', 'title1');

// legend for first visualization
svg.append("circle")
  .attr("cx",825)
  .attr("cy",30)
  .attr("r", 8)
  .style("fill", "#ff6961")
  .attr('id', 'bostonCirc');
svg.append("circle")
  .attr("cx",825)
  .attr("cy",55)
  .attr("r", 8)
  .style("fill", "#17BEBB")
  .attr('id', 'natCirc');
svg.append("text")
  .attr("x", 845)
  .attr("y", 30)
  .text("Boston")
  .style("font-size", 26)
  .attr("alignment-baseline","middle")
  .attr('id', 'bostonLabel');
svg.append("text")
  .attr("x", 845)
  .attr("y", 55)
  .text("National Avg.")
  .style("font-size", 26)
  .attr("alignment-baseline","middle")
  .attr('id', 'natLabel');

// x scale for precipitation visualization
const x2 = d3.scaleBand()
  .range([ 0, width2 ])
  .domain(['1966-1975', '1977-1986', '1987-1996', '1997-2006', '2007-2016'])
  .padding(0.2);

// label for precipitation x-axis
svg2.append("text")
  .attr("class", "xlabel-2")
  .attr("text-anchor", "middle")
  .attr("x", width2/2)
  .attr("y", height2 + 60)
  .text("Decade")
  .style("font-size",28)
  .attr('id', 'xlabel2');

// x-axis for precipitation visualization
svg2.append("g")
  .attr("stroke-width", 2.5)
  .style("font-size",24)
  .attr("transform", `translate(0, ${height2})`)
  .call(d3.axisBottom(x2));

// y scale for precipitation
const y2 = d3.scaleLinear()
  .domain([25, 45])
  .range([ height2, 0]);

// precipitation y-axis label
svg2.append("g")
  .attr("stroke-width", 2.5)
  .style("font-size",24)
  .call(d3.axisLeft(y2));

// precipitation y-axis label
svg2.append("text")
  .attr("class", "ylabel-2")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Average Inches of Precipitation Per Year")
  .style("font-size",28)
  .attr('id', 'ylabel2');

// precipitation title
svg2.append("text")
  .attr("x", width2 / 2 )
  .attr("y", -16)
  .text("Heavy Precipitation in the Northeast")
  .style("font-size",32)
  .style("text-anchor", "middle")
  .attr('id', 'title3');

// makes paths look like they're drawn on the page
// pathId: id of path being moved
// transition: the D3 transition to be used
// remove: boolean, is this path being removed from
// the chart?
const pathTransition = (pathId, transition, remove) => {
  // select path by id
  const path = d3.selectAll(pathId);

  // determine length of path
  // don't try to get path length if path doesn't exist yet
  const pathLength = path.node() ? path.node().getTotalLength() : null;

  // use default or given transition
  const transitionPath = transition || 
    d3.transition()
      .delay(200)
      .ease(d3.easeSin)
      .duration(2500);

  // use transition, path length and stroke-dash attributes to
  // make path appear as though it is being drawn

  // if removing line, move dashoffset from whatever it is
  // to the length of the path, so it does not appear on the 
  // chart
  if(remove) {
    path
    .transition(transitionPath)
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength);
  }
  // if drawing line, move dashoffset to 0
  else {
    path
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);
  }
}

// function to draw the first stage of the first flood visualization
const drawChart = () => {

  // read in initial data
  d3.csv("data/high_tide_flooding_1.csv",
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national, 
    }
  }).then(
    function(data) {

      // red path for Boston data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ff6961")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.decade) })
          .y(function(d) { return y(d.boston) })
        )
        .attr('id', 'boston');

      // blue path for National data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#17BEBB')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) {return x(d.decade)})
        .y(function(d) {return y(d.national)})
        )
        .attr('id', 'national');

      // draw paths on screen
      pathTransition('#boston', null, false);
      pathTransition('#national', null, false);

    }
  )
  // set alreadyShown to true
  setAlreadyShown(true);
};

// function to draw paths for the rest of the data for the first visualization
const chartExtension = () => {
  // read in the rest of the data
  d3.csv("data/high_tide_flooding_2.csv",
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national
    }
  }).then(
    function(data) {
      // rest of the Boston path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ff6961")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.decade) })
        .y(function(d) { return y(d.boston) })
        )
        .attr('id', 'boston2');

      // rest of the national path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#17BEBB')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) {return x(d.decade)})
        .y(function(d) {return y(d.national)})
        )
        .attr('id', 'national2');

      // delayed transition
      const delayedTransition = d3.transition()
        .delay(800)
        .ease(d3.easeSin)
        .duration(2500);

      // draw paths on screen
      pathTransition('#boston2', delayedTransition, false);
      pathTransition('#national2', delayedTransition, false);
    }
  )
}

// function to remove first visualization before showing next one
const removeLineChart = () => {
  // transition for removing second set of paths
  const transition1 = d3
    .transition()
    .delay(200)
    .ease(d3.easeSin)
    .duration(800);

  // transition for removing first set of paths
  const transition2 = d3
    .transition()
    .delay(900)
    .ease(d3.easeSin)
    .duration(800);

  // remove each path
  pathTransition('#boston2', transition1, true);
  pathTransition('#national2', transition1, true);
  pathTransition('#boston', transition2, true);
  pathTransition('#national', transition2, true);

  // remove axes, labels, titles and national part of legend
  d3.select('#xlabel').classed('hidden', true);
  d3.select('#xaxis').classed('hidden', true);
  d3.select('#ylabel').classed('hidden', true);
  d3.select('#yaxis').classed('hidden', true);
  d3.select('#natCirc').classed('hidden', true);
  d3.select('#natLabel').classed('hidden', true);
  d3.select('#title1').classed('hidden', true);
}


// function to draw second visualization on same svg canvas
const drawNewChart = () => {
  // read new data
  d3.csv("data/projected_flooding.csv",
  function(d){
    return { 
      year : d3.timeParse("%Y")(d.year), 
      days : d.days
    }
  }).then( 
    function(data) {
      // tick values for x-axis
      // (not evenly distributed but requested by partner)
      const tickValues = [
        d3.timeParse("%Y")(2000), 
        d3.timeParse("%Y")(2020), 
        d3.timeParse("%Y")(2030), 
        d3.timeParse("%Y")(2050)
      ]

      // new x-scale based on new year data
      const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);

      // new x-axis based on new data
      svg.append("g")
        .attr("stroke-width", 2.5)
        .style("font-size",24)
        .attr("transform", `translate(0, ${height})`)
        .attr('id', 'futurexaxis')
        .call(d3.axisBottom(x).tickValues(tickValues));
      
      // new x-label for new data
      svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year")
        .attr('id', 'futurexlabel')
        .style("font-size",28);

      // new y-scale for new data
      const y = d3.scaleLinear()
        .domain([0, 80])
        .range([ height, 0 ]);

      // new y-axis for new data
      svg.append("g")
        .attr("stroke-width", 2.5)
        .style("font-size",24)
        .attr('id', 'futureyaxis')
        .call(d3.axisLeft(y));
      
      // new y-label for new data
      svg.append("text")
          .attr("class", "ylabel")
          .attr("text-anchor", "end")
          .attr("y", 6)
          .attr("dy", ".75em")
          .attr('id', 'futureylabel')
          .attr("transform", "rotate(-90)")
          .text("Number of High-Tide Flood Days")
          .style("font-size",28);

      // new chart title for new data
      svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -16)
        .text("Future High-Tide Flooding")
        .attr('id', 'futuretitle')
        .style("font-size",32)
        .style("text-anchor", "middle");

      // new path for new data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#ff6961')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) {return x(d.year)})
          .y(function(d) {return y(d.days)})
        )
        .attr('id', 'futurePath');
      
      // delayed transition to give other lines time
      // to disappear
      const transition = d3.transition()
        .delay(1700)
        .ease(d3.easeSin)
        .duration(2500);

      // draw new path
      pathTransition('#futurePath', transition, false);
    }
  )
}

// function to draw the precipitation chart
// as seen on the first precipitation slide
const drawPrecipitationChart = () => {
  // read in data
  d3.csv("data/heavy_precipitation_1.csv",
    function(d){
      return { 
        years : d.years, 
        inches : d3.format(",.2f")(d.inches)
      }
    }).then( 
      function(data) {
        // draw bars, initially with height of 0
        svg2.selectAll("mybar")
          .data(data)
          .enter()
          .append("rect")
            .attr("x", function(d) { return x2(d.years); })
            .attr("width", x2.bandwidth())
            .attr("height", function() { return 0; })
            .attr("y", function() { return 1100; })
            .attr("fill", "#003366")
            .attr('id', 'firstBars')
            
        // use D3 tranisition to make bars grow to 
        // appropriate heights according to data
        svg2.selectAll('#firstBars')
          .transition()
          .delay(100)
          .duration(2500)
          .attr("y", function(d) { return y2(d.inches); })
          .attr("height", function(d) { return height2 - y2(d.inches); })
      }
    )
}

// function to draw the rest of the precipitation chart
// as seen on the second precipitation slide
const extendPrecipitationChart = () => {
  // read in data
  d3.csv("data/heavy_precipitation_2.csv",
    function(d){
      return { 
        years : d.years, 
        inches : d3.format(",.2f")(d.inches)
      }
    }).then( 
      function(data) {
        // follows same structure as drawPrecipitationChart()
        const newRects = svg2.selectAll("mybar")
          .data(data)
          .enter()
          .append("rect")
            .attr("x", function(d) { return x2(d.years); })
            .attr("width", x2.bandwidth())
            .attr("height", function() { return 0; })
            .attr("y", function() { return 1100; })
            .attr("fill", "#003366")
            .attr('id', 'lastBars')
            
        newRects
          .transition()
          .duration(2000)
          .attr("y", function(d) { return y2(d.inches); })
          .attr("height", function(d) { return height2 - y2(d.inches); })
      }
    )
}

// function for next button click
// on first flooding storyline slide
const firstFloodClick = () => {
    // extend line chart
    chartExtension();

    // change slides (caption)
    document.getElementById('flood-slide-1').className = 'hidden';
    document.getElementById('flood-slide-2').className = '';

}

// function for next button click
// on second flood slide
const secondFloodClick = () => {
  // remove current visualization
  removeLineChart();

  // draw new chart
  drawNewChart();

  // change slides (caption)
  document.getElementById('next-flood').className = 'hidden';
  document.getElementById('continue-flood').className = 'flow-button continue-button';
  document.getElementById('view-prec').className = 'flow-button view-button';
  document.getElementById('flood-slide-2').className = 'hidden';
  document.getElementById('flood-slide-3').className = '';
}

// function for first click of next button
// on precipitation storyline slide
const firstPrecClick = () => {
    // change slides (caption)
    document.getElementById('prec-slide-1').className = 'hidden';
    document.getElementById('prec-slide-2').className = '';
    document.getElementById('next').className = 'hidden';
    document.getElementById('continue').className = 'flow-button continue-button';
    document.getElementById('view-flooding').className = 'flow-button view-button';
    extendPrecipitationChart();
}

// function for click of the back button
// on the first precipitation storyline slide
const firstPrecBackClick = () => {
  // go back to transition text
  document.getElementById('prec-text').scrollIntoView();
  // remove bars
  svg2.selectAll('#firstBars')
          .transition()
          .duration(2500)
          .attr("y", function() { return 1100; })
          .attr("height", function() { return 0; })
}

// fucntion for click of the back button
// on the first flooding storyline slide
const firstFloodBackClick = () => {
  // scroll back to transition text
  document.getElementById('flooding-text').scrollIntoView();
  // remove existing lines
  pathTransition('#boston', null, true);
  pathTransition('#national', null, true);
}

// fucntion for back button click
// on second precipitation slide
const secondPrecBackClick = () => {
  // change slides (caption)
  document.getElementById('prec-slide-1').className = '';
  document.getElementById('prec-slide-2').className = 'hidden';
  document.getElementById('next').className = 'flow-button';
  document.getElementById('continue').className = 'hidden';
  // remove second set of bars
  d3.selectAll("#lastBars")
    .transition()
    .duration(2500)
    .attr("y", function() { return 1100; })
    .attr("height", function() { return 0; })
}

// function for back button click
// on second flooding slide
const secondFloodBackClick = () => {
  // remove the second set of lines
  pathTransition('#boston2', null, true);
  pathTransition('#national2', null, true);
  
  // change slides (caption)
  document.getElementById('flood-slide-2').className = 'hidden';
  document.getElementById('flood-slide-1').className = '';
}

// function for back button click on
// third flood slide
const thirdFloodBackClick = resetting => {
  // show first visualization's axes and labels
  d3.select('#xlabel').classed('hidden', false);
  d3.select('#xaxis').classed('hidden', false);
  d3.select('#ylabel').classed('hidden', false);
  d3.select('#yaxis').classed('hidden', false);
  d3.select('#natCirc').classed('hidden', false);
  d3.select('#natLabel').classed('hidden', false);
  d3.select('#title1').classed('hidden', false);

  // hide second visualization's axes and labels
  d3.selectAll('#futurexaxis').classed('hidden', true);
  d3.selectAll('#futurexlabel').classed('hidden', true);
  d3.selectAll('#futureyaxis').classed('hidden', true);
  d3.selectAll('#futureylabel').classed('hidden', true);
  d3.selectAll('#futuretitle').classed('hidden', true);

  // change buttons and slides
  document.getElementById('continue-flood').className = 'hidden';
  document.getElementById('next-flood').className = 'flow-button';
  document.getElementById('flood-slide-3').className = 'hidden';

  // hide current path
  pathTransition('#futurePath', null, true);

  // show path from initial visualization
  const firstTransition = d3.transition()
      .delay(2700)
      .ease(d3.easeSin)
      .duration(2500);
  pathTransition('#boston', firstTransition, false);
  pathTransition('#national', firstTransition, false);
    const secondTransition = d3.transition()
      .delay(5200)
      .ease(d3.easeSin)
      .duration(2500);
  pathTransition('#boston2', secondTransition, false);
  pathTransition('#national2', secondTransition, false);

  // if not using function to show first flooding slide
  // after switching stories, show content from second slide
  if (!resetting) {
    document.getElementById('flood-slide-2').className = '';
    const secondTransition = d3.transition()
      .delay(5200)
      .ease(d3.easeSin)
      .duration(2500);
    pathTransition('#boston2', secondTransition, false);
    pathTransition('#national2', secondTransition, false);
  }
}


// function to update charts as a result of next button click
const updateChart = () => {
  // different functions are called depending on 
  // which storyline is being told
  // for each, call functions that correspond to 
  // current slide and set new slide
  if (precipitation) {
    precSlide == 1 && firstPrecClick();
    setPrecSlide(precSlide + 1);
  }
  else {
    floodSlide == 1 && firstFloodClick();
    floodSlide == 2 && secondFloodClick();
    setFloodSlide(floodSlide + 1);
  }
}

// function to update charts and slides in response
// to back button click
const goBack = () => {
  // follows same structure as updateChart()
  if (precipitation) {
    precSlide == 1 && firstPrecBackClick();
    precSlide == 2 && secondPrecBackClick();
    setPrecSlide(precSlide - 1);
  }
  else {
    floodSlide == 1 && firstFloodBackClick();
    floodSlide == 2 && secondFloodBackClick();
    floodSlide == 3 && thirdFloodBackClick(false);
    setFloodSlide(floodSlide - 1);
  }
}

// function to move past the precipitation and flooding
// visualizations to the future section of the website
const moveOn = () => {
  document.getElementById('future-transition').scrollIntoView();
}

