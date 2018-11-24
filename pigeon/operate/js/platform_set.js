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
                    $("#webName").attr("configId", data.configId);
                    platformObj.showInfo(data.configValue); //展示输入框和文本域信息
                    platformObj.showSelect(data.configValue); // 展示鸽子筛选条件信息
                    platformObj.showOrderBy(data.configValue); // 展示排序方式信息
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    showInfo: function(obj) {
        $("#webName").val(obj.name);
        $("#keyWords").val(obj.key);
        $("#webDesc").val(obj.desc);
    },
    showOrderBy: function(obj) { //获取排序方式
        var pigeonOrderBy = obj.pigeon.orderBy; //鸽子
        var businessOrderBy = obj.business.orderBy; //商家
        var raceOrderBy = obj.race.orderBy; //赛事
        var oneloftOrderBy = obj.oneloft.orderBy; //公棚
        platformObj.setOrderBy(pigeonOrderBy, 0);
        platformObj.setOrderBy(businessOrderBy, 1);
        platformObj.setOrderBy(raceOrderBy, 2);
        platformObj.setOrderBy(oneloftOrderBy, 3);
    },
    setOrderBy: function(oneloftOrderBy, num) {
        oneloftOrderBy.forEach(function(val, i) {
            $("#checkUl li").eq(num).find("span").html(val.show);
            var items = val.items;
            items.forEach(function(itemVal, k) {
                $("#checkUl li").eq(num).find("label").eq(k).find("b").html(itemVal.show);
                $("#checkUl li").eq(num).find("label").eq(k).find("input").attr("orderby", itemVal.value);
                $("#checkUl li").eq(num).find("label").eq(k).find("input").prop("checked", itemVal.isSelected);
            });
        })
    },
    showSelect: function(obj) { //获取鸽子筛选方式
        var filters = obj.pigeon.filter;
        var ancestry = filters[0]; //血统
        var distance = filters[1]; //距离
        var features = filters[2]; //特征
        platformObj.findInArr($(".j_ancestry dd"), ancestry);
        platformObj.findInArr($(".j_distance dd"), distance);
        platformObj.findInArr($(".j_features dd"), features);
    },
    findInArr: function(targetDomArr, arr) {
        for (var i = 0; i < arr.length; i++) {
            targetDomArr.eq(j).find("input").prop("checked", arr[i].isSelect);
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
                myAlert.createBox("网络不给力");
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
    var _index = $(this).index();
    if (_index == 0) {
        $("#filter_box").show();
    } else {
        $("#filter_box").hide();
    }
    $(this).addClass("active");
    $("#checkUl li").hide();
    $("#checkUl li").eq(_index).show();
})

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
    $(".platform_set_pigeon dl").hide();
    $(".platform_set_pigeon dl").eq(_index).show();
});
//获取每一项的排序方式
function getOrderBy(Num) {
    var arr = new Array();
    var divList = $("#checkUl li").eq(Num).children();
    divList.each(function(i) {
        var showStr = divList.eq(i).find("span").html();
        var labelArr = new Array();
        var labelList = divList.eq(i).find("label");
        labelList.each(function(k) {
            var itemsStr = labelList.eq(k).find("b").html();
            var selectVal = labelList.eq(k).find("input").attr("orderby");
            var selectFlag = labelList.eq(k).find("input").prop("checked");
            labelArr.push({
                "show": itemsStr,
                "value": selectVal,
                "isSelected": selectFlag
            });
        });
        arr.push({
            "show": showStr,
            "items": labelArr
        });
    });
    return arr;
}
//获取 鸽子的筛选条件
function getPigeonFilter() {
    var filterArr = new Array();
    var liList = $("#select_box li");
    liList.each(function(i) {
        var showType = liList.eq(i).find("span").html();
        var valueType = liList.eq(i).find("span").attr("type");
        var labelList = $(".platform_set_pigeon dl").eq(i).find("label");
        var selectArr = new Array();
        labelList.each(function(k) {
            var str = labelList.eq(k).find("b").html();
            var seleFlag = labelList.eq(k).find("input").prop("checked");
            selectArr.push({
                "show": str,
                "value": str,
                "isSelect": seleFlag
            });
        });
        filterArr.push({
            "show": showType,
            "value": valueType,
            "items": selectArr
        });
    });
    return filterArr;
}
//判断输入框及选择框 信息是否完整
function isAllInfo() {
    if (!$("#webName").val()) {
        myAlert.createBox("网站名称不能为空！");
        return;
    }
    if (!$("#keyWords").val()) {
        myAlert.createBox("关键词不能为空！");
        return;
    }
    if (!$("#webDesc").val()) {
        myAlert.createBox("描述不能为空！");
        return;
    }
    if ($("#checkUl li").eq(0).children().eq(0).find("input:checked").length == 0 || $("#checkUl li").eq(0).children().eq(1).find("input:checked").length == 0) {
        myAlert.createBox("请选择商品排序方式！");
        return;
    }
    if ($("#checkUl li").eq(1).children().eq(0).find("input:checked").length == 0 || $("#checkUl li").eq(1).children().eq(1).find("input:checked").length == 0) {
        myAlert.createBox("请选择商家排序方式！");
        return;
    }
    if ($("#checkUl li").eq(2).children().eq(0).find("input:checked").length == 0 || $("#checkUl li").eq(2).children().eq(1).find("input:checked").length == 0) {
        myAlert.createBox("请选择赛事排序方式！");
        return;
    }
    if ($("#checkUl li").eq(3).children().eq(0).find("input:checked").length == 0 || $("#checkUl li").eq(3).children().eq(1).find("input:checked").length == 0) {
        myAlert.createBox("请选择公棚排序方式！");
        return;
    }
    if ($(".platform_set_pigeon dl").eq(0).find("input:checked").length == 0 || $(".platform_set_pigeon dl").eq(1).find("input:checked").length == 0 || $(".platform_set_pigeon dl").eq(2).find("input:checked").length == 0) {
        myAlert.createBox("鸽子的筛选条件不够完善，请重新选择！");
        return;
    }
    return true;
}
// 保存
$("#save_btn").on("click", function() {
    if (!isAllInfo()) {
        return;
    }
    var setData = {
        "configId": $("#webName").attr("configId") || "",
        "configCategory": "platform",
        "configValue": {
            "name": $("#webName").val(),
            "key": $("#keyWords").val(),
            "desc": $("#webDesc").val(),
            "business": {
                "orderBy": getOrderBy(1)
            },
            "oneloft": {
                "orderBy": getOrderBy(3)
            },
            "race": {
                "orderBy": getOrderBy(2)
            },
            "pigeon": {
                "filter": getPigeonFilter(),
                "orderBy": getOrderBy(0)
            }
        }
    };
    platformObj.setPlatform(setData);
});