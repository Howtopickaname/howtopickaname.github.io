// tick format
var formatPercent = d3.format(".0%");
var formatCount = function(d){return "# " + d;};
var formatFloat = d3.format(".2f");
var formatInteger = d3.format("d");


function main() {

	var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // x axis
    if(window.data == undefined){
    g.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

    svg.select("#x-axis")
    .append("text")
    .attr("id", "x-text")
    .attr("y", 10)
    .attr("x", width + 50)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Stock");

           
    // y axis
    g.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale));

    svg.select("#y-axis")
    .append("text")
    .attr("id", "y-text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr('dy', '-8em')
    .attr('text-anchor', 'end')
    .attr('stroke', 'black')
    .text("");
    }

    d3.csv("analyst_ratings.csv").then(async function(data) {
        subtitle = svg.append("text")
        .attr("id", "sub-title")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px");
 
        let categories = ["Analyst Rating", "YTD Return", "Volatility", "Price-Earning Ratio"];
        let variables = ["Buy", "Return", "Volatility", "PE Ratio"];
        let formats = [formatCount, formatPercent, formatPercent, formatInteger];


        display_func1 = function(){display(data, categories[0], variables[0], formats[0], true);};
        display_func2 = function(){display(data, categories[1], variables[1], formats[1], false);};
        display_func3 = function(){display(data, categories[2], variables[2], formats[2], false);};
        display_func4 = function(){display(data, categories[3], variables[3], formats[3], false);};
        
        let promise1 = new Promise((resolve) => {
            display_func1();
            setTimeout(resolve, 1500);
        });
        await promise1;

        let promise2 = new Promise((resolve) => {
            display_func2();
            setTimeout(resolve, 1500);
        });
        await promise2;

        let promise3 = new Promise((resolve) => {
            display_func3();
            setTimeout(resolve, 1500);
        });
        await promise3;

        let promise4 = new Promise((resolve) => {
            display_func4();
            resolve();
        });
        await promise4;

        window.data = data;
    
    })

    // display bar charts

    function display(data, category, variable, tickformat, initial) {
        svg.select("#sub-title").text(category);

        xScale.domain(data.map(function(d) { return d.Stock; }));
        yScale.domain([0, d3.max(data, function(d) { return parseFloat(d[variable]); })]);

        // x axis
        var xaxis = svg.select("#x-axis");
        xaxis.transition()
        .duration(500)
        .call(d3.axisBottom(xScale));
        
        
        // y axis
        var yaxis = svg.select("#y-axis");
        yaxis.transition()
        .duration(500)
        .call(d3.axisLeft(yScale).tickFormat(tickformat).ticks(10));
        
        svg.select("#y-text").text(category);
        
        if (initial) {
            g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.Stock); })
           .attr("y", function(d) { return yScale(d[variable]); })
           .attr("fill", "#720570")
           .attr("width", xScale.bandwidth())
           .transition()
           .ease(d3.easeLinear)
           .duration(500)
           .delay(function(d,i){ return i * 50})
               .attr("height", function(d) { return height - yScale(d[variable]); });
        } else {
            g.selectAll("rect").attr("opacity", 0);
            g.selectAll(".bar")
            .data(data)
            .attr("class", "bar")
           .attr("width", xScale.bandwidth())
           .transition()
           .ease(d3.easeLinear)
           .duration(500)
           .attr("opacity", 1)
           .attr("x", function(d) { return xScale(d.Stock); })
           .attr("y", function(d) { return yScale(d[variable]); })
           .delay(function(d,i){ return i * 50})
               .attr("height", function(d) { return height - yScale(d[variable]); });
        }

}}

function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function close_dropdown() {

      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
}
  


function explore(category, variable){
    close_dropdown();
    var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    let data = window.data;

    let map = {
        "Buy": formatCount,
        "Return": formatPercent,
        "Volatility": formatPercent,
        "PE Ratio": formatInteger,
        "Sharpe Ratio": formatFloat,
    };

    let tickformat = map[variable];
    
    svg.select("#sub-title").text(category);

    xScale.domain(data.map(function(d) { return d.Stock; }));
    yScale.domain([0, d3.max(data, function(d) { return parseFloat(d[variable]); })]);

    // x axis
    var xaxis = svg.select("#x-axis");
    xaxis.transition()
    .duration(500)
    .call(d3.axisBottom(xScale));


    // y axis
    var yaxis = svg.select("#y-axis");
    yaxis.transition()
    .duration(500)
    .call(d3.axisLeft(yScale).tickFormat(tickformat).ticks(10));

    svg.select("#y-text").text(category);


    svg.selectAll("rect")
    // .attr("opacity", 0)
    .on("mouseover", onMouseOver) // Add listener for event
    .on("mouseout", onMouseOut);
    
    svg.selectAll(".bar")
    .data(data)
    .attr("class", "bar")
    .attr("width", xScale.bandwidth())
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attr("opacity", 1)
    .attr("x", function(d) { return xScale(d.Stock); })
    .attr("y", function(d) { return yScale(d[variable]); })
    .delay(function(d,i){ return i * 50})
        .attr("height", function(d) { return height - yScale(d[variable]); });



    //  event handler
    function onMouseOver(event, d) {
    // Get bar's xy values, ,then augment for the tooltip
    var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2;

    // console.log(d);

    // Update Tooltip's position and value
    var tooltip = d3.select('#tooltip')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px');
    
    tooltip.select('#value_title').text(category);
    tooltip.select('#value').text([d[variable]]);
    
    d3.select('#tooltip').classed('hidden', false);


    d3.select(this).attr('class','highlight')
    d3.select(this)
        .transition() 
        .duration(500)
        .attr('width', xScale.bandwidth() + 5)
        .attr('y', function(d){return yScale(parseFloat(d[variable])) - 10;})
        .attr('height', function(d){return height - yScale(parseFloat(d[variable])) + 10;})
}


// Mouseout event handler
function onMouseOut(d, i){
    d3.select(this).attr('class','bar')
    d3.select(this)
        .transition()
        .duration(500)
        .attr('width', xScale.bandwidth())
        .attr('y', function(d){return yScale(d[variable]);})
        .attr('height', function(d) {return height - yScale(parseFloat(d[variable]))})
    
    d3.select('#tooltip').classed('hidden', true);
}

    
}