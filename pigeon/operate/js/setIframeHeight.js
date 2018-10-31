if(window.attachEvent) {
	window.attachEvent("onload", function(){setIframeHeight();});
}else if (window.addEventListener) {
	window.addEventListener("load", function(){setIframeHeight();}, false);
}else {
	window.onload = function(){setIframeHeight();}
}
   

function setIframeHeight() {
	var topHeight;
	top.document.getElementById("pageContent").height = '592px';  
	topHeight = document.body.scrollHeight + "px";   
	top.document.getElementById("pageContent").height = topHeight;
}