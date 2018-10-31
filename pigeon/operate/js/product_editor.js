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
            $("#pigeonShow li").eq(0).find("img").attr("src", pigeonShow.videos[0].desc);
            var videoURL = pigeonShow.videos[0].video;
            var videoURL2 = pigeonShow.videos[0].desc;
            var videoStr = '<video src="' + videoURL + '" controls="controls></video><video style="display:none" src="' + videoURL2 + '" controls="controls" onloaddata="proEditorObj.captureImage"></video>';
            $("#video").html(videoStr);
        }

    },
    captureImage: function(video) { //截图 
        var scale = 0.25;
        try {
            var videocanvas = $("<canvas/>")[0];
            video.setAttribute('crossOrigin', 'Anonymous'); //anonymous
            videocanvas.width = video.videoWidth * scale;
            videocanvas.height = video.videoHeight * scale;
            videocanvas.getContext('2d').drawImage(video, 0, 0, videocanvas.width, videocanvas.height);
            var dataUrl = videocanvas.toDataURL("image/png", 1);
            console.log(dataUrl)
            $("#small_img").get(0).src = dataUrl;
            delete videocanvas;
        } catch (e) {
            // $("#pigeonShow li").eq(0).find("img").attr("src", "../image/load.gif");
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