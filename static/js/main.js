$(document).ready(function(){
	$(".navs li").click(function(){
		$(".navs li").removeClass("active");
		$(this).addClass("active");
		$(".sub-menu div").removeClass("active");
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
	});
	$(".sub-menu-image li").click(function(){
		$(".sub-menu-image li").removeClass("cur");
		$(this).addClass("cur");
	});
	$(".sub-menu-video li").click(function(){
		$(".sub-menu-video li").removeClass("cur");
		$(this).addClass("cur");
	});
});