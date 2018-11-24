var oneloftId = getParameter("oneloftId") || "";
var inforEditor = {
    /**
     *14、资讯详情接口
     *http://域名/oneloft/news/find
     */
    initRequest: function(newsData) {
        $.ajax({
            url: location.origin + "/oneloft/news/find",
            type: "post",
            data: JSON.stringify(newsData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    inforEditor.createLoftData(data.data);
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
    showImg: function(newsShow) {
        $("#newsShow li").eq(0).find("img").attr("src", newsShow.videos[0].video); // 视频缩略图
        newsShow.images.forEach(function(val, _index) {
            $("#newsShow li").eq(_index + 1).find("img").attr("src", val.img);
        });
    },
    /**
     *15、新增资讯接口
     *http://域名/oneloft/news/add
     */
    addInfor: function(saveData, callback) {
        $.ajax({
            url: location.origin + "/oneloft/news/add",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    myAlert.createBox("保存成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     *16、编辑资讯接口
     *http://域名/oneloft/news/edit
     */
    saveInfor: function(saveData) {
        $.ajax({
            url: location.origin + "/oneloft/news/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
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