var month_mapping = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var year_mapping = ["2013", "2014", "2015", "2016"];

<<<<<<< Updated upstream
=======
var last_seen_scroll_value = 0;

>>>>>>> Stashed changes
$(function(){
	// Setup the Timeline scroller
	$("#timeline-scroll").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
<<<<<<< Updated upstream
		max: 47,
		value: 0,
		slide: function( event, ui ) {
			var top = 85 + parseInt((47 - ui.value) * ((document.body.offsetHeight - 150) / 47));
=======
		max: 46,
		value: 0,
		slide: function( event, ui ) {
			var top = 85 + parseInt((46 - ui.value) * ((document.body.offsetHeight - 150) / 46));
>>>>>>> Stashed changes
			var text = month_mapping[ui.value % 12] + ", " + year_mapping[parseInt(ui.value / 12)];

			$("#timeline-time-tooltip").css({'top': top + "px"});
			$("#timeline-time-tooltip").text(text);
<<<<<<< Updated upstream
=======
			// Save state
			last_seen_scroll_value = ui.value;
>>>>>>> Stashed changes
		}
	});
	// Scroller setup
	$("#timeline-scroll").height((document.body.offsetHeight - 150) + "px");
	document.getElementById("timeline-time-tooltip").style.left = (document.getElementById("timeline-scroll").offsetLeft + document.getElementById("timeline-scroll").offsetWidth + 15) + "px";
	document.getElementById("timeline-time-tooltip").style.top = (document.body.offsetHeight - 65) + "px";
	$("#timeline-time-tooltip").text(month_mapping[0] + ", " + year_mapping[0]);
});

$(window).resize(function() {
	// Scroller setup
	$("#timeline-scroll").height((document.body.offsetHeight - 150) + "px");
	document.getElementById("timeline-time-tooltip").style.left = (document.getElementById("timeline-scroll").offsetLeft + document.getElementById("timeline-scroll").offsetWidth + 15) + "px";
<<<<<<< Updated upstream
	document.getElementById("timeline-time-tooltip").style.top = (document.body.offsetHeight - 65) + "px";
=======
	// Calculate top
	var top = 85 + parseInt((46 - last_seen_scroll_value) * ((document.body.offsetHeight - 150) / 46));
	document.getElementById("timeline-time-tooltip").style.top = top + "px";
>>>>>>> Stashed changes
});