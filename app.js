var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var	swig = require('swig');
var http = require('http').Server(app);
var fs = require('fs');
var Datastore = require('nedb');
var getFiles = require("./exts.js");
var io = require('socket.io')(http);

var db_audio = new Datastore({ filename: './db_audio', autoload: true });
var db_image = new Datastore({ filename: './db_image', autoload: true });
var db_video = new Datastore({ filename: './db_video', autoload: true });

//TODO: use ffmpeg to get data from audio files
//TODO: don't fuck up the database, make filepath unique

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

db_audio.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});
db_video.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});
db_image.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});

getFiles.find("C:\\", function(type, file, name){
	if(type === "audio"){
		var doc = {
			'path' 		: file,
			'name'		: name.split(".")[0],
			'album' 	: file.split("\\")[file.split("\\").length - 2]
		} 
		db_audio.insert(doc, function(err){
			console.log(err);
		});
		console.log(doc);
	};
});

http.listen(1997, function(){
	console.log("Started listening on port " + 1997);
});
app.get('/', function(req,res){
	res.send(swig.renderFile('./templates/index.html'));
});
io.on('connection', function (socket) {
	console.log("dayum");
  var audios = db_audio.find({}, function(err,docs){
  	for(var i = 0; i < docs.length; i++){
  		socket.emit('audio', docs[i]);
  	}
  });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});