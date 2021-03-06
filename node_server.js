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
    } else if (urlObj.pathname.indexOf("comment") != -1) {
	console.log("comment route");
		//Create RUD
		if(request.method == "POST") {
			console.log("POST!!!");
			var jsonData = "";
			request.on('data', function (chunk) {
				jsonData += chunk;
			});
			request.on('end', function () {
				var reqObj = JSON.parse(jsonData);
				console.log(reqObj);
				console.log("Name: " + reqObj.Name);
				console.log("Comment: " + reqObj.Comment);
				
				//Put the JSON in the Database
				var MongoClient = require('mongodb').MongoClient;
				MongoClient.connect("mongodb://weatherAdmin:dang3rous@localhost/weather", function(err, db) {
					if(err) throw err;
					db.collection('comments').insert(reqObj, function(err, records) {
						console.log("Record added as " + records[0]._id);
					});
				});
			});
					
		response.writeHead(200);
		response.end("");
		
		} else if (request.method == "GET"){
			console.log("GET!!");
			
			var MongoClient = require('mongodb').MongoClient;
			MongoClient.connect("mongodb://weatherAdmin:dang3rous@localhost/weather", function(err, db) {
				if(err) throw err;
				
				db.collection("comments", function(err, comments){
					if(err) throw err;
					comments.find(function(err, items){
						items.toArray(function(err, itemArr){
							console.log("Document Array: ");
							console.log(itemArr);
							response.writeHead(200);
							response.end(JSON.stringify(itemArr));
						});
					});
				});
			});
 		}   
    }else {
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
console.log("Server created, listening on port: " + process.argv[2]);
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