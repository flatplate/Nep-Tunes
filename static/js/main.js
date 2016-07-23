var menuItems = ["Video", "Music", "Image"];
var subMenuMusic = ["artists", "albums", "songs", "playlists"];
var subMenuImage = ["albums", "images"];
var activeMenu = "music";

var socket = io();

var audios = [];
var videos = [];
var images = [];

var tdize = function(str){
	return '<td><div>' + str + '</div></td>';
}

socket.on('connect', function(){
	socket.emit('secretHandshake:P', {msg:'lololol'});
	console.log("connected");
});
socket.on('audio', function(obj){
	audios.push(obj);
	console.log("woohoo");
	$('#songs-music tr:last').after('<tr>'+ tdize(obj.name) + tdize(obj.album) + tdize(obj.path) + '</tr>'); 
    $("#songs-music").tablesorter(); 
    
});
socket.on('video', function(obj){
	videos.push(obj);
});
socket.on('image', function(obj){
	images.push(obj);
});

var subActive = {
	"music" : "artists",
	"image" : "albums"
}



$(document).ready(function(){
	$(".navs li").click(function(){
		$(".navs li").removeClass("active");
		$(this).addClass("active");
		$(".sub-menu div").removeClass("active");
		activeMenu = $.trim($(this).text());
	});
	$(".nav-but1").click(function(){
		$(".sub-menu-video").addClass("active");
	});
	$(".nav-but2").click(function(){
		$(".sub-menu-music").addClass("active");
	});
	$(".nav-but3").click(function(){
		$(".sub-menu-image").addClass("active");
	});
	$(".sub-menu-music li").click(function(){
		$(".sub-menu-music li").removeClass("cur");
		$(this).addClass("cur");
		subActive["music"] = $(this).text().toLowerCase();
		$(".sec").addClass("hidden");
		$(".sec-music-" + $(this).text().toLowerCase()).removeClass("hidden");
	});
	$(".sub-menu-image li").click(function(){
		$(".sub-menu-image li").removeClass("cur");
		$(this).addClass("cur");
		subActive["image"] = $(this).text(),toLowerCase();
	});
	$(".sub-menu-video li").click(function(){
		$(".sub-menu-video li").removeClass("cur");
		$(this).addClass("cur");
		
	});
});