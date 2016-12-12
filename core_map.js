var mymap = null;
var policeBeatPolygons = {};
var iconMarkers = {};


function populatePoliceBeats(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		policeBeatPolygons[key] = L.polygon(json[key], {
			color: 'transparent',
		    fillColor: '#dc322f', //getRandomColor(),
		    fillOpacity: 0.5,
		}).addTo(mymap);
	}
	// TODO: populate map parsing json into markers like the cool kids
	mark("THEFT", "$500 AND UNDER", "ALLEY", "False", 41.914403235, -87.719130719);
	mark("NARCOTICS", "POSS: HEROIN(WHITE)", "SIDEWALK", "True", 41.883960232, -87.728217573);
	mark("ARSON", "AGRAVATED", "SCHOOL, PUBLIC, BUILDING", "False", 41.729756954, -87.65559428);
	mark("HOMICIDE", "FIRST DEGREE MURDER", "STAIRWELL", "False", 41.897430484, -87.766701942);
}

// TODO: see above I got this bishhhh!!
function populateIcons(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		iconMarkers[key] = mark(json[key]["Primary Type"], json[key]["Description"], json[key]["Date"], json[key]["Arrest"], json[key]["Latitude"], json[key]["Longitude"]);
	}
}


window.onload = function() {
	// Load the LeafletJS Map
	mymap = L.map('mapid').setView([41.83866957879685, -87.67467498779297], 11);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'jograpes.2an7km5n',
	    accessToken: 'pk.eyJ1Ijoiam9ncmFwZXMiLCJhIjoiY2l3Z25iOHV5MDE3ZzJ6cG8xZzRsODFkdSJ9.H5EJQCq5TlSyrgkhGxlIfw'
	}).addTo(mymap);
	// Check localStorage for the police beats
	if( localStorage != undefined && localStorage.hasOwnProperty("police_beats") ) {
		// Load the police beats from the local storage
		populatePoliceBeats(JSON.parse(localStorage.getItem("police_beats")))
	} else {
		// Use AJAX to get the police beats
		var ajax = new XMLHttpRequest();
		ajax.onload = function() {
			// Process the response text
			var responseJSON = JSON.parse(ajax.responseText);
			populatePoliceBeats(responseJSON);
			// Store if localStorage API exists
			if( localStorage != undefined ) {
				localStorage.setItem("police_beats", ajax.responseText);
			}
		};
		ajax.open("GET", "police_beats.json", true);
		ajax.send(null);
	}
	// Check localStorage for the police beats
	if( localStorage != undefined && localStorage.hasOwnProperty("arson") ) {
		// Load the police beats from the local storage
		populateIcons(JSON.parse(localStorage.getItem("arson")))
	} else {
		// Use AJAX to get the police beats
		var ajax = new XMLHttpRequest();
		ajax.onload = function() {
			// Process the response text
			var responseJSON = JSON.parse(ajax.responseText);
			populateIcons(responseJSON);
			// Store if localStorage API exists
			if( localStorage != undefined ) {
				localStorage.setItem("arson", ajax.responseText);
			}
		};
		ajax.open("GET", "data/ARSON.json", true);
		ajax.send(null);
	}
};

// STACKOVEFLOW REFERENCE: http://stackoverflow.com/a/1484514
// Function generate random colors for cool map polygon colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// create Icon class for crimes
var CrimeIcon = L.Icon.extend({
    options: {
	// shadowUrl: 'leaf-shadow.png',
	iconSize:     [30, 30],
	//shadowSize:   [50, 64],
	//iconAnchor:   [22, 94],
	iconAnchor:   [30, 30],
	//shadowAnchor: [4, 62],
	//popupAnchor:  [-3, -76]
	popupAnchor:  [0, -46]
    }
});

// map icon types to images
// var theftIcon = new CrimeIcon({iconUrl: 'theft.png'}) // will need server switch for local
// http://www.iemoji.com/#?category=objects&version=9&theme=appl&skintone=default
var theftIcon = new CrimeIcon({iconUrl: 'imgs/theft.png'}),
    drugsIcon = new CrimeIcon({iconUrl: 'imgs/drugs.png'}),
    arsonIcon = new CrimeIcon({iconUrl: 'imgs/arson.png'}),
    murderIcon = new CrimeIcon({iconUrl: 'imgs/murder.png'});

// color object ex: (ojbName '#4B1BDE' 0.7)
function color(thing, colo, op){
	thing.setStyle({
	    color: colo,
	    fillColor: colo,
	    fillOpacity: op,
	});
}

// mark the map given the json data
function mark(descr1, descr2, ldescr, arrboo, geo1, geo2){
	var crimePT = [geo1, geo2]; //might need to rem "s: nawh
	var descr = "<b>" + descr1 + "</br>";
	descr += "<br>Description: " + descr2;
	descr += "<br>Location: " + ldescr;
	descr += "<br>Arrest Made: " + arrboo;
	var circle = L.circle(crimePT, {
		color: 'black',
		fillColor: '#f03',
		fillOpacity: 0.1,
		radius: 50
	});
	switch(descr1){ // next data E8C600
		case 'THEFT':
			L.marker(crimePT, {icon: theftIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#3EFF08', 0.3); //green
			circle.addTo(mymap);
			break
		case 'ARSON':
			L.marker(crimePT, {icon: arsonIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#FF7000', 0.5); //orange
			circle.addTo(mymap);
			break
		case 'HOMICIDE':
			L.marker(crimePT, {icon: murderIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			break
		case 'NARCOTICS':
			L.marker(crimePT, {icon: drugsIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#5C00FF', 0.4); //purple
			circle.addTo(mymap);
			break
		default:
			L.marker(crimePT).addTo(mymap).bindPopup(descr);
	}
}
