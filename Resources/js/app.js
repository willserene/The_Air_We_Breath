//json location
var csv = "./Resources/data/air_api_data.csv"

//Get request for weekURL
d3.csv(csv, function(response){
  console.log(response)
  console.log(response[0].lat)

    //Function to define colors
    function getColor(d) {
      return d == 1 ? 'Green':
        d == 2 ? 'YellowGreen':
        d == 3 ? 'Yellow':
        d == 4 ? 'Orange':
        d == 5 ? 'Red':
        "Gray"
    };  

    console.log(getColor(response[0].AQI))

    var cityMarkers = [];

    for (var i = 0; i < response.length; i++) {
        let latLng = L.latLng(response[i].lat, response[i].lon)
        cityMarkers.push(
        L.circleMarker(latLng, {
        fillColor: getColor(response[i].AQI),
        fillOpacity: 0.7,
        color: "gray",
        weight: 1,
        radius: 10, 
        id: response[i].City
        }).bindPopup("<h6>" + response[i].City + "</h6> <hr> <p>AQI: " + response[i].AQI + "<br>Population: " + response[i].Population + "</p>")
        );
    };

    var cityLayer = L.featureGroup(cityMarkers);

    cityLayer.on("click", function(e) {
        var clickedLat = e.layer._latlng["lat"];
        var clickedLon = e.layer._latlng["lng"];
        var clickedCity = e.layer.options.id
        console.log(clickedCity);
        console.log(clickedLat);
        console.log(clickedLon);
        
    })

    // Heatmap
    var heatMap = [];

    for (var i=0; i < response.length; i++) {
        let intensity = L.latLng(response[i].lat, response[i].lon, response[i].AQI/5)
        heatMap.push(intensity);
    };

    var heat = L.heatLayer(heatMap, {
        radius: 30,
        blur: 10, 
        minOpacity: 0.2,
        maxZoom: 18
      });

    // Add darkmap tile layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/dark-v10",
      accessToken: API_KEY
    });

    //Add satellitemap tile layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });

    //Add outdoors tile layer
    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/outdoors-v11",
      accessToken: API_KEY
    });

    //Create baseMaps for layer control
    var baseMaps = {
      "Dark": darkmap,
      "Outdoor": outdoormap,
      "Satellite": satellitemap
    };

    //Create overlayMaps for layer control
    var overlayMaps = {
      "Cities": cityLayer,
      "Heat": heat
    };
  
    //Create bounds
    bounds = new L.LatLngBounds(new L.LatLng(42, -109.8), new L.LatLng(36.8, -101))

    //Create inital map object with default layers
    var myMap = L.map("map", {
      center: [39.0, -105.3],
      //center: bounds.getCenter(),
      zoom: 7,
      maxBounds: bounds,
      layers: [outdoormap, cityLayer]
    });


    //Add layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    //Set-up Legend
    var legend = L.control({ position: "bottomright"});
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [1, 2, 3, 4, 5];
        var labels = ['<strong>AQI</strong>'];

        // div.innerHTML += '<strong>AQI</strong><br>'

        for (var i= 0; i < grades.length; i++) {
          div.innerHTML +=
            labels.push(
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            (grades[i] ? grades[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
        }; 
    legend.addTo(myMap);
  
  //Set-up bubble plot 
  var population = [];
  var AQI = [];

    for (var i=0; i < response.length; i++) {
        let pop = response[i].Population
        let airQual = response[i].AQI
        population.push(pop);
        AQI.push(airQual);
    };

  var traceBubble = [{
    type: 'scatter',
    mode: 'markers',
    marker: {
        opacity: 0.75,
        color: 'red',
        size: 20,
        line: {
            color: 'black',
            width: 2,
        },
    },
    x: AQI,
    y: population,
    text: []
}];
var layoutBubble = {
    title: `Air Quality vs. Population`,
    xaxis: {title: 'Air Quality'},
    yaxis: {title: 'Population'}
};

var trace1 = {
  labels: AQI,
  values: AQI/AQI,
  type: 'pie'
};

var data = [trace1];

var layout = {
  title: "AQI Distribution",
};

Plotly.newPlot("pie", data, layout)

//Use plotly to display charts
Plotly.newPlot("bubble", traceBubble, layoutBubble);
console.log(AQI)
//Chart.js
const ctx = document.getElementById('myChart')
var one = 0
var two = 0
var three = 0
var four = 0
var five = 0

function aqiSort(AQI) {
  for (var i = 0; i < AQI.length; i++) {
    var score = AQI[i]
    switch(score){
      case "1":
        one += 1;
        break;
      case "2":
        two += 1;
        break;
      case "3":
        three += 1;
        break;
      case "4":
        four += 1;
        break;
      case "5":
        five += 1;
        break;
      default:
        console.log("this didnt' work")
    }
  }
}
aqiSort(AQI)

doData = []
doData.push(one)
doData.push(two)
doData.push(three)
doData.push(four)
doData.push(five)
console.log(doData)
//.getContext('2d');
console.log(ctx);
let doChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [{
        label: 'Air Quality',
        data: doData,
        backgroundColor: [
          'Green',
          'YellowGreen',
          'Yellow', 
          'Orange',
          'Red'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: false
    }
  });  
});


