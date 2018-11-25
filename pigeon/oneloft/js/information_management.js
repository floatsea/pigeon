//var oneloftId = getParameter("oneloftId") || "";
/**
 *4、资讯列表接口
 *http://域名/oneloft/news/findList
 */
var inforObj = {
    newsRequstList: function(postData) {
        $.ajax({
            url: location.origin + "/oneloft/news/findList",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (postData.pageNum == "1") {
                        var total = data.data.total;
                        inforObj.getPageNumer(total); //分页
                    }
                    var infoList = data.data.list;
                    inforObj.createInfoList(infoList, postData); //创建dom
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    createInfoList: function(list, postData) {
        var listStr = "";
        list.forEach(function(val) {
            var newsDate = postData.isPublished ? val.updatedTime : val.createdTime;
            var cancelTxt = postData.isPublished ? "撤稿" : "发布";
            var ownerName = val.ownerName ? val.ownerName : "——";
            listStr += '<li class="clearfix" newsId="' + val.newsId + '" ownerName="' + ownerName + '">' +
                '<div class="comm_list_l clearfix">' +
                '<div class="comm_list_check">' +
                '<input type="checkbox">' +
                '<label></label>' +
                '</div>' +
                '<div class="info_list_txt">' + val.newsTitle + '</div>' +
                '</div>' +
                '<div class="info_create_date ">' + newsDate + '</div>' +
                '<div class="info_create_date">' + val.userName + '</div>' +
                // '<div class="info_create_date ">' + val.ownerName + '</div>' +
                '<div class="info_last ">' +
                '<span class="enditor_btn">编辑</span> | <span class="cancel_btn">' + cancelTxt + '</span> | <span class="delete_btn">删除</span>' +
                '</div>' +
                '</li>';
        });
        $("#news_list_box").html(listStr);
    },
    //获取分页的页码
    getPageNumer: function(totalNum) {
        var liStr = "";
        var pageNum = Math.ceil(totalNum / 20);
        var cls = "";
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) {
                cls = "active"
            } else {
                cls = ""
            }
            liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
        }
        $("#page_btn ul").html(liStr);
        $("#total_num").html(totalNum);
    },
    /**
     * 5、资讯发布、撤稿接口
     * http://域名/oneloft/news/editPublished
     */
    cancelRequest: function(cancelData, cb) {
        $.ajax({
            url: location.origin + "/oneloft/news/editPublished",
            type: "post",
            data: JSON.stringify(cancelData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (cancelData.isPublished) {
                        myAlert.createBox("发布成功！");
                    } else {
                        myAlert.createBox("撤稿成功！");
                    }
                    cb && cb();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    /**
     * 6、资讯删除接口
     * http://域名/oneloft/news/del
     */
    delRequest: function(delData, cb) {
        $.ajax({
            url: location.origin + "/oneloft/news/del",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("删除成功！");
                    cb && cb();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    }
};