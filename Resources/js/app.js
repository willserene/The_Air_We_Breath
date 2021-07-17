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
        }).bindPopup("<h6>" + response[i].City + "</h6> <hr> <p>AQI: " + response[i].AQI + "</p>")
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

    //setTimeout(function(){ map.invalidateSize()}, 400);
});


