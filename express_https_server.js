var express = require('express');
var bodyParser = require('body-parser'); 
var basicAuth = require('basic-auth-connect');
var https = require('https'); 
var http = require('http'); 
var fs = require('fs'); 
var url = require('url'); 
var app = express(); 
var ROOT_DIR = './html/';

var options = { 
    host: '127.0.0.1', 
    key: fs.readFileSync('ssl/server.key'), 
    cert: fs.readFileSync('ssl/server.crt') 
}; 

var auth = basicAuth(function(user, pass) {
	return(( user === 'cs360')&&(pass == 'test'));
    });

http.createServer(app).listen(process.argv[2]); 
https.createServer(options, app).listen(443); 
app.get('/', function (req, res) { 
	res.send("It Works, BOYS."); 
    });
app.use('/', express.static(ROOT_DIR, {maxAge: 60*60*1000}));

app.get('/CS360/getcity', function (req, res) {
	var urlObj = url.parse(req.url, true, false);
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
	    res.json(jsonresult);
	    });
    });

app.get('/CS360/comment', function (req, res) {
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
					res.json(itemArr);
				    });
			    });
		    });
	    });
    });
app.post('/CS360/comment', auth, function(req, res) {
	console.log("POST!!!");
	var jsonData = "";
	req.on('data', function (chunk) {
		jsonData += chunk;
	    });
	req.on('end', function () {
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
	res.send("");
	});