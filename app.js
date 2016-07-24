var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var	swig = require('swig');
var http = require('http').Server(app);
var fs = require('fs');
var Datastore = require('nedb');
var ms = require('mediaserver');
var getFiles = require("./exts.js");
var io = require('socket.io')(http);

var db_audio = new Datastore({ filename: './db_audio', autoload: true });
var db_image = new Datastore({ filename: './db_image', autoload: true });
var db_video = new Datastore({ filename: './db_video', autoload: true });

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
	};
});

http.listen(1997, function(){
	console.log("Started listening on port " + 1997);
});
app.get('/', function(req,res){
	res.send(swig.renderFile('./templates/index.html'));
});
app.get('/play/:id',function(req,res){

	var aud = db_audio.find({_id: req.params.id}, function(err,docs){
    	// We replaced all the event handlers with a simple call to readStream.pipe()
    	ms.pipe(req,res,docs[0].path);
	});
});
io.on('connection', function (socket) {
  	db_audio.find({}).sort({ name: 1 }).exec(function (err, docs){
	  	for(var i = 0; i < docs.length; i++){
	  		socket.emit('audio', docs[i]);
	  	}
  });
});