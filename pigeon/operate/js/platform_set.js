/**
 *23、读取平台设置接口
 *接口地址：http://域名/customer/configSystem/findSiteConfig
 *客户端
 */
var platformObj = {
    initRequst: function(initData, callback) {
        $.ajax({
            url: location.origin + "/customer/configSystem/findSiteConfig",
            type: "post",
            data: JSON.stringify(initData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    $("#webName").attr("configId", data.data.list[0].configId);
                    platformObj.showInfo(data.data.list[0].configValue);
                    //platformObj.showSelect(data.data.list[0].configValue);
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    showInfo: function(obj) {
        $("#webName").val(obj.name);
        $("#keyWords").val(obj.key);
        $("#webDesc").val(obj.desc);
        $("#pigeon_btn").attr("orderBy", obj.pigeon.orderBy);
        $("#race_btn").attr("orderBy", obj.race.orderBy);
        $("#oneloft_btn").attr("orderBy", obj.oneloft.orderBy);
    },
    showSelect: function(obj) { //还不确定
        var filters = obj.pigeon.filter;
        var ancestry = filter.ancestry; //血统
        var distance = filter.distance; //距离
        var features = filter.features; //特征
        platformObj.findInArr($(".j_ancestry dd"), ancestry);
        platformObj.findInArr($(".j_distance dd"), distance);
        platformObj.findInArr($(".j_features dd"), features);
    },
    findInArr: function(targetDomArr, arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < targetDomArr.length; j++) {
                if (arr[i] == targetDomArr[j].text()) {
                    targetDomArr[j].find("input").prop("checked", true);
                }
            }
        }
    },
    /**
     *42、平台设置编辑接口
     *接口地址：http://域名/operator/configSystem/edit
     */
    setPlatform: function(setData) {
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
                } else {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
}
var initData = {};
platformObj.initRequst(initData, function() {
    $("#sortSet").find("button").eq(0).trigger("click");
    $("#select_box").find("li").eq(0).trigger("click");
})


//排序设置
$("#sortSet button").on("click", function() {
    $("#sortSet button").removeClass("active");
    $("#orderbyCheck").find("input[type=radio]").prop("checked", false);
    var orderBy = $(this).attr("orderBy") || "";
    var _index = $(this).index();
    $(this).addClass("active");
    $("#checkUl li").hide();
    $("#checkUl li").eq(_index).show();
    $("#checkUl li").eq(_index).find("input[type=radio]").prop("checked", false);
    $("#checkUl li").eq(_index).find("input[orderby=" + orderBy + "]").prop("checked", true);
})

$("#checkUl li").find("input[type=radio]").on("change", function() {
    var _index = $(this).closest("li").index();
    $("#sortSet button").eq(_index).attr("orderBy", $(this).attr("orderby"));
});
//获取筛选条件
function getSelect(domArr) {
    var arr = [];
    domArr.each(function(i) {
        if (domArr.eq(i).find("input").prop("checked")) {
            arr.push(domArr.eq(i).find("b").text());
        }
    });
    return arr;
}
//条件筛选
$("#select_box li").on("click", function() {
    $("#select_box li").removeClass("active");
    var _index = $(this).index();
    $(this).addClass("active");
    $(".platform_set_pigeon_mark").show();
    $(".platform_set_pigeon dl").hide();
    $(".platform_set_pigeon dl").eq(_index).show();
});
$(".platform_set_pigeon_mark button").on("click", function() {
    $(".platform_set_pigeon_mark").hide();
});
$("#save_btn").on("click", function() {
    var setData = {
        "configId": $("#webName").attr("configId"), //"配置项编号", 
        "configCategory": "platform",
        "configValue": {
            "name": $("#webName").val(),
            "key": $("#keyWords").val(),
            "desc": $("#webDesc").val(),
            "pigeon": {
                "orderBy": $("#pigeon_btn").attr("orderBy"),
                "filter": {
                    "ancestry": getSelect($(".j_ancestry dd")),
                    "distance": getSelect($(".j_distance dd")),
                    "features": getSelect($(".j_distance dd"))
                }
            },
            "race": {
                "orderBy": $("#race_btn").attr("orderBy"),
                "filter": []
            },
            "oneloft": {
                "orderBy": $("#oneloft_btn").attr("orderBy"),
                "filter": []
            }

        }
    }
    platformObj.setPlatform(setData);
});