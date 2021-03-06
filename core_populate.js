var iconMarkers = {};

// TODO: see above I got this bishhhh!!
function populateIcons(json) {
	// Iterate over each key and make the polygon on the map
	for(var key in json) {
		iconMarkers[key] = mark(json[key]["Primary Type"], json[key]["Description"], json[key]["Date"], json[key]["Arrest"], json[key]["Latitude"], json[key]["Longitude"]);
	}
}

window.addEventListener("load", function() {
	// Store 11/16 Crimes to localStorage
	var ajax2 = new XMLHttpRequest();
	ajax2.onload = function() {
		// Process the response text
		// var responseJSON2 = JSON.parse(ajax2.responseText);
		// DON'T POPULATE THE ICONS YET:
		// populateIcons(responseJSON2);
		// Store if localStorage API exists
		if( window.localStorage != undefined ) {
			window.localStorage.setItem("crime", ajax2.responseText);
		}
	};
	ajax2.open("GET", "/data/NOV2016.json", true);
	ajax2.send(null);
});

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
var arsonIcon = new CrimeIcon({iconUrl: 'imgs/arson.png'}),
    beerIcon = new CrimeIcon({iconUrl: 'imgs/beer.png'}),
    carIcon = new CrimeIcon({iconUrl: 'imgs/car.png'}),
    copIcon = new CrimeIcon({iconUrl: 'imgs/cop.png'}),
    drugsIcon = new CrimeIcon({iconUrl: 'imgs/drugs.png'}),
    footIcon = new CrimeIcon({iconUrl: 'imgs/foot.png'}),
    gambIcon = new CrimeIcon({iconUrl: 'imgs/gamb.png'}),
    gunsIcon = new CrimeIcon({iconUrl: 'imgs/guns.png'}),
    hitIcon = new CrimeIcon({iconUrl: 'imgs/hit.png'}),
    kidIcon = new CrimeIcon({iconUrl: 'imgs/kid.png'}),
    kissIcon = new CrimeIcon({iconUrl: 'imgs/kiss.png'}),
    murderIcon = new CrimeIcon({iconUrl: 'imgs/murder.png'}),
    peaceIcon = new CrimeIcon({iconUrl: 'imgs/peace.png'}),
    rapeIcon = new CrimeIcon({iconUrl: 'imgs/rape.png'}),
    theftIcon = new CrimeIcon({iconUrl: 'imgs/theft.png'});


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
		case 'ARSON':
			var ret = L.marker(crimePT, {icon: arsonIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#FF7000', 0.5); //orange
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'MOTOR VEHICLE THEFT':
			var ret = L.marker(crimePT, {icon: carIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#3EFF08', 0.3); //green
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'GAMBLING':
			var ret = L.marker(crimePT, {icon: gambIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#3EFF08', 0.3); //green
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'THEFT':
		case 'ROBBERY':
		case 'BURGLARY':
			var ret = L.marker(crimePT, {icon: theftIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#3EFF08', 0.3); //green
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'LIQUOR LAW VIOLATION':
			var ret = L.marker(crimePT, {icon: beerIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'INTERFERENCE WITH PUBLIC OFFICER':
			var ret = L.marker(crimePT, {icon: copIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'BATTERY':
		case 'INTIMIDATION':
		case 'OFFENSE INVOLVING CHILDREN':
			var ret = L.marker(crimePT, {icon: hitIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'HOMICIDE':
			var ret = L.marker(crimePT, {icon: murderIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'SEX OFFENSE':
		case 'CRIM SEXUAL ASSAULT':
		case 'STALKING':
			var ret = L.marker(crimePT, {icon: rapeIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'KIDNAPPING':
			var ret = L.marker(crimePT, {icon: kidIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'PROSTITUTION':
			var ret = L.marker(crimePT, {icon: kissIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'PUBLIC PEACE VIOLATION':
			var ret = L.marker(crimePT, {icon: peaceIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#E80C55', 0.7); //red
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'NARCOTICS':
			var ret = L.marker(crimePT, {icon: drugsIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#5C00FF', 0.4); //purple
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'CRIMINAL TRESPASS':
			var ret = L.marker(crimePT, {icon: footIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#5C00FF', 0.4); //purple
			circle.addTo(mymap);
			return [ret, circle];
			break
		case 'WEAPONS VIOLATION':
			var ret = L.marker(crimePT, {icon: gunsIcon}).addTo(mymap).bindPopup(descr);
			color(circle, '#5C00FF', 0.4); //purple
			circle.addTo(mymap);
			return [ret, circle];
			break
		default:
			var ret = L.marker(crimePT).addTo(mymap).bindPopup(descr);
			return [ret, circle];
	}
}
