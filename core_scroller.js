var month_mapping = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var year_mapping = ["2013", "2014", "2015", "2016"];

var last_seen_scroll_value = 0;
var playback_scrolling_timer_id = -1;

$(function(){
	// Setup the Timeline scroller
	$("#timeline-scroll").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 46,
		value: 0,
		slide: function( event, ui ) {
			playback_control_onslide(ui);
			playback_control_pause();
			playback_control_maprender();
		}
	});
	// Scroller setup
	$("#timeline-scroll").height((document.body.offsetHeight - 190) + "px");
	document.getElementById("timeline-time-tooltip").style.left = (document.getElementById("timeline-scroll").offsetLeft + document.getElementById("timeline-scroll").offsetWidth + 15) + "px";
	$("#timeline-time-tooltip").text(month_mapping[0] + ", " + year_mapping[0]);

	// Calculate top
	var top = 85 + parseInt((46 - last_seen_scroll_value) * ((document.body.offsetHeight - 190) / 46));
	document.getElementById("timeline-time-tooltip").style.top = top + "px";

	// Add click listeners to the play and pause buttons
	$("#timeline-play").click(function() {
		playback_control_start();
	});
	$("#timeline-pause").click(function() {
		playback_control_pause();
	});
});

$(window).resize(function() {
	// Scroller setup
	$("#timeline-scroll").height((document.body.offsetHeight - 190) + "px");
	document.getElementById("timeline-time-tooltip").style.left = (document.getElementById("timeline-scroll").offsetLeft + document.getElementById("timeline-scroll").offsetWidth + 15) + "px";
	// Calculate top
	var top = 85 + parseInt((46 - last_seen_scroll_value) * ((document.body.offsetHeight - 190) / 46));
	document.getElementById("timeline-time-tooltip").style.top = top + "px";
});

function playback_control_start() {
	// Check if we're at the top
	if( $("#timeline-scroll").slider("value") == 46 ) {
		$("#timeline-scroll").slider("value", 0);
		playback_control_onslide();
	}
	// Change the UI and create the timer
	$("#timeline-play").css({'display': 'none'});
	$("#timeline-pause").css({'display': 'block'});

	playback_scrolling_timer_id = window.setInterval(playback_control_scroll_up, 150);
}

function playback_control_scroll_up() {
	// Check for end condition
	if( $("#timeline-scroll").slider("value") == 46 ) {
		// Reached the upper bound
		playback_control_pause();
	}
	// Else, scroll through
	$("#timeline-scroll").slider("value", $("#timeline-scroll").slider("value") + 1);
	playback_control_onslide();
	// Map render
	playback_control_maprender();
}

function playback_control_maprender() {
	// Render on the map
	var beatOrdering = crimeCountByBeat["__beatordering"];
	var month = ($("#timeline-scroll").slider("value") % 12) + 1;
	var year = parseInt($("#timeline-scroll").slider("value") / 12) + 2013;
	var keyFormation = ((month > 9 ? "" : "0") + month + "_" + year);
	var values = crimeCountByBeat[keyFormation];

	for(var idx = 0; idx < beatOrdering.length; idx++) {
		policeBeatPolygons[beatOrdering[idx]].setStyle({fillOpacity: values[idx]});
	}
}

function __maprender(month, year) {
	// Render on the map
	var beatOrdering = crimeCountByBeat["__beatordering"];
	var keyFormation = ((month > 9 ? "" : "0") + month + "_" + year);
	var values = crimeCountByBeat[keyFormation];

	for(var idx = 0; idx < beatOrdering.length; idx++) {
		policeBeatPolygons[beatOrdering[idx]].setStyle({fillOpacity: values[idx]});
	}
}

function playback_control_onslide(ui) {
	// Check for value
	var value = $("#timeline-scroll").slider("value");
	if( ui != undefined ) value = ui.value;
	// Process the tooltip movement
	var top = 85 + parseInt((46 - value) * ((document.body.offsetHeight - 190) / 46));
	var text = month_mapping[value % 12] + ", " + year_mapping[parseInt(value / 12)];

	$("#timeline-time-tooltip").css({'top': top + "px"});
	$("#timeline-time-tooltip").text(text);
	// Save state
	last_seen_scroll_value = value;
	// Update the map UI
	playback_control_maprender();
}

function playback_control_pause() {
	// Change the UI and cancel the timer
	$("#timeline-play").css({'display': 'block'});
	$("#timeline-pause").css({'display': 'none'});

	window.clearInterval(playback_scrolling_timer_id);
}
