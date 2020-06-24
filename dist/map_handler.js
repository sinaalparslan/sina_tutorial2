var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});
var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
var center = ol.proj.fromLonLat([32, 39]);
var view = new ol.View({
  center: center,
  zoom: 10
});
var map = new ol.Map({
    target: 'map',
    view: view,
    layers: [layer]
});

var vectorSource = new ol.source.Vector({
        url:"/api/data",
        format: new ol.format.GeoJSON({ featureProjection: "EPSG:4326" })  
});

var stroke = new ol.style.Stroke({color: 'black', width: 2});
var fill = new ol.style.Fill({color: 'red'});

var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke,
          points: 4,
          radius: 10,
          angle: Math.PI / 4
        })
      })

});

map.addLayer(markerVectorLayer);
var select = new ol.interaction.Select({multiple:false});
select.on('select', fnHandler);
map.addInteraction(select);
map.on("click",handleMapClick);
function handleMapClick(evt)
{
  var coord=ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  document.getElementById("Latitude").value=coord[1];
  document.getElementById("Longitude").value=coord[0];
}

function fnHandler(e)
{
    var coord = e.mapBrowserEvent.coordinate;
    let features = e.target.getFeatures();
    features.forEach( (feature) => {
        console.log(feature.getProperties().tree_type);
    
    document.getElementById("tree_type").value=feature.getProperties().tree_type;
    });
    if (e.selected[0])
    {
    var coords=ol.proj.transform(e.selected[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
    document.getElementById("Latitude").value=coords[1];
    document.getElementById("Longitude").value=coords[0];
    console.log(coords);
    }
}

function submit()
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var data=JSON.stringify({

        Latitude: document.getElementById('Latitude').value,
        Longitude: document.getElementById('Longitude').value,
        tree_type: document.getElementById('tree_type').value
    });
    xhr.send(data);
    location.reload();
}

