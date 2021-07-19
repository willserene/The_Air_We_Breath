//json location
var csv = "./Resources/data/air_api_data.csv"

//Get request for weekURL
d3.csv(csv, function(response){
  response.forEach(function(data){
    data.Population = +data.Population.replace(/,/g, '')
  })

  //Test Response
  console.log(response)
  console.log(response[0].Population)

  //Function to define AQI Color Scale
  function getColor(d) {
    return d == 1 ? 'Green':
      d == 2 ? 'YellowGreen':
      d == 3 ? 'Yellow':
      d == 4 ? 'Orange':
      d == 5 ? 'Red':
      "Gray"
  };  

  //Create empty array to hold lat/longs of cities
  var cityMarkers = [];

  //Loop through response to create circle markers
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

  //Create layer with markers
  var cityLayer = L.featureGroup(cityMarkers);

  //Create empty array for lat/longs & AQI for heatmap
  var heatMap = [];

  //Loop through response to create heatmap
  for (var i=0; i < response.length; i++) {
      let intensity = L.latLng(response[i].lat, response[i].lon, response[i].AQI/5)
      heatMap.push(intensity);
  };

  //Create heatmap layer
  var heat = L.heatLayer(heatMap, {
      radius: 20,
      blur: 10, 
      minOpacity: 0.2,
      maxZoom: 18,
      gradient: {
        0.0: 'green',
        0.4: 'yellowgreen',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
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
  
  //Create bounds for map
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
    collapsed: true
  }).addTo(myMap);

  //Set-up Legend
  var legend = L.control({ position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [1, 2, 3, 4, 5];
      var labels = ['<strong>AQI</strong>'];
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
  
  //Set-up arrays for chart.js plots 
  var population = [];
  var AQI = [];

  //Loop through response and push to population and AQI arrays
  for (var i=0; i < response.length; i++) {
      let pop = response[i].Population
      let airQual = response[i].AQI
      population.push(pop);
      AQI.push(airQual);
  };


  //Create population Counters
  var onePop = 0
  var twoPop = 0
  var threePop = 0
  var fourPop = 0
  var fivePop = 0

  //Function to count population by AQI rank
  function aqiPop(response) {
    for (var i = 0; i < response.length; i++) {
      var score = response[i].AQI
      var cityPop = response[i].Population
      if (isNaN(cityPop) == false) {
        switch(score){
          case "1":
            onePop += cityPop;
            break;
          case "2":
            twoPop += cityPop;
            break;
          case "3":
            threePop += cityPop;
            break;
          case "4":
            fourPop += cityPop;
            break;
          case "5":
            fivePop += cityPop;
            break;
          default:
            console.log("this didnt' work")
        }
      }  
    }
  }

  //Run population function
  aqiPop(response)

  //Create empty array to push population data to for plotting
  popData = []

  //Push population data to array
  popData.push(onePop)
  popData.push(twoPop)
  popData.push(threePop)
  popData.push(fourPop)
  popData.push(fivePop)

  //Create labels for Chart.js charts
  let labels = [ "1: Very Low", "2: Low", "3: Medium", "4: High", "5: Very High"]

  //Create bar chart via Chart.js
  const bar = document.getElementById('barChart')
  let barChart = new Chart(bar, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '',
        data: popData,
        backgroundColor: [
          'Green',
          'YellowGreen',
          'Yellow', 
          'Orange',
          'Red'
        ],
        borderColor: [
          'Green',
          'YellowGreen',
          'Yellow', 
          'Orange',
          'Red'
        ],
        borderWidth: 1
      }]
    },
    options: {
      //indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
          position: "right"
        },
        title: {
          display: true,
          text: "Colorado Population by Air Quality Index",
          font: {
            size: 28,
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true
    }
  });

  //Create counters for each AQI score
  var one = 0
  var two = 0
  var three = 0
  var four = 0
  var five = 0

  //Function to count each AQI score
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

  //Run AQI score function
  aqiSort(AQI)

  //Create empty array to push AQI data to for doughnut plot
  doData = []

  //Push population data to array
  doData.push(one)
  doData.push(two)
  doData.push(three)
  doData.push(four)
  doData.push(five)

  //Create doughnut chart via Chart.js
  const donut = document.getElementById('doChart')
  let doChart = new Chart(donut, {
      type: 'doughnut',
      data: {
        labels: labels,
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
        plugins: {
          legend: {
            display: true,
            position: "right"
          },
          title: {
            display: true,
            text: "City Air Quality Index",
            font: {
              size: 28,
            }
          }
        },
        maintainAspectRatio : true,
        responsive: true
      }
  });

  test = response.filter(row => row.City == "Denver")
  testD = test[0]
  console.log(testD)
  console.log(testD.SO2)

  //Create initial radar chart via Chart.js
  const radar = document.getElementById('radarChart')
  let radLabels = ["CO", "NO2", "O3", "S02", "PM2.5", "PM10"]
  let matchedCity = response.filter(row => row.City == 'Denver');
  let match = matchedCity[0];
  let matchCO = Math.round(((match.CO/1000)/15.4)*100)
  //let matchNH3 = match.NH3
  //let matchNO = match.NO
  let matchNO2 = Math.round((match.NO2/649)*100)
  let matchO3 = Math.round((match.O3/204)*100)
  let matchSO2 = Math.round((match.SO2/304)*100)
  let matchPM25 = Math.round((match.PM25/150.4)*100)
  let matchPM10 = Math.round((match.PM10/354)*100)
  let matchData = []
  matchData.push(matchCO, matchNO2, matchO3, matchSO2, matchPM25, matchPM10)
  radChart = new Chart(radar, {
      type: 'radar',
      data: {
        labels: radLabels,
        datasets: [{
          label: 'Denver',
          data: matchData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        elements: {
          line: {
            borderWidth: 5
          }
        },
        plugins: {
          legend: {
            display: false,
            position: "right"
          },
          title: {
            display: true,
            text: `Denver Pollution Component %`,
            font: {
              size: 28,
            }
          },
          subtitle: {
            display: true,
            text: "100% = Threshold for Medium AQI",
            font: {
              size: 16,
            },
            padding: {
              top:0,
              bottom:30
            }
          }
        },
        maintainAspectRatio : true,
        responsive: true
      }
  });


  function radarChart(selectedCity) {
    const radar = document.getElementById('radarChart')
    let radLabels = ["CO", "NO2", "O3", "S02", "PM2.5", "PM10"]
    let matchedCity = response.filter(row => row.City == 'Denver');
    let match = matchedCity[0];
    let matchCO = Math.round(((match.CO/1000)/15.4)*100)
    //let matchNH3 = match.NH3
    //let matchNO = match.NO
    let matchNO2 = Math.round((match.NO2/649)*100)
    let matchO3 = Math.round((match.O3/204)*100)
    let matchSO2 = Math.round((match.SO2/304)*100)
    let matchPM25 = Math.round((match.PM25/150.4)*100)
    let matchPM10 = Math.round((match.PM10/354)*100)
    let matchData = []
    matchData.push(matchCO, matchNO2, matchO3, matchSO2, matchPM25, matchPM10)
    radChart = new Chart(radar, {
        type: 'radar',
        data: {
          labels: radLabels,
          datasets: [{
            label: `${selectedCity}`,
            data: matchData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        },
        options: {
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100
            }
          },
          elements: {
            line: {
              borderWidth: 5
            }
          },
          plugins: {
            legend: {
              display: false,
              position: "right"
            },
            title: {
              display: true,
              text: `${selectedCity} Pollution Component %`,
              font: {
                size: 28,
              }
            }
          },
          maintainAspectRatio : true,
          responsive: true
        }
    });
  }

  //Function to removed data
  function removeData(chart) {
    chart.data.labels.pop()
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }
  //Event handler to return city when circle marker is clicked
  function getData(){
    cityLayer.on("click", function(e) {
        var clickedLat = e.layer._latlng["lat"];
        var clickedLon = e.layer._latlng["lng"];
        var clickedCity = e.layer.options.id
        console.log(clickedCity);
        console.log(clickedLat);
        console.log(clickedLon);
        radChart.destroy();
        radarChart(`${clickedCity}`)
    })  
  };

  //Add event listener to each time city is selected
  cityLayer.on("click", getData());
  
});


