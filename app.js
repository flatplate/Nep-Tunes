
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var http = require('http').Server(app);
var fs = require('fs');
var Datastore = require('nedb');
var ms = require('mediaserver');
var getFiles = require("./exts.js");
var io = require('socket.io')(http);
var mm = require('musicmetadata');

var db_audio 		= new Datastore({ filename: './db_audio', autoload: true });
var db_image 		= new Datastore({ filename: './db_image', autoload: true });
var db_video 		= new Datastore({ filename: './db_video', autoload: true });
var db_playlist 	= new Datastore({ filename: './db_playlist', autoload: true });

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

db_audio.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});
db_video.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});
db_image.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
});

getFiles.find("/home/ural/", function(type, file, name){
    if(type === "audio"){
	var parser = mm(fs.createReadStream(file), {duration: true}, function (err, tags) {
	    if (err) throw err;
	    if(tags.artist.length === 0){tags.artist = ["Unknown Artist"]};
	    if(tags.genre.length === 0){tags.genre = ["Unknown Genre"]};
	    if(tags.album == ""){tags.album = "Unknown Album"};
	    if(tags.year == ""){tags.year = "Unknown Year"};
	    console.log(tags);
	    var doc = {
		'path' 		: file,
		'title'		: file.split("/")[file.split("/").length - 1],
		'album'         : tags.album,
		'artist'        : tags.artist,
		'year'          : tags.year,
		'genre'         : tags.genre,
		'duration'      : tags.duration
	    };
	    db_audio.insert(doc, function(err){
		if(err){
		    if(err.errorType == 'uniqueViolated'){
			console.log("asdf");
			db_audio.update({path : doc.path}, doc, {}, function(err, numReplaced){
			    if(!err){
				console.log("replaced object");
			    }
			});
		    }
		}
	    });
	});
	
    }
    else if(type === "video"){
	var doc = {
	    'path' 		: file,
	    'name'		: name.split(".")[0],
	    'album' 	: file.split("/")[file.split("/").length - 2]
	} 
	db_video.insert(doc, function(err){
	    console.log(err);
	});
    }
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
    console.log("socket io connection ");
    db_audio.find({}).sort({ name: 1 }).exec(function (err, docs){
	for(var i = 0; i < docs.length; i++){
	    try {
		fs.accessSync(docs[i].path, fs.F_OK);
		console.log("sending audio");
		socket.emit('audio', docs[i]);
		console.log(docs[i]);
		// Do something
	    } catch (e) {

		console.log("error:");
		console.log(e);
		
		db_audio.remove({ _id: docs[i]._id }, {}, function (err, numRemoved) {
		    // numRemoved = 1
		});
		// It isn't accessible
	    }
	}
	
	socket.emit('audio_done');
    });
    db_video.find({}).sort({ name: 1 }).exec(function (err, docs){
	for(var i = 0; i < docs.length; i++){
	    socket.emit('video', docs[i]);
	    console.log("sending video");
	}
	socket.emit('video_done');
    });
    db_image.find({}).sort({ name: 1 }).exec(function (err, docs){
	for(var i = 0; i < docs.length; i++){
	    socket.emit('image', docs[i]);
	    console.log("sending image");
	}
	socket.emit('image_done');
    });
});





