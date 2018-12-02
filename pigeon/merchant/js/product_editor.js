var pigeonId = getParameter("pigeonId") || "";
var businessId = getParameter("businessId") || "";
var shopName = getcookie("shopName");
if (!shopName) {
    $('#shop_set', parent.document).trigger("click");
}
var ue = UE.getEditor('editor', {
    BaseUrl: ''
        //UEDITOR_HOME_URL: 'static/utf8-jsp/',
});
/**
 * 18、信鸽详情接口
 * /business/pigeon/find
 */
var proEditorObj = {
    editorRequst: function() {
        $.ajax({
            url: location.origin + "/business/pigeon/find",
            type: "post",
            data: JSON.stringify({ "pigeonId": pigeonId }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    var editorInfo = data.data
                    proEditorObj.createEditor(editorInfo); //渲染数据
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    //渲染鸽子详情数据
    createEditor: function(editorInfo) {
        editorInfo.pigeonTags = typeof(editorInfo.pigeonTags) == "string" ? JSON.parse(editorInfo.pigeonTags) : editorInfo.pigeonTags;
        $("#businesName").val(editorInfo.shopName); //商家名称
        $("#pigeonName").val(editorInfo.pigeonName); //商品名称
        $("#pigeonNo").val(editorInfo.pigeonNo); //环号
        $("#pigeonGender").find("#" + editorInfo.pigeonGender).prop("checked", true); //性别
        $("#pigeonFeather").val(editorInfo.pigeonFeather); //羽色
        $("#pigeonEye").val(editorInfo.pigeonEye); //眼砂
        $("#pigeonBlood").val(editorInfo.pigeonBlood); //血统
        $("#pigeonPoint").val(editorInfo.pigeonPoint); //卖点
        $("#pigeonPrice").val(editorInfo.pigeonPrice); //价格
        $("#pigeon_tab").val(editorInfo.pigeonTags ? editorInfo.pigeonTags.tag : ""); //标签
        proEditorObj.createImgList(editorInfo.pigeonShow); //橱窗列表
        proEditorObj.showSelect(editorInfo.pigeonTags);
        var desc = editorInfo.pigeonDesc;
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', desc)
        }, 1000);
    },
    showSelect: function(obj) {
        var filters = obj.filter;
        var ancestry = filters.bloodline; //血统
        var distance = filters.distance; //距离
        var features = filters.feature; //特征
        proEditorObj.findInArr($(".j_ancestry dd"), ancestry);
        proEditorObj.findInArr($(".j_distance dd"), distance);
        proEditorObj.findInArr($(".j_features dd"), features);
    },
    findInArr: function(targetDomArr, arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < targetDomArr.length; j++) {
                if (arr[i] == targetDomArr.eq(j).find("b").text()) {
                    targetDomArr.eq(j).find("input").prop("checked", true);
                }
            }
        }
    },
    //橱窗展示图片渲染
    createImgList: function(pigeonShow) {
        if (pigeonShow.images.length > 0) {
            pigeonShow.images.forEach(function(val, _index) {
                $("#pigeonShow li").eq(_index + 1).find("img").attr("src", val.img);
                $("#pigeonShow li").eq(_index + 1).find("input").hide();
                $("#pigeonShow li").eq(_index + 1).find("em").show();
                if (val.isCover && val.isCover == "Y") {
                    $("#pigeonShow li").eq(_index + 1).find("i").html("设为封面").addClass("active");
                } else {
                    $("#pigeonShow li").eq(_index + 1).find("i").html("设为封面");
                }
            });
        }
        // video
        if (pigeonShow.videos.length > 0) {
            var videoURL = pigeonShow.videos[0].video;
            $("#small_video").attr("src", videoURL);
            $("#big_video").attr("src", videoURL)
            $("#pigeonShow li").eq(0).find("b").html("查看视频");
            $("#pigeonShow li").eq(0).find(".del_img").show();
            $("#pigeonShow li").eq(0).find("input").hide();
        }
    },
    /**
     * 保存
     * 9、信鸽修改接口
     * http://域名/business/pigeon/edit
     */
    saveRequst: function(saveData, callback) {
        $.ajax({
            url: location.origin + "/business/pigeon/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("保存成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    /**
     * 10、信鸽增加接口
     * http://域名/business/pigeon/add
     */
    addRequst: function(saveData, callback) {
        $.ajax({
            url: location.origin + "/business/pigeon/add",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("保存成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    //校验所有输入框
    isInputText: function() {
        var inputText = $("input[type=text]"); //所有输入框
        for (var i = 0; i < inputText.length; i++) {
            if (inputText.eq(i).val() == "") {
                return false;
            }
        }
        return true;
    },
    //校验所有input radio
    isInputRadio: function() {
        var inputCheck = $("input[type=radio]");
        for (var i = 0; i < inputCheck.length; i++) {
            if (inputCheck.eq(i).prop("checked")) {
                return true;
            }
        }
        return false;
    },
    //校验图片选择
    isInputFile: function() {
        var inputCheck = $("#pigeonShow li").find("img");
        for (var i = 0; i < inputCheck.length; i++) {
            if (i != 0 && inputCheck.eq(i).attr("src")) {
                return true;
            }
        }
        return false;
    },
    //筛选条件校验
    selectPigeon: function() {
        if ($(".platform_set_pigeon dl").eq(0).find("input:checked").length == 0 || $(".platform_set_pigeon dl").eq(1).find("input:checked").length == 0 || $(".platform_set_pigeon dl").eq(2).find("input:checked").length == 0) {
            myAlert.createBox("请选择鸽子的筛选条件！");
            return false;
        }
        return true;
    },
    getUeditor: function() {
        if (!ue.getContent()) {
            return false;
        } else {
            return true;
        }
    },
    //校验页面信息是否填写完整
    isAllInfo: function() {
        if (!proEditorObj.isInputText() || !proEditorObj.isInputRadio() || !proEditorObj.isInputFile() || !proEditorObj.selectPigeon()) {
            return false;
        } else {
            return true;
        }
    }
}