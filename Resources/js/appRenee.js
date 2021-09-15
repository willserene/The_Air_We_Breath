// create init function to build inital plot when refreshed
function init(){
  buildPlot()
}

//create function that will apply once the option has changed
function optionChanged() {

  // Build the plot with the new stock
  buildPlot();
}


//create a function that builds the new plot. 
function buildPlot(){


  d3.json("./Resources/data/airsamples.json", function(incomingdata) {
      //get a list of all the id names
      console.log(incomingdata)
      var idValues = incomingdata.names;

      // Create the drop down menu by inserting every id name in below function.
      idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));


      // Use D3 to select the current ID and store in a variable to work with
      var currentID = d3.selectAll("#selDataset").node().value;

      //filter the data for the current ID to get relavant information
      filteredID = incomingdata.samples.filter(entry => entry.id == currentID);

      // create Trace for the horizontal bar chart
      
      var trace1 = {
        x: filteredID[0].sample_values.reverse(),
        y: filteredID[0].air_ids.reverse().map(int => int.toString()),
        text: filteredID[0].air_labels.reverse(),
        marker: {color: 'goldenrod'},
        type:"bar",
        orientation: 'h'
      };
  
    
      // data
      var dataPlot = [trace1];

      // Layout
      var layout = {
          title : 'Air Quality',
          margin: {
              l: 75,
              r: 100,
              t: 60,
              b: 60
          }

      };

      // Use plotly to create new bar
      Plotly.newPlot("bar", dataPlot, layout);

      // create the demographics panel
      filteredMeta = incomingdata.metadata.filter(entry => entry.id == currentID)
     
      // create a demographics object to add to panel body
      var demographics = {
          'City: ': filteredMeta[0].id,
          'AQI: ': filteredMeta[0].aqi,
          'Population 2019 Estimate: ': filteredMeta[0].Population,
          'Area Land mi2: ': filteredMeta[0].Area,
          'Location: ': filteredMeta[0].Location
      }
      //select the id to append the key value pair under demographics panel
      panelBody = d3.select("#sample-metadata")

      // remove the current demographic info to make way for new currentID
      panelBody.html("")
      
      //append the key value pairs from demographics into the demographics panel
      Object.entries(demographics).forEach(([key, value]) => {
          panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
      });

      gauge()
  });
};

//run init to  set the main page
init();

function gauge(){
  d3.json("./Resources/data/airsamples.json", function (data) {
      var currentID = d3.selectAll("#selDataset").node().value;
      filteredMeta = data.metadata.filter(entry => entry.id == currentID);
      x = filteredMeta[0].aqi
      

      path = pathFind(x)
      createGauge()
   
  });
  
  // crete the function to retrieve the correct path for needle
  
  function pathFind(aqi){
    switch(aqi){
        
        case 1:
            return 'M .48 .5 L 0.25 .58 L .56 .515 Z';
            break;
        case 2:
            return 'M .48 .5 L 0.32 .74L .55 .5 Z';
            break;
        case 3:
            return 'M .48 .5 L 0.50 .85L .52 .5 Z';
            break;
        case 4:
            return 'M .48 .5 L 0.70 .76 L .52 .5 Z';
            break;
        case 5:
            return 'M .48 .515 L 0.85 .58 L .60 .5 Z';
            break;
    }
}


// create pie chart first 

function createGauge() {
    meter_chart = [
    {
    //set the values and labels and marker colors
    "values": [5,1,1,1, 1, 1],
    "labels": [' ','1','2','3','4','5'],
    'marker':{
        'colors':[
            'rgb(255, 255, 255)',
            'green',
            'yellow',
            'orange',
            'red',
            'maroon'
            
        ]
    },
   
    "name": "Gauge",
    "hole": .4,
    "type": "pie",
    "direction": "clockwise",
    "rotation": 90,
    "showlegend": false,
    "textinfo": "label",
    "textposition": "inside",
    "hoverinfo": "label"
}]

 var layout = {
    title: '<b>Air Quality Index</b> <br>',
    height: 500,
    width: 500,
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }]
      
   }
   Plotly.newPlot('gauge', meter_chart, layout);
  }};