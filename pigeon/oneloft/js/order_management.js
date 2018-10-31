
//切换状态
$("#order_tit span").on("click",function(){
	$("#order_tit span").removeClass("active");
	$(this).addClass("active");
	var _index = $(this).index();
	$("#list_cont>div").hide();
	$("#list_cont>div").eq(_index).show();
})