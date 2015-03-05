var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true, false);
    fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
	    if (err) {
	    response.writeHead(404);
	    response.end(JSON.stringify(err));
	    return;
	}
	response.writeHead(200);
	response.end(data);
	});
    }).listen(process.argv[2]);

/*
var options = {
    hostname: 'localhost',
    port: '9001',
    path: '/index.html'
};

function handleResponse(response) {
    var serverData = '';
    response.on('data', function (chunk) {
	    serverData += chunk;    	
	});
    response.on('end', function () {
	    console.log(serverData);
	});
}

http.request(options, function(response) {
    handleResponse(response);
    }).end();
*/