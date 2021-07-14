//Create SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG and append to scatter ID
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append SVG group and shift by left and top margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Set initial data
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

//Function to update x-scale upon selection
function xScale(data, selectedXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[selectedXAxis]) * 0.9,
            d3.max(data, d => d[selectedXAxis]) * 1.1
        ])
        .range([0, width]);
    return xLinearScale;
};

//Function to update y-scale upon selection
function yScale(data, selectedYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[selectedYAxis]) * 0.9,
            d3.max(data, d => d[selectedYAxis]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
};

//Function to update x-axis upon selection
function setXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1500)
        .call(bottomAxis);
    return xAxis;
}

//Function to update y-axis upon selection
function setYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1500)
        .call(leftAxis);
    return yAxis;
}

//Function to update circles group upon selection
function setCircles(circlesGroup, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    circlesGroup.transition()
        .duration(1500)
        .attr("cx", d => newXScale(d[selectedXAxis]))
        .attr("cy", d => newYScale(d[selectedYAxis]))
    return circlesGroup;
}

//Function to update circle text group upon selection
function setCircleText(circlesText, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    circlesText.transition()
        .duration(1500)
        .attr("x", d => newXScale(d[selectedXAxis]))
        .attr("y", d => newYScale(d[selectedYAxis]))
    return circlesText;
}

//Function to update tooltip upon selection
function setToolTip(selectedXAxis, circlesGroup, selectedYAxis) {
    let label;
    let unit;

    if(selectedXAxis === "poverty") {
        label = "Poverty: " 
        unit = "%"
    }
    else if(selectedXAxis === "age") {
        label = "Age: "
        unit = " yrs"
    }
    else {
        label = "Household Income: $"
        unit = ""
    }

    if(selectedYAxis === "healthcare") {
        yLabel = "Lack Healthcare: " 
        yUnit = "%"
    }
    else if(selectedYAxis === "smokes") {
        yLabel = "Smoke: "
        yUnit = "%"
    }
    else {
        yLabel = "Obesity"
        yUnit = "%"
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -80])
        .html(function(d) {
            return(`<strong>${d.state}</strong><br>${label}${d[selectedXAxis]}${unit}<br>${yLabel}${d.healthcare}${yUnit}`);
        });
    
    chartGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function(d) {toolTip.show(d, this);
        })
        .on("mouseout", function(data){toolTip.hide(data);
        });
    return circlesGroup;
}

//Load data from csv
d3.csv("./assets/data/data.csv").then(function(data){
    console.log(data);

    data.forEach(d => {
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
    });

    var xLinearScale = xScale(data, selectedXAxis);
    
    var yLinearScale = yScale(data, selectedYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    //Create circles for scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "Coral")
        .attr("opacity", "0.75")
    
    //Label circles on scatter plot
    var circlesText = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        
    //Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}`);
        });

    //Create tooltip in chart
    chartGroup.call(toolTip);

    //Create event listeners to display and hide tooltip
    circlesGroup
        .on("mouseover", function(d) {toolTip.show(d, this);
        })
        .on("mouseout", d => {toolTip.hide(d, this);
        });
    
    //Append and create y axis label group
    var yLabelGroup = chartGroup.append("g")
        .attr("transform", `translate(-35, ${height/2})`)
        .attr("class", "axisText")
        
    var healthcareLabel = yLabelGroup.append("text")   
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .attr("transform", "rotate(-90)")
        .classed("active", true)
        .text("Lack Healthcare (%)");
    
    var smokeLabel = yLabelGroup.append("text")   
         .attr("x", 0)
         .attr("y", -20)
         .attr("value", "smokes")
         .attr("transform", "rotate(-90)")
         .classed("inactive", true)
         .text("Smokes (%)");
    
    var obeseLabel = yLabelGroup.append("text")   
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "obesity")
        .attr("transform", "rotate(-90)")
        .classed("inactive", true)
        .text("Obese (%)");
    
    //Append and create x axis label group
    var xLabelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")

    var povertyLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    //Update ToolTip
    var circlesGroup = setToolTip(selectedXAxis, circlesGroup, selectedYAxis);
    
    //x axis label event listener
    xLabelGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if(value !== selectedXAxis) {
                selectedXAxis = value;
                console.log(`Selected X-Axis: ${selectedXAxis}`);
                xLinearScale = xScale(data, selectedXAxis);
                xAxis = setXAxis(xLinearScale, xAxis);
                circlesGroup = setCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
                circlesText = setCircleText(circlesText, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
                circlesGroup = setToolTip(selectedXAxis, circlesGroup, selectedYAxis);
                //Set class for selected label
                if (selectedXAxis === "poverty"){
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else if (selectedXAxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false)
                };
            };
        });

    //y axis label event listener
    yLabelGroup.selectAll("text")
    .on("click", function(){
        var value = d3.select(this).attr("value");
        if(value !== selectedXAxis) {
            selectedYAxis = value;
            console.log(`Selected Y-Axis: ${selectedYAxis}`);
            yLinearScale = yScale(data, selectedYAxis);
            yAxis = setYAxis(yLinearScale, yAxis);
            circlesGroup = setCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
            circlesText = setCircleText(circlesText, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
            circlesGroup = setToolTip(selectedXAxis, circlesGroup, selectedYAxis);
            //Set class for selected label
            if (selectedYAxis === "healthcare"){
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false)
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true)
            }
            else if (selectedYAxis === "smokes"){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true)
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false)
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true)
            }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true)
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                obeseLabel
                    .classed("active", true)
                    .classed("inactive", false)
            };
        };
    });
}).catch(function(error){
    console.log(error);
});