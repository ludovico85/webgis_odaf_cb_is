// intial map settings
var mymap = L.map('map',
	{
	zoomControl:false,//custom zoom control
	minZoom: 10,
    maxZoom: 18,
	//maxBounds: [[41.15, 13], [42.5, 15]],
}).setView([41.63451,14.05214], 12);

// custom zoom control
L.control.zoom({
    position:'topright'// default is topleft
}).addTo(mymap);

L.control.scale().addTo(mymap); // add scale bar

// custom full screen control
mymap.addControl(new L.Control.Fullscreen({
	position:'topright'
}));

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

var baseMaps = {
	"OpenStreetMap HOT": OpenStreetMap_HOT,
	"Esri World Imagery": Esri_WorldImagery,
};

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
var groupedOverlays = {
	"PIT7120132":{
		'<i class="fas fa-square" style="color:red"></i> IT7120132':IT7120132,
	},
	"IT7212121":{
		'<i class="fas fa-square" style="color:blue"></i> IT7212121':IT7212121,
	},
	"IT7212128":{
		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> IT7212128':IT7212128,
	},
	"PNLAM":{
		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> PNLAM':PNLAM,
	},
	"limite_comunale":{
		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> limite_comunale':limite_comunale,
	}
};

// function for controlling the behaviour of the control.layers
if(window.screen.width <=767) {
	var isCollapsed = true;
} else {
	var isCollapsed = false;
};

console.log(isCollapsed)
console.log(window.screen.width)

//L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(mymap);
L.control.groupedLayers(baseMaps, groupedOverlays, {collapsed: isCollapsed}).addTo(mymap);

// geolocator
var lc = L.control
  .locate({
    position: "topright",
    strings: {
      title: "Show me where I am, yo!"
    }
  })
  .addTo(mymap);