
/**
*42、平台设置编辑接口
*接口地址：http://域名/operator/configSystem/edit
*/
var platformObj = {
	initRequst:function(initData,callback){
		$.ajax({
            url: location.origin + "/customer/configSystem/findSiteConfig",
            type: "post",
            data: JSON.stringify(initData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
				errorToken(data.code);
                if (data.code == 0) {	
                	$("#webName").attr("configId",data.data.list[0].configId);
                	platformObj.showInfo(data.data.list[0].configValue);
                	callback&&callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
	},
	showInfo:function(obj){
		$("#webName").val(obj.name);
		$("#keyWords").val(obj.key);
		$("#webDesc").val(obj.desc);
		$("#pigeon_btn").attr("orderBy",obj.pigeon.orderBy);
		$("#race_btn").attr("orderBy",obj.race.orderBy);
		$("#oneloft_btn").attr("orderBy",obj.oneloft.orderBy);
	},
	setPlatform:function(setData){
		$.ajax({
            url: location.origin + "/operator/configSystem/edit",
            type: "post",
            data: JSON.stringify(setData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
				errorToken(data.code);
                if (data.code == 0) {	
                	myAlert.createBox("保存成功！");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
	}
}
var initData = {};
platformObj.initRequst(initData, function(){
	$("#sortSet").find("button").eq(0).trigger("click");
})


//排序设置
$("#sortSet button").on("click",function(){
	$("#sortSet button").removeClass("active");
	$("#orderbyCheck").find("input[type=radio]").prop("checked",false);
	var orderBy = $(this).attr("orderBy")||"";
	var _index = $(this).index();
	$(this).addClass("active");
	$("#checkUl li").hide();
	$("#checkUl li").eq(_index).show();
	$("#checkUl li").eq(_index).find("input[type=radio]").prop("checked",false);
	$("#checkUl li").eq(_index).find("input[orderby="+orderBy+"]").prop("checked",true);
})

$("#checkUl li").find("input[type=radio]").on("change",function(){
	var _index = $(this).closest("li").index();
	$("#sortSet button").eq(_index).attr("orderBy",$(this).attr("orderby"));
})



$("#save_btn").on("click",function(){
	var setData = {
			"configId":$("#webName").attr("configId"),  //"配置项编号", 
			"configCategory": "platform",
			"configValue": {
				"name": $("#webName").val(),
				"key": $("#keyWords").val(),
				"desc": $("#webDesc").val(),
				"pigeon":{
					"orderBy":$("#pigeon_btn").attr("orderBy"),
					"filter":[]
				},
				"race":{
					"orderBy":$("#race_btn").attr("orderBy"),
					"filter":[]
				},
				"oneloft":{
					"orderBy":$("#oneloft_btn").attr("orderBy"),
					"filter":[]
				}
				
			}
		}
	platformObj.setPlatform(setData);
});