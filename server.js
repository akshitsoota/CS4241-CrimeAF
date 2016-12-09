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
		case '/style.css':
		sendFile(res, 'style.css', 'text/css')
		break
		case '/chi.geojson':
		sendFile(res, 'chi.geojson', 'text/javascript')
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
