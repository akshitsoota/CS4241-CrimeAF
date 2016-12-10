var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080

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
		case '/core_scroller.js':
			sendFile(res, 'core_scroller.js', 'application/javascript')
			break
		case '/styles.css':
			sendFile(res, 'styles.css', 'text/css')
			break
		case '/police_beats.json':
			sendFile(res, 'police_beats.json', 'application/json')
			break
		case '/imgs/theft.png':
			sendFile(res, 'imgs/theft.png', 'image')
			break
		case '/imgs/drugs.png':
			sendFile(res, 'imgs/drugs.png', 'image')
			break
		case '/imgs/arson.png':
			sendFile(res, 'imgs/arson.png', 'image')
			break
		case '/imgs/murder.png':
			sendFile(res, 'imgs/murder.png', 'image')
			break
		default:
			res.writeHead(404, {'Content-type': "text/html"})
			ret  = '<meta http-equiv="refresh" content="2;url=https://cs4241-fp-akshitsoota.herokuapp.com/" />';
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
