var pigeonId = getParameter("pigeonId") || "";
var businessId = getParameter("businessId") || "";
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
        proEditorObj.createImgList(editorInfo.pigeonShow); //橱窗列表
        var desc = editorInfo.pigeonDesc;
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', desc)
        }, 1000);
    },
    //橱窗展示图片渲染
    createImgList: function(pigeonShow) {
        pigeonShow.images.forEach(function(val, _index) {
            $("#pigeonShow li").eq(_index + 1).find("img").attr("src", val.img);
        });
        $("#pigeonShow li").eq(0).find("img").attr("src", pigeonShow.videos[0].video);
    },
    /**
     * 保存
     * 9、信鸽修改接口
     * http://域名/business/pigeon/edit
     */
    saveRequst: function(saveData) {
        $.ajax({
            url: location.origin + "/business/pigeon/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    /**
     * 10、信鸽增加接口
     * http://域名/business/pigeon/add
     */
    addRequst: function(saveData) {
        $.ajax({
            url: location.origin + "/business/pigeon/add",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
}