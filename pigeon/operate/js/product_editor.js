var pigeonId = getParameter("pigeonId") || "";
var businessId = getParameter("businessId") || "";
var shopName = decodeURI(getParameter("shopName")) || "";
var ue = UE.getEditor('editor', {
    BaseUrl: ''
        //UEDITOR_HOME_URL: 'static/utf8-jsp/',
});
/**
 * 45、信鸽详情接口
 * http://域名/operator/pigeon/find
 */
var proEditorObj = {
    editorRequst: function() {
        $.ajax({
            url: location.origin + "/operator/pigeon/find",
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
                myAlert.createBox("网络不给力！");
            }
        });
    },
    //渲染鸽子详情数据
    createEditor: function(editorInfo) {
        $("#businesName").val(editorInfo.shopName); //商家名称
        $("#pigeonName").val(editorInfo.pigeonName); //商品名称
        $("#pigeonNo").val(editorInfo.pigeonNo); //环号
        $("#pigeonGender").find("#" + editorInfo.pigeonGender).prop("checked", true); //性别
        $("#pigeonFeather").val(editorInfo.pigeonFeather); //羽色
        $("#pigeonEye").val(editorInfo.pigeonEye); //眼砂
        $("#pigeonBlood").val(editorInfo.pigeonBlood); //血统
        $("#pigeonPoint").val(editorInfo.pigeonPoint); //卖点
        $("#pigeonPrice").val(editorInfo.pigeonPrice); //价格
        $("#pigeonTab").val(editorInfo.pigeonTags);
        proEditorObj.createImgList(editorInfo.pigeonShow); //橱窗列表
        var desc = editorInfo.pigeonDesc;
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', desc)
        }, 1000);
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
     * 19、信鸽修改接口
     * http://域名/operator/pigeon/edit
     */
    saveRequst: function(saveData, callback) {
        $.ajax({
            url: location.origin + "/operator/pigeon/edit",
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
                myAlert.createBox("网络不给力！");
            }
        });
    },
    /**
     * 20、信鸽增加接口
     * http://域名/operator/pigeon/add
     */
    addRequst: function(saveData) {
        $.ajax({
            url: location.origin + "/operator/pigeon/add",
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
                myAlert.createBox("网络不给力！");
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
            if (inputCheck.eq(i).attr("src")) {
                return true;
            }
        }
        return false;
    },
    //校验页面信息是否填写完整
    isAllInfo: function() {
        if (!proEditorObj.isInputText() || !proEditorObj.isInputRadio() || !proEditorObj.isInputFile()) {
            return false;
        } else {
            return true;
        }
    }
}