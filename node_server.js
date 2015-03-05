var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true, false);
    
    if(urlObj.pathname.indexOf("getcity") !=-1){
        var myRe = new RegExp("^" + urlObj.query["q"]);
        fs.readFile(ROOT_DIR + 'CS360/cities.dat.txt', function (err, data) {
            if(err) throw err;
            var jsonresult = [];
            console.log(myRe);
            if(myRe != "/^/") { 
                cities = data.toString().split("\n");
                for(var i=0; i < cities.length; i++) {
                    var result = cities[i].search(myRe);
                    if(result != -1) {
                        jsonresult.push({city:cities[i]});
                    }
                }
            }
            response.writeHead(200);
            response.end(JSON.stringify(jsonresult));
        });
    } else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
            if (err) {
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
        }
        response.writeHead(200);
        response.end(data);
        });
    }
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