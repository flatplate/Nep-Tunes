var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var	swig = require('swig');
var http = require('http').Server(app);
var fs = require('fs');
var Datastore = require('nedb');
var db_audio = new Datastore({ filename: './db_audio', autoload: true });
var db_image = new Datastore({ filename: './db_image', autoload: true });
var db_video = new Datastore({ filename: './db_video', autoload: true });

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var dir;

fs.readdir("C:\\", function(err,files){
	dir = files;
});

http.listen(1997, function(){
	console.log("Started listening on port " + 1997);
});
app.get('/', function(req,res){
	res.send(swig.renderFile('./templates/index.html'));
});