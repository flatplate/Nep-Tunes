var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var	swig = require('swig');
var http = require('http').Server(app);

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

http.listen(1997, function(){
	console.log("Started listening on port " + config.port);
});