/**
 * information_editor_business.html 调用
 * information_editor_loft.html 调用
 */
var oneloftId = getParameter("oneloftId") || "";
var businessId = getParameter("businessId") || "";
var shopName = decodeURI(getParameter("shopName") || "");
var oneloftName = decodeURI(getParameter("oneloftName") || "");
var inforEditor = {
    /**
     *37、资讯详情接口
     *http://域名/operator/news/find
     */
    initRequest: function(newsData) {
        $.ajax({
            url: location.origin + "/operator/news/find",
            type: "post",
            data: JSON.stringify(newsData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    if (oneloftId) {
                        inforEditor.createLoftData(data.data);
                    }
                    if (businessId) {
                        inforEditor.createBusinessData(data.data);
                    }

                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    // 公棚
    createLoftData: function(data) {
        $("#oneloftName").val(data.ownerName); //公棚名称
        $("#newsTitle").val(data.newsTitle); //资讯标题
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', data.newsContent || "");
        }, 1000);
    },
    // 商家
    createBusinessData: function(data) {
        $("#businessName").val(data.ownerName); //公棚名称
        $("#newsTitle").val(data.newsTitle); //公棚标题
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', data.newsContent || "");
        }, 1000);
        //inforEditor.showImg(data.newsShow); //橱窗展示
    },
    showImg: function(newsShow) {
        $("#newsShow li").eq(0).find("img").attr("src", newsShow.videos[0].video); // 视频缩略图
        newsShow.images.forEach(function(val, _index) {
            $("#newsShow li").eq(_index + 1).find("img").attr("src", val.img);
        });
    },
    /**
     *38、新增资讯接口
     *http://域名/operator/news/add
     */
    addInfor: function(saveData) {
        $.ajax({
            url: location.origin + "/operator/news/add",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("保存成功");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     *39、编辑资讯接口
     *http://域名/operator/news/edit
     */
    saveInfor: function(saveData) {
        $.ajax({
            url: location.origin + "/operator/news/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("保存成功");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}