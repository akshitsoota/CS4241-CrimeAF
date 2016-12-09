var mymap = null;
var policeBeatPolygons = {};

function populatePoliceBeats(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		policeBeatPolygons[key] = L.polygon(json[key], {
			color: 'transparent',
		    fillColor: '#00ff00',
		    fillOpacity: 0.5,
		}).addTo(mymap);
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
};