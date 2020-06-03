

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

var myMap = L.map("map", {
  center: [38.7258, -90.4522],
  zoom: 5
}); 

// Create the map layer
 L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v9",
    accessToken: API_KEY
  }).addTo(myMap);

 //Create the marker size based on earthquake size
 function markerSize(mag){
  return mag * 20000
 }

  function markerColor(mag){
   return mag > 5 ? "#913d00":
       mag > 4.5 ? "#a54500":
       mag > 4 ? "#b94d00":
       mag > 3.5 ? "#cc5500":
       mag > 3 ? "#e05e00":
                   "#f36600";
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Upon response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
  function onEachFeature(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake  
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>" + feature.properties.mag + "</p>"
      );
  }
  function pointToLayer(feature, latlng) {
    return L.circle(latlng, {
        fillOpacity: 0.75,
        color: "#000",
        weight: 0.8,
        fillColor:markerColor(feature.properties.mag),
        radius: markerSize(feature.properties.mag)
})}


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  earthquakes.addTo(myMap);
}
