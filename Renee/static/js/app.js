var metadata, names, samples;

d3.json("airsamples.json").then((incomingData) => {
    metadata = incomingData.metadata;
    names=incomingData.names;
    samples=incomingData.samples;

    //put names in dropdown
    var dropdown = d3.select("#selDataset");
    names.forEach (no=>{
        dropdown.append("option").text(no).property("value",no);
    })

    var firstid=names[0]
    buildDashboard(firstid)
});

function optionChanged (currentID){
    buildDashboard(currentID)
}
function buildDashboard(currentid){
    var metaresult=metadata.filter(object=>object.id==currentid)
    var curmeta=metaresult[0]
    var sampleresult=samples.filter(object=>object.id==currentid)
    var cursample=sampleresult[0]
    var panel =d3.select("#sample-metadata")
    panel.html("")
    Object.entries(curmeta).forEach(([key,value])=>{
        panel.append("h6").text(`${key}: ${value}`)
    })
    var air_id=cursample.air_ids
    var air_label=cursample.air_labels
    var air_samples=cursample.sample_values
    //adding chart
    var ytix=air_id.map(id=>`${id}`)
    var barData=[{
        x:air_samples,
        y:ytix,
        text:air_label,
        marker: {color: 'brown'},
        type:"bar",
        orientation:"h"
        
    }]
    var stylebar={
        title: "Air Quality"
    }
    Plotly.newPlot("bar", barData, stylebar);
}