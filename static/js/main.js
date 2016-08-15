var menuItems = ["Video", "Music", "Image"];
var subMenuMusic = ["artists", "albums", "songs", "playlists"];
var subMenuImage = ["albums", "images"];
var activeMenu = "music";

var socket = io();

var debug = true;

var audios = [];
var videos = [];
var images = [];
var albums = [];

var doneAud = false;
var doneVid = false;
var doneImg = false;

curr_ids = [];

var tdize = function(str){
    return '<td><div>' + str + '</div></td>';
}
var updateUIAlbums = function(albumList){

}
socket.on('connect', function(){
    socket.emit('secretHandshake:P', {msg:'lololol'});
    console.log("connected");
    $('.neptune').css('filter', 'hue-rotate(0deg)');
    $('.nav').css('filter', 'hue-rotate(0deg)');
    $('.sub-menu').css('filter', 'hue-rotate(0deg)');
    $('.bot-bar').css('filter', 'hue-rotate(0deg)');
});
socket.on('disconnect', function(){
    console.log("disconnected");
    $('tbody').empty();
    curr_ids = [];
    $('.neptune').css('filter', 'hue-rotate(155deg)');
    $('.nav').css('filter', 'hue-rotate(155deg)');
    $('.sub-menu').css('filter', 'hue-rotate(155deg)');
    $('.bot-bar').css('filter', 'hue-rotate(145deg)');
});
socket.on('audio', function(obj){
    audios.push(obj);
    if(debug){
	console.log("woohoo");
    }
    curr_ids.push(obj._id);
    $('#songs-music > tbody').append('<tr class="roww" id="' + obj._id + '">'+ tdize(obj.title) + tdize(obj.album) + tdize(obj.artist.join(", ")) + tdize(obj.year)+ tdize(obj.genre.join(", ")) + tdize(Math.floor(obj.duration/60).toString() +":" + (obj.duration%60).toString()) +  '</tr>');  
});
socket.on('video', function(obj){
    videos.push(obj);
});
socket.on('video_done', function(){
    doneVid = true;
});
socket.on('image', function(obj){
    images.push(obj);
});
socket.on('image_done', function(){
    doneImg = true;
});
socket.on('set_audio', function(aud){

});
function toggle_play(obj){
    if(obj.hasClass('fa-play')){
	obj.removeClass('fa-play');
	obj.addClass('fa-pause');
    }
    else{
	obj.removeClass('fa-pause');
	obj.addClass('fa-play');
    };
}
function aud_src_changed(idd){
    $("tbody tr").removeClass('cur_song');
    $("#" + idd).addClass('cur_song');
}
var subActive = {
    "music" : "artists",
    "image" : "albums"
}

var shuffle = false;
var repeat = false;

$(document).ready(function(){
    var audio = $('audio').get(0);

    $(".navs li").click(function(){
	$(".navs li").removeClass("active");
	$(this).addClass("active");
	$(".sub-menu div").removeClass("active");
	activeMenu = $.trim($(this).text()).toLowerCase();
	$(".sec").addClass("hidden");
	$(".sec-"+ activeMenu + "-" + subActive[activeMenu]).removeClass("hidden");
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
	subActive["image"] = $(this).text().toLowerCase();
	$(".sec").addClass("hidden");
	$(".sec-images-" + $(this).text().toLowerCase()).removeClass("hidden");
    });
    $(".sub-menu-video li").click(function(){
	$(".sub-menu-video li").removeClass("cur");
	$(this).addClass("cur");
	
    });
    $("thead  th").click(function(){
	var ind = $(this).prevAll().length; 
	curr_ids = table_sorter.sort($(this).closest('table'), ind);
    });
    $(document).on('click', "tbody tr" ,function(){
	console.log("asdf madafaka");
	audElem = $("audio")[0];
	audElem.setAttribute('src', '/play/' + $(this).attr('id'));
	audElem.setAttribute('autoplay', 'autoplay');
	aud_src_changed($(this).attr('id'));
    });
    $(audio).bind('timeupdate', function() {
	$("#sld").attr('max', audio.duration);
	$("#sld").val(audio.currentTime);
	console.log(typeof(audio.currentTime));
    });
    $("#sld").change(function(){
	console.log($(this).val());
	audio.currentTime = $(this).val();
    });
    $(document).on('click', '.fa-play', function(){
	
	audio.play();
	
    });
    audio.onplay = function(){
	toggle_play($(".fa-play"));
    }
    audio.onpause = function(){
	toggle_play($(".fa-pause"));
    }
    $(document).on('click', '.fa-pause', function(){
	audio.pause();
    });
    $(".fa-backward").click(function(){
	audio.currentTime = Math.max(0, audio.currentTime - 5);
    });
    $(".fa-forward").click(function(){
	audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    });
    $(".fa-step-backward").click(function(){
	audio.currentTime = 0;
    });
    $(".fa-step-forward").click(function(){
	audio.currentTime = audio.duration;
    });
    $(".fa-random").click(function(){
	$(this).toggleClass('shiny');
	shuffle = !shuffle;
    });
    $(".fa-repeat").click(function(){
	$(this).toggleClass('shiny');
	repeat = !repeat;
	audio.loop = repeat;
    });
    audio.onended = function(){
	if(shuffle){
	    var idd = curr_ids[Math.floor(Math.random()*curr_ids.length)]
	    $(audio).attr('src',"/play/" + idd);
	    aud_src_changed(idd);
	}
	else{
	    var idd = $(audio).attr('src').split("/")[$(audio).attr('src').split("/").length-1];
	    var next_idd = curr_ids[(curr_ids.indexOf(idd)+1)%curr_ids.length];		
	    $(audio).attr('src',"/play/" + next_idd);
	    aud_src_changed(next_idd);
	};
    }
});
