function tab_controller_load_crimes() {
	var scanInElement = null;
	if( $("#horizontal-tabholder").css("display") == "block" ) {
		scanInElement = document.getElementById("horizontal-tabholder");
	} else {
		scanInElement = document.getElementById("tabholder");
	}

	// Check if we should load 11/16 crimes
	if( !scanInElement.getElementsByClassName("tab selected")[0].hasAttribute("ajax-query") ) {
		// Reset map
		if( Object.keys(policeBeatPolygons).length != 0 ) {
			for(var key in policeBeatPolygons) {
				mymap.removeLayer(policeBeatPolygons[key]);
			}
			policeBeatPolygons = {}
		}
		if( Object.keys(iconMarkers).length == 0 ) {
			populateIcons(JSON.parse(localStorage.getItem("crime")))
		}
		// Update UI
		$("#timeline-scroll").css({"display": "none"});
		$("#timeline-time-tooltip").css({"display": "none"});
		$("#timeline-play").css({"display": "none"});
		$("#timeline-pause").css({"display": "none"});
		// 
		return;
	}
	// Else, proceed to show them all
	if( Object.keys(policeBeatPolygons).length == 0 ) {
		populatePoliceBeats(JSON.parse(localStorage.getItem("police_beats")));
	}
	if( Object.keys(iconMarkers).length != 0 ) {
		for(var key in iconMarkers) {
			mymap.removeLayer(iconMarkers[key][0]);
			mymap.removeLayer(iconMarkers[key][1]);
		}
		iconMarkers = {}
	}
	// Update UI
	$("#timeline-scroll").css({"display": "block"});
	$("#timeline-time-tooltip").css({"display": "block"});
	$("#timeline-play").css({"display": "block"});
	// Proceed to show the heatmap
	var type = scanInElement.getElementsByClassName("tab selected")[0].getAttribute("ajax-query");
	// Load the key-value pair with the respective crimes
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
		var value = last_seen_scroll_value;
		__maprender(1 + (value % 12), 2013 + parseInt(value / 12));
	};
	ajax2.open("GET", "/get?type=" + type, true);
	ajax2.send(null);
}

function tab_controller_switch_tab_to(index) {
	// Stop playing if it is playing
	playback_control_pause();
	// Update UI
	for(var idx = 0; idx < document.getElementById("horizontal-tabholder").getElementsByClassName("tab").length; idx++) {
		if(idx != index) { 
			document.getElementById("horizontal-tabholder").getElementsByClassName("tab")[idx].setAttribute("class", "tab unselected");
			document.getElementById("tabholder").getElementsByClassName("tab")[idx].setAttribute("class", "tab unselected");
		} else { 
			document.getElementById("horizontal-tabholder").getElementsByClassName("tab")[idx].setAttribute("class", "tab selected");
			document.getElementById("tabholder").getElementsByClassName("tab")[idx].setAttribute("class", "tab selected");
		}
	}
	// Fetch the new crimes and update
	tab_controller_load_crimes();
}
