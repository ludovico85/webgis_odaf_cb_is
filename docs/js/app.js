// intial map settings
var mymap = L.map('map',
	{
	zoomControl:false,//custom zoom control
	minZoom: 10,
    maxZoom: 20,
	//maxBounds: [[41.15, 13], [42.5, 15]],
}).setView([41.63451,14.05214], 12);

// custom zoom control
L.control.zoom({
    position:'topleft'// default is topleft
}).addTo(mymap);

L.control.scale({position: 'bottomright'}).addTo(mymap); // add scale bar

// custom full screen control
mymap.addControl(new L.Control.Fullscreen({
	position:'topleft'
}));

L.control.browserPrint().addTo(mymap);// stampa
mymap.on("browser-print-start", function(e){
				/*on print start we already have a print map and we can create new control and add it to the print map to be able to print custom information */
				L.control.scale({position: 'bottomright'}).addTo(e.printMap);
			});

// LEAFLET DRAW
// Generate popup content based on layer type
// - Returns HTML string, or null if unknown object
var getPopupContent = function(layer) {
// Marker - add lat/long
if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
	return strLatLng(layer.getLatLng());
// Circle - lat/long, radius
	} else if (layer instanceof L.Circle) {
	var center = layer.getLatLng(),
	radius = layer.getRadius();
	return "Center: "+strLatLng(center)+"<br />"+"Radius: "+_round(radius, 2)+" m";
 // Rectangle/Polygon - area
	} else if (layer instanceof L.Polygon) {
	var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
	area = L.GeometryUtil.geodesicArea(latlngs);
	return "Area: "+L.GeometryUtil.readableArea(area, true);
// Polyline - distance
	} else if (layer instanceof L.Polyline) {
		var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
		distance = 0;
		if (latlngs.length < 2) {
			return "Distance: N/A";
		} else {
			for (var i = 0; i < latlngs.length-1; i++) {
				distance += latlngs[i].distanceTo(latlngs[i+1]);
			}
			return "Distance: "+_round(distance, 2)+" m";
		}
	}
	return null;
};

var drawnItems = new L.FeatureGroup();
     mymap.addLayer(drawnItems);
     var drawControl = new L.Control.Draw({
     	// position: 'topright',
		     	draw: {
		    polygon: {
		     shapeOptions: {
		      color: 'purple'
		     },
		     allowIntersection: false,
		     drawError: {
		      color: 'orange',
		      timeout: 1000
		     },
		    },
		    polyline: {
		     shapeOptions: {
		      color: 'red'
		     },
		    },
		    rect: {
		     shapeOptions: {
		      color: 'green'
		     },
		    },
		    circle: {
		     shapeOptions: {
		      color: 'steelblue'
		     },
		    },
		   },
         edit: {
             featureGroup: drawnItems
         }
     });
     mymap.addControl(drawControl);
      mymap.on('draw:created', function (e) {
            var type = e.layerType,
            layer = e.layer;
			var content = getPopupContent(layer);
			if (content !== null) {
				layer.bindPopup(content);
			};
            drawnItems.addLayer(layer);
        });
// Generate popup content based on layer type
// - Returns HTML string, or null if unknown object
var getPopupContent = function(layer) {
// Marker - add lat/long
if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
	return strLatLng(layer.getLatLng());
// Circle - lat/long, radius
	} else if (layer instanceof L.Circle) {
	var center = layer.getLatLng(),
	radius = layer.getRadius();
	return "Center: "+strLatLng(center)+"<br />"+"Radius: "+_round(radius, 2)+" m";
 // Rectangle/Polygon - area
	} else if (layer instanceof L.Polygon) {
	var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
	area = L.GeometryUtil.geodesicArea(latlngs);
	return "Area: "+L.GeometryUtil.readableArea(area, true);
// Polyline - distance
	} else if (layer instanceof L.Polyline) {
		var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
		distance = 0;
		if (latlngs.length < 2) {
			return "Distance: N/A";
		} else {
			for (var i = 0; i < latlngs.length-1; i++) {
				distance += latlngs[i].distanceTo(latlngs[i+1]);
			}
			return "Distance: "+_round(distance, 2)+" m";
		}
	}
	return null;
};
//FINE LEAFLET DRAW

// custom attribution
mymap.attributionControl.addAttribution('Realizzato da <a style="color:#0096FF;" href="https://www.linkedin.com/in/ludovicofrate/" target="_blank"> Ludovico Frate</a>');

// loading some basemaps
//var IGM = L.tileLayer('https://ludovico85.github.io/custom_XYZ_tiles/IGM_cisav/{z}/{x}/{-y}.png', {
//    tms: true,
//	opacity: 1,
//	attribution: '<a href="https://github.com/ludovico85/custom_XYZ_tiles">IGM</a>'
//});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(mymap);


var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

$("#base1").click(function() {
	mymap.addLayer(OpenStreetMap_HOT)
	mymap.removeLayer(Esri_WorldImagery)
});
$("#base2").click(function() {
	mymap.addLayer(Esri_WorldImagery)
	mymap.addLayer(OpenStreetMap_HOT)
});


// INIZIO WMS CATASTO
var ETRS89width= 18.99-5.93;
var startResolution = ETRS89width/1024;
var grid_resolution = new Array(22);
for (var i = 0; i < 22; ++i) {
	grid_resolution[i] = startResolution / Math.pow(2, i);
}
var crs_6706 = new L.Proj.CRS('EPSG:6706',
	'+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
	{
		resolutions: grid_resolution,
		origin: [0, 0],
		bounds: L.bounds([5.93, 34.76], [18.99, 47.1])
	});


var wmsLayer_1 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: ['province', 'CP.CadastralZoning'],
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});

var wmsLayer_2 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: ['CP.CadastralParcel'],
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});

var wmsLayer_3 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: 'fabbricati',
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});

var wmsLayer_4 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: 'strade',
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});

var wmsLayer_5 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: 'acque',
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});

var wmsLayer_6 = L.tileLayer.wms('https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', {
    layers: 'vestizioni',
    crs: crs_6706,
	format: 'image/png',
    maxZoom: 21,
    transparent: true,
	attribution: '© ' + '<a href="https://creativecommons.org/licenses/by/4.0/deed.it">Agenzia delle Entrate</a>',
});
// FINE WMS CATASTO
// LAYER PER LEGENDA CUSTOM
window.option1 = wmsLayer_1;
window.option2 = wmsLayer_2;
window.option3 = wmsLayer_3;
window.option4 = wmsLayer_4;
window.option5 = wmsLayer_5;
window.option6 = wmsLayer_6;
// FINE LAYER PER LEGENDA CUSTOM

// INIZIO SELETTORE OPACITA'
/*/ selettore opacità /*/
function updateOpacity1(value) {
wmsLayer_2.setOpacity(value);
};

var slider1 = document.getElementById("range1");
var output1 = document.getElementById("value1");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
}
// FINE SELETTORE OPACITA'

$("input").click(function(event){
	layerClicked = window[event.target.value];
	if (mymap.hasLayer(layerClicked)) {
		mymap.removeLayer(layerClicked);
	}
	else {
		mymap.addLayer(layerClicked);
	}
});


// Rimuovi l'attributo checked dal checkbox 3elemento all'avvio della pagina
$(document).ready(function() {
	$('#base1').prop('checked', false);
	$('#base2').prop('checked', true);
	$('#1elemento').prop('checked', false);
	$('#2elemento').prop('checked', false);
	$('#3elemento').prop('checked', false);
	$('#4elemento').prop('checked', false);
	$('#5elemento').prop('checked', false);
	$('#6elemento').prop('checked', false);
});





// loading geoJson
// custom icon for poi acquedotto
var custom_icon = new L.ExtraMarkers.icon ({
	icon: 'fa-tint',
	prefix: 'fa',
	shape: 'circle',
	markerColor: 'orange-dark'
});

// function for categorized symbols
// presidio
function tipologia_style(feature, latlng) {
	switch(feature.properties["tipologia"]){
		case "Parking":
			var parkingIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-parking',
				prefix: 'fas',
    		markerColor: 'cyan',
			});
			return L.marker(latlng, {icon: parkingIcon});
		case "Food":
			var foodIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-utensils',
				prefix: 'fas',
    		markerColor: 'blue-dark',
			});
			return L.marker(latlng, {icon: foodIcon});
		};
	};
	
// filter  point based on tipologia attribute
//var punti_parking = new L.geoJson(punti, {
//	filter: function (feature, layer) {
//	return (feature.properties.tipologia === "Parking")},
//	pointToLayer: tipologia_style,
//	style: tipologia_style,
//	onEachFeature: function (feature, layer) {
//	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.denominazione+'</td></tr><tr><tr class="text-center"><td colspan="2"><a href="'+feature.properties.indicazioni+'" class="btn btn-primary btn-sm" role="button" target="_blank">Ottieni indicazioni stradali</a></td></tr></tbody></table>')}
//}).addTo(mymap);
//
//var punti_food = new L.geoJson(punti, {
//	filter: function (feature, layer) {
//	return (feature.properties.tipologia === "Food")},
//	pointToLayer: tipologia_style,
//	style: tipologia_style,
//	onEachFeature: function (feature, layer) {
//	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.denominazione+'</td></tr><tr><tr class="text-center"><td colspan="2"><a href="'+feature.properties.indicazioni+'" class="btn btn-primary btn-sm" role="button" target="_blank">Ottieni indicazioni stradali</a></td></tr></tbody></table>')}
//}).addTo(mymap);

// load confini
var IT7120132 = new L.geoJson(IT7120132, {
	weight: 2,
	lineCap: 'round',
	fillColor: 'red',
	color: 'red',
	fillOpacity: 0.1,
}).addTo(mymap);


var IT7212121 = new L.geoJson(IT7212121, {
	weight: 2,
	lineCap: 'round',
	color: 'blue',
	fillColor: 'blue',
	fillOpacity: 0.1,
}).addTo(mymap);


var IT7212128 = new L.geoJson(IT7212128, {
	weight: 6,
	lineCap: 'round',
	color: 'green',
	fillOpacity: 0.1,
}).addTo(mymap);


var PNLAM = new L.geoJson(PNLAM, {
	weight: 6,
	lineCap: 'round',
	color: 'orange',
	fillOpacity: 0.1
}).addTo(mymap);


var limite_comunale = new L.geoJson(limite_comunale, {
	weight: 1,
	lineCap: 'round',
	color: 'yellow',
	fillOpacity: 0.0
}).addTo(mymap);


// create overlaymaps for L.control.layers with custom icons
//var overlayMaps = {
//    '<img src = ico/fontane.png width="25px">Fontane': cisav_fontane,
//    '<img src = ico/sorgenti.png width="25px">Sorgenti': cisav_sorgenti,
//		'<img src = ico/corso_acqua.png width="25px">Corsi d&#8217acqua':cisav_corso_acqua,
//		'<img src = ico/opere_idrauliche.png width="25px">Opere idrauliche':cisav_opere_idrauliche,
//		'<img src = ico/poi.png width="25px">POI Acquedotto romano di Venafro':poi_acquedotto,
//};

// create grouped overlaymaps for L.control.groupedLayers with custom icons
//var groupedOverlays = {
//	"PIT7120132":{
//		'<i class="fas fa-square" style="color:red"></i> IT7120132':IT7120132,
//	},
//	"IT7212121":{
//		'<i class="fas fa-square" style="color:blue"></i> IT7212121':IT7212121,
//	},
//	"IT7212128":{
//		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> IT7212128':IT7212128,
//	},
//	"PNLAM":{
//		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> PNLAM':PNLAM,
//	},
//	"limite_comunale":{
//		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> limite_comunale':limite_comunale,
//	},
//	"limite_comunale":{
//		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> limite_comunale':wmsLayer_5,
//	}
//};



// function for controlling the behaviour of the control.layers
//if(window.screen.width <=767) {
//	var isCollapsed = true;
//} else {
//	var isCollapsed = false;
//};

//console.log(isCollapsed)
//console.log(window.screen.width)



// geolocator
//var lc = L.control
//  .locate({
//    position: "topright",
//    strings: {
//      title: "Show me where I am, yo!"
//    }
//  })
//  .addTo(mymap);