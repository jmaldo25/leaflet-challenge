// Creating map
var myMap = L.map("map", {
  center: [38.89511, -77.03637],
  zoom: 6
});

// Creating gray mapbox background
L.titleLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geoJSON data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// var geojson;

// Getting data with D3
d3.json(geoData, function(data) {
  // Creating function for style of earthquake data
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // Creating function to determine color of marker based on magnitude og earthquake
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  // Creating function to determine radius of each earthquake based on magnitude
  // Also accounting for magnitude of 0 earthquakes
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  L.geoJson(data, {
    pointToLayer: function (feature, latlong) {
      return L.circleMaker(latlong);
    },
    style: styleInfo,

    // Binding a pop up for each layer
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
    }
  }).addTo(myMap);

  // Adding legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    // Creating function to create div for legend
    var div = L.DomUtil.create('div', 'info legend'),
    // Including magnitude var
    grades = [0, 1, 2, 3, 4, 5];

    // Creating legend label
    div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

    // Create loop that will creat label for magnitude intesity
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        // HTML code to account for spaces and dashes
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // Add legend to map
  legend.addTo(myMap);
});