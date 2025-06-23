const mymap = L.map("mapid", {
  center: [9.29481, -68.98914],
  zoom: 12,
});

const stadiaMaps = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
).addTo(mymap);

let myIcon = L.icon({
  iconUrl: "img/white.png",
  iconSize: [40, 40],
  popupAnchor: [0, 0],
});

let clusterLayer = L.markerClusterGroup();

function dataToMap(geojson) {
  data = L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => {
      return L.marker(latlng, { icon: myIcon });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<strong>" +
          "Crop Type: " +
          "</strong>" +
          layer.feature.properties.cropType +
          "<br><hr>" +
          "<strong>Size: </strong>" +
          layer.feature.properties.farmSize +
          " ha" +
          "<br>" +
          "<strong>Notes: </strong>" +
          layer.feature.properties.notes
      );

      zoomToLayer(layer);
    },
  });

  clusterLayer.addLayer(data);
  clusterLayer.addTo(mymap);
}

// Zoom to layer funtionality
function zoomToLayer(layer) {
  layer.on({
    click: (e) => {
      clickedLayer = e.target;
      mymap.setView(clickedLayer.getLatLng(), 15);
      latlng = layer.getLatLng();
      turfPoint = turf.point([latlng.lng, latlng.lat]);

      buffer = turf.buffer(turfPoint, 0.2, { units: "kilometers" });

      //bbox= turf.bbox(buffer);
      //polygon = turf.bboxPolygon(bbox)

      let bufferLayer = L.geoJSON(buffer).addTo(mymap);
      mymap.fitBounds(bufferLayer.getBounds());
    },
  });
}

// Fecthing Data

function fecthData(url) {
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json(response);
      } else {
        throw new Error("fetch API could not fetch the data");
      }
    })

    .then((geojson) => {
      dataToMap(geojson);
    })

    .catch((error) => console.error("Error loading data:", error));
}

fecthData(
  "https://script.google.com/macros/s/AKfycbyE87DSm08fZ7YQQWlZBmPJx8B114c5Fo-ov4FtMLGxODPI5af1sdXm7i3gggj6kUN0/exec"
);
