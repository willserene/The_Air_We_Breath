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


    d3.json("samples.json").then((data) =>{
        //get a list of all the id names
        var idValues = data.names;
  
        // Create the drop down menu by inserting every id name in below function.
        idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));


        // Use D3 to select the current ID and store in a variable to work with
        var currentID = d3.selectAll("#selDataset").node().value;
     

        //filter the data for the current ID to get relavant information
        filteredID = data.samples.filter(entry => entry.id == currentID);

        // create Trace for the horizontal bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };
    
      
        // data
        var dataPlot = [trace1];

        // Layout
        var layout = {
            title : 'Top 10 OTU samples',
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
        filteredMeta = data.metadata.filter(entry => entry.id == currentID)
       
        // create a demographics object to add to panel body
        var demographics = {
            'id: ': filteredMeta[0].id,
            'ethnicity: ': filteredMeta[0].ethnicity,
            'gender: ': filteredMeta[0].gender,
            'age: ': filteredMeta[0].age,
            'location: ': filteredMeta[0].location,
            'bbtype: ': filteredMeta[0].bbtype,
            'wfreq: ': filteredMeta[0].wfreq
        }
        //select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // remove the current demographic info to make way for new currentID
        panelBody.html("")
        
        //append the key value pairs from demographics into the demographics panel
        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Create the trace for the bubble chart
        var trace2 ={
            x : filteredID[0].otu_ids,
            y : filteredID[0].sample_values,
            text : filteredID[0].otu_labels,
            mode : 'markers',
            marker: {
                color : filteredID[0].otu_ids,
                size : filteredID[0].sample_values
            }
        }

        var data2 = [trace2]

        //create the layout for the bubble chart
        var layout2 = {
            title : 'Marker Size',
            showlegend : false, 
        }

        //plot plot plot with plotly
        Plotly.newPlot('bubble', data2, layout2)
        console.log(filteredID)
        gauge()
    });
};

//run init to  set the main page
init();

function gauge(){
    d3.json("samples.json").then((data) =>{
        var currentID = d3.selectAll("#selDataset").node().value;
        filteredMeta = data.metadata.filter(entry => entry.id == currentID);
        x = filteredMeta[0].wfreq
        path = pathFind(x)
        createGauge()
     
    });
    
    // crete the function to retrieve the correct path for needle
    
    function pathFind(wfreq){
        switch(wfreq){
            case 0:
                return 'M .48 .5 L 0.25 .58 L .56 .515 Z';
                break;
            case 1:
                return 'M .48 .5 L 0.25 .58 L .56 .515 Z';
                break;
            case 2:
                return 'M .48 .5 L 0.25 .64L .55 .5 Z';
                break;
            case 3:
                return 'M .48 .5 L 0.32 .74L .52 .5 Z';
                break;
            case 4:
                return 'M .48 .5 L 0.41 .81L .52 .5 Z';
                break;
            case 5:
                return 'M .48 .5 L 0.50 .85L .52 .5 Z';
                break;
            case 6:
                return 'M .48 .5 L 0.61 .82 L .52 .5 Z';
                break;
            case 7:
                return 'M .48 .5 L 0.70 .76 L .52 .5 Z';
                break;
            case 8:
                return 'M .46 .5 L 0.77 .68 L .52 .5 Z';
                break;
            case 9:
                return 'M .48 .515 L 0.85 .58 L .60 .5 Z';
                break;
        }
    }
    
    
    // create pie chart first 
    
    function createGauge() {
        meter_chart = [
        {
        //set the values and labels and marker colors
        "values": [9,1,1,1,1,1,1,1,1,1],
        "labels": [' ','0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        'marker':{
            'colors':[
                'rgb(255, 255, 255)',
                'rgb(232, 226, 202)',
                'rgb(216, 212, 174)',
                'rgb(198, 198, 147)',
                'rgb(177, 186, 121)',
                'rgb(154, 173, 97)',
                'rgb(129, 162, 74)',
                'rgb(101, 150, 51)',
                'rgb(68, 139, 29)',
                'rgb(14, 127, 0)'
            ]
        },
        // "domain": {x: [0], y: [0]
        // },
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
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        height: 600,
        width: 600,
        shapes:[{
            type: 'path',
            // path: 'M .48 .5 L 0.5 .85 L .52 .5 Z',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }]
     
        
     }
     Plotly.newPlot('gauge', meter_chart, layout);
    }};