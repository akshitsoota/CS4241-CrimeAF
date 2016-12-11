//var mymap = null;
var iconMarkers = {};

function populateIcons(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		iconMarkers[key] = L.polygon(json[key], {
			color: 'transparent',
		    fillColor: 'black', //getRandomColor(),
		    fillOpacity: 0.5,
		}).addTo(mymap);
	}
	// TODO: populate map parsing json into markers like the cool kids
//	mark("THEFT", "$500 AND UNDER", "ALLEY", "False", 41.914403235, -87.719130719);
//	mark("NARCOTICS", "POSS: HEROIN(WHITE)", "SIDEWALK", "True", 41.883960232, -87.728217573);
//	mark("ARSON", "AGRAVATED", "SCHOOL, PUBLIC, BUILDING", "False", 41.729756954, -87.65559428);
//	mark("HOMICIDE", "FIRST DEGREE MURDER", "STAIRWELL", "False", 41.897430484, -87.766701942);
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
		radius: 500
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

window.onload = function() {
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
