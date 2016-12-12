//var mymap = null;
var iconMarkers = {};

function populateIcons(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		iconMarkers[key] = mark(json[key]["Primary Type"], json[key]["Description"], json[key]["Date"], json[key]["Arrest"], json[key]["Latitude"], json[key]["Longitude"]);
	}
}

// mark the map given the json data
function mark(type, descr, ldescr, arrest, geo1, geo2){
	var crimePT = [geo1, geo2]; //might need to rem "s: nawh
	var descr = "<b>" + type + "</br>";
	descr += "<br>Description: " + descr;
	descr += "<br>Location: " + ldescr;
	descr += "<br>Arrest Made: " + arrest;
	var circle = L.circle(crimePT, {
		color: 'black',
		fillColor: '#f03',
		fillOpacity: 0.1,
		radius: 500
	});
	switch(type){ // next data E8C600
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

window.onload = function() {
		mymap = L.map('mapid').setView([41.83866957879685, -87.67467498779297], 11);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'jograpes.2an7km5n',
	    accessToken: 'pk.eyJ1Ijoiam9ncmFwZXMiLCJhIjoiY2l3Z25iOHV5MDE3ZzJ6cG8xZzRsODFkdSJ9.H5EJQCq5TlSyrgkhGxlIfw'
	}).addTo(mymap);
	// Check localStorage for arson
	if( localStorage != undefined && localStorage.hasOwnProperty("arson") ) {
		// Load arson from the local storage
		populateIcons(JSON.parse(localStorage.getItem("arson")))
	} else {
		// Use AJAX to recieve arson
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

// create Icon class for crimes
var CrimeIcon = L.Icon.extend({ options: { // shadowUrl: 'leaf-shadow.png',
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

//function setBeatColor(beat){
//	// count crime types and set colors accordingly
//	switch(beat.descr){ // next data E8C600
//		case 'THEFT':
//	    		beat.setStyle({fillColor: '#3EFF08'}); //green
//			break
//		case 'ARSON':
//			color(circle, '#FF7000', 0.5); //orange
//	    		beat.setStyle({fillColor: '#3EFF08'}); //green
//			break
//		case 'HOMICIDE':
//			color(circle, '#E80C55', 0.7); //red
//			break
//		case 'NARCOTICS':
//			color(circle, '#5C00FF', 0.4); //purple
//			break
//		default:
//			L.marker(crimePT).addTo(mymap).bindPopup(descr);
//	}
//}
