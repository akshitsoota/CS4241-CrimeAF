var mymap = null;
var policeBeatPolygons = {};
var crimeCountByBeat = {};
var splashCheckerTimerID = null;

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
	    zoomControl: true,
	    id: 'jograpes.2an7km5n',
	    accessToken: 'pk.eyJ1Ijoiam9ncmFwZXMiLCJhIjoiY2l3Z25iOHV5MDE3ZzJ6cG8xZzRsODFkdSJ9.H5EJQCq5TlSyrgkhGxlIfw'
	}).addTo(mymap);
	// Set Zoom Control location
	mymap.zoomControl.setPosition('bottomright');
	// Clear out the localStorage
	window.localStorage.clear();
	// Load policeBeats and store to localStorage
	var ajax = new XMLHttpRequest();
	ajax.onload = function() {
		// Process the response text
		var responseJSON = JSON.parse(ajax.responseText);
		populatePoliceBeats(responseJSON);
		// Store if localStorage API exists
		if( window.localStorage != undefined ) {
			window.localStorage.setItem("police_beats", ajax.responseText);
		}
	};
	ajax.open("GET", "/data/police_beats.json", true);
	ajax.send(null);
	// Similarly run AJAX for all tabs out there
	for(var idx = 0; idx < document.getElementById("tabholder").getElementsByClassName("tab").length; idx++) {
		if( !document.getElementById("tabholder").getElementsByClassName("tab")[idx].hasAttribute("ajax-query") )
			continue
		// Extract the ajax-query if existant
		var type = document.getElementById("tabholder").getElementsByClassName("tab")[idx].getAttribute("ajax-query");
		// Load the key-value pair with the respective crimes
		(function(staticType) {
			var ajax2 = new XMLHttpRequest();
			// Set the AJAX onLoad function
			ajax2.onload = function() {
				// Save the key-value pair
				var ajaxProcessed = JSON.parse(ajax2.responseText);
				// Iterate over and add all zeros if certain key doesn't exist
				for(var month = 1; month <= 12; month++) {
					for(var year = 2013; year <= 2016; year++) {
						if( month == 12 && year == 2016 ) continue;

						var formation = ((month > 9 ? "" : "0") + month + "_" + year);
						if( !ajaxProcessed.hasOwnProperty(formation) ) {
							var emptyList = [];
							for(var item in ajaxProcessed["__beatordering"])
								emptyList.push(0.1);
							ajaxProcessed[formation] = emptyList;
						}
					}
				}
				// Fill it in localStorage
				window.localStorage["crimes_by_type__" + staticType] = ajaxProcessed;
			};
			ajax2.open("GET", "/get?type=" + staticType, true);
			ajax2.send(null);
		})(type);
	}
	
	// Setup click listeners
	for(var idx = 0; idx < document.getElementById("tabholder").getElementsByClassName("tab").length; idx++) {
		(function(index) {
			document.getElementById("tabholder").getElementsByClassName("tab")[index].addEventListener("click", function(){
				tab_controller_switch_tab_to(index);
			});

			document.getElementById("horizontal-tabholder").getElementsByClassName("tab")[index].addEventListener("click", function(){
				tab_controller_switch_tab_to(index);
			});
		})(idx);
	}

	// Spawn off timer to check for all the keys in localStorage
	splashCheckerTimerID = window.setInterval(function() {
		var checkFor = ["police_beats", "crime", "crimes_by_type__all", "crimes_by_type__BURGLARY", "crimes_by_type__ROBBERY", "crimes_by_type__THEFT", "crimes_by_type__NARCOTICS"];
		var hasAll = true;
		for( var idx = 0; idx < checkFor.length; idx++ ) {
			hasAll = hasAll && window.localStorage.hasOwnProperty(checkFor[idx]);
		}
		// Check for hasAll
		if(hasAll) {
			$("#loadingsplash").css({"display": "none"});
			window.clearInterval(splashCheckerTimerID);
			// Load the key-value pair with all the crimes
			tab_controller_load_crimes();
		}
	}, 100);
};

function __maprender(month, year) {
	// Render on the map
	var beatOrdering = crimeCountByBeat["__beatordering"];
	var keyFormation = ((month > 9 ? "" : "0") + month + "_" + year);
	var values = crimeCountByBeat[keyFormation];

	for(var idx = 0; idx < beatOrdering.length; idx++) {
		policeBeatPolygons[beatOrdering[idx]].setStyle({fillOpacity: values[idx]});
	}
}

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
