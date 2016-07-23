var fs		=	require('fs');
var path	=	require('path');

var ext = {
	video : [
		".mpg",
		".mpeg",
		".avi",
		".wmv",
		".mov",
		".flv",
		".ogg",
		".webm",
		".mp4"
	],
	audio : [
		".flac",
		".mid",
		".midi",
		".wma",
		".aac",
		".wav",
		".ogg",
		".mp3",
	]
}

var bannedDirs = [
	"C:\\Program Files (x86)",
	"C:\\Program Files",
	"C:\\ProgramData",
	"C:\\$WINDOWS.~BT",
	"C:\\Riot Games",
	"C:\\Intel",
	"C:\\PerfLogs",
	"C:\\Python27",
	"C:\\Riot Games",
	"C:\\sqlite3",
	"C:\\Windows",
	"C:\\Windows.old",
	"C:\\Windows10Upgrade",
	"AndroidStudioProjects",
	"AppData",
	"GitHub",
	"Visual Studio 2013"
];


var fromDir = function(startPath, callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
    	try{
	        var filename=path.join(startPath,files[i]);
	        var stat = fs.lstatSync(filename);
	        if (stat.isDirectory() && bannedDirs.indexOf(filename) === -1 && bannedDirs.indexOf(files[i]) === -1&& files[i][0] !="."){
	  //      	console.log(filename + bannedDirs.indexOf(filename));
	        
	            fromDir(filename, callback); //recurse

	        }
	        else if (ext.video.indexOf(path.extname(filename))>-1) {
	            console.log('-- found video: ',filename);
	            callback("video", filename, files[i]);
	        }
	        else if (ext.audio.indexOf(path.extname(filename))>-1) {
	            console.log('-- found music: ',filename);
	//            console.log(typeof(callback));
	//            console.log(callback);
	            callback("audio", filename, files[i]);
	        }
	        else{
	  //      	console.log(path.extname(filename));
	        };
    	}
    	catch(err){
    //		console.log(err);
    	}
    };
};

var getAsync = function(startPath, callback){
	setTimeout(function(){
		fromDir(startPath, callback);
	}, -1);
};
exports.find = getAsync;