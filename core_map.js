var mymap = null;
var policeBeatPolygons = {};
var crimeCountByBeat = {};

function populatePoliceBeats(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		policeBeatPolygons[key] = L.polygon(json[key], {
			color: 'transparent',
		    fillColor: '#7F0000',
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
	    minZoom: 10,
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
	// Load the key-value pair with all the crimes
	var ajax2 = new XMLHttpRequest();
	ajax2.onload = function() {
		// Save the key-value pair
		crimeCountByBeat = JSON.parse(ajax2.responseText);
		// Iterate over and add all zeros if certain key doesn't exist
		for(var month = 1; month <= 12; month++) {
			for(var year = 2013; year <= 2016; year++) {
				if( month == 12 && year == 2016 ) continue;

				var formation = ((month > 9 ? "" : "0") + month + "_" + year);
				if( !crimeCountByBeat.hasOwnProperty(formation) ) {
					var emptyList = [];
					for(var item in crimeCountByBeat["__beatordering"])
						emptyList.push(0.1);
					crimeCountByBeat[formation] = emptyList;
				}
			}
		}
		// Load the latest
		__maprender(1, 2013);
	};
	ajax2.open("GET", "/get?type=all", true);
	ajax2.send(null);
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