var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , qs = require('querystring')
  , port = 8080

var MAX_OPACITY = 0.95
var MIN_OPACITY = 0.1
var NUMBER_OF_BEATS = 277

var server = http.createServer (function (req, res) {
	var uri = url.parse(req.url)

	switch( uri.pathname ) {
		case '/':    
		case '/index.html':
			sendFile(res, 'index.html')
			break
		case '/core_map.js':
			sendFile(res, 'core_map.js', 'application/javascript')
			break
		case '/core_populate.js':
			sendFile(res, 'core_populate.js', 'application/javascript')
			break
		case '/core_scroller.js':
			sendFile(res, 'core_scroller.js', 'application/javascript')
			break
		case '/styles.css':
			sendFile(res, 'styles.css', 'text/css')
			break
		case '/NOV112016.json':
			sendFile(res, 'NOV112016.json', 'application/json')
			break
		case '/police_beats.json':
			sendFile(res, 'police_beats.json', 'application/json')
			break
		case '/imgs/city.png':
			sendFile(res, 'imgs/city.png', 'image/png')
			break
		case '/imgs/arson.png':
			sendFile(res, 'imgs/arson.png', 'image/png')
			break
		case '/imgs/beer.png':
			sendFile(res, 'imgs/beer.png', 'image/png')
			break
		case '/imgs/car.png':
			sendFile(res, 'imgs/car.png', 'image/png')
			break
		case '/imgs/cop.png':
			sendFile(res, 'imgs/cop.png', 'image/png')
			break
		case '/imgs/drugs.png':
			sendFile(res, 'imgs/drugs.png', 'image/png')
			break
		case '/imgs/foot.png':
			sendFile(res, 'imgs/foot.png', 'image/png')
			break
		case '/imgs/gamb.png':
			sendFile(res, 'imgs/gamb.png', 'image/png')
			break
		case '/imgs/guns.png':
			sendFile(res, 'imgs/guns.png', 'image/png')
			break
		case '/imgs/hit.png':
			sendFile(res, 'imgs/hit.png', 'image/png')
			break
		case '/imgs/kid.png':
			sendFile(res, 'imgs/kid.png', 'image/png')
			break
		case '/imgs/kiss.png':
			sendFile(res, 'imgs/kiss.png', 'image/png')
			break
		case '/imgs/murder.png':
			sendFile(res, 'imgs/murder.png', 'image/png')
			break
		case '/imgs/peace.png':
			sendFile(res, 'imgs/peace.png', 'image/png')
			break
		case '/imgs/rape.png':
			sendFile(res, 'imgs/rape.png', 'image/png')
			break
		case '/imgs/theft.png':
			sendFile(res, 'imgs/theft.png', 'image/png')
			break
		case '/styles.css':
			sendFile(res, 'styles.css', 'text/css')
			break
		case '/play.png':
			sendFile(res, 'play.png', 'image/png')
			break
		case '/pause.png':
			sendFile(res, 'pause.png', 'image/png')
			break
		case '/get':
			processCrimeData(res, uri, 'application/json')
			break
		default:
			res.writeHead(404, {'Content-type': "text/html"})
			ret  = '<meta http-equiv="refresh" content="2;url=https://cs4241-fp-ankitkumarr.herokuapp.com/" />';
			ret += '<h3>404 - File not found :(</h3>'
			res.end(ret)
	}
})

server.listen(process.env.PORT || port)
console.log(port)

function sendFile(res, filename, contentType) {
	contentType = contentType || 'text/html'

	fs.readFile(filename, function(error, content) {
		res.writeHead(200, {'Content-type': contentType})
		res.end(content, 'utf-8')
	})
}

//Process the query if the Crime JSON is asked
function processCrimeData(res,uri, contentType) {
	if (uri.query) {
		var parsed = qs.parse(uri.query)
		if (parsed.type!=null) {
			getProcessedJSON(res, parsed, contentType)
		}

		else {
			res.end('incorrect query')
		}

	}
	else {
		res.end('no query provided')
	}
}

function getProcessedJSON (res, parsed, contentType) {
	//If all of the crime info is requested
	if (parsed.type == 'all') {
		var allCrimeJSON = getBeatSizeInitialJSON();
		fs.readdir('data/BeatJSONData/', function(err, filenames) {
			if (err) {
				console.log(err);
				return
			}
			filenames.forEach(function(filename) {
				var contents = fs.readFileSync('data/BeatJSONData/' + filename);
				var jsonContent = JSON.parse(contents);
				for (var key in jsonContent) {
					if (jsonContent.hasOwnProperty(key)) {
						if (key!="__beatordering") {
							allCrimeJSON[key] = addListToList(allCrimeJSON[key], jsonContent[key])
						}
						else {
							allCrimeJSON[key] = jsonContent[key].slice()
						}
					}
				}
			})

			for (var key in allCrimeJSON) {
				if (allCrimeJSON.hasOwnProperty(key)) {
					if (key!="__beatordering") {
						allCrimeJSON[key] = relativeValueOfList(allCrimeJSON[key])
					}
				
				}
			}
			res.writeHead(200, {'Content-type': contentType})
			res.end(JSON.stringify(allCrimeJSON))
		})
	}

	else {
		var crimeJSON = {}
		if(!fs.existsSync('data/BeatJSONData/' + parsed.type + '.json')) {
			res.writeHead(200, {'Content-type': contentType})
			res.end(JSON.stringify(crimeJSON))
		}

		else {
			var contents = fs.readFileSync('data/BeatJSONData/' + parsed.type + '.json')
			crimeJSON = JSON.parse(contents)
			for (var key in crimeJSON) {
				if (crimeJSON.hasOwnProperty(key)) {
					if (key!="__beatordering") {
						crimeJSON[key] = relativeValueOfList(crimeJSON[key])
					}
				
				}
			}
			res.writeHead(200, {'Content-type': contentType})
			res.end(JSON.stringify(crimeJSON))
		}
	}
}

//Finds the relative value of list specified by max and min opacitites
function relativeValueOfList(listToRelate) {
	var max = -1
	var newList = []
	for (var i = 0; i < listToRelate.length; i++) {
		if(listToRelate[i] > max) {
			max = listToRelate[i]
		}
	}
	for (var i = 0; i < listToRelate.length; i++) {
		newList.push(Math.round(((((MAX_OPACITY-MIN_OPACITY)*listToRelate[i])/max)+ MIN_OPACITY)*100)/100)
	}
	return newList
}


//Add list2 iterms to list1 and return list1
function addListToList(list1, list2) {
	for(var i = 0; i < list1.length; i++) {
		list1[i] = list1[i] + list2[i]
	}
	return list1
}


//Makes a JSON will all the required keys and values as list of 0s
function getBeatSizeInitialJSON() {
		var allCrimeJSON = {}
		var beatSizeList = []
		for (var i = 0; i < NUMBER_OF_BEATS; i++) {
			beatSizeList.push(0)
		}
		allCrimeJSON["__beatordering"] = []
		//Initialize the JSON to have all the proper keys
		for (var i = 2013; i <=2016; i++) {
			var jLimit = 12
			if (i == 2016){
				jLimit = 11
			}
			for (var j = 1; j <=jLimit; j++) {
				if (j > 9) {
					var key = (j.toString() + "_" + i.toString());
				}
				else {
					var key = ("0" + j.toString() + "_" + i.toString());
				}
				allCrimeJSON[key] = beatSizeList.slice();
			}
		}
		return allCrimeJSON
}


	

