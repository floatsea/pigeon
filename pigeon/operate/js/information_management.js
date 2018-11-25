/**
 * 1、oneloftId : 从“商家管理”公棚页面 “资讯” 跳转过来，有值； home "信息管理" 二级菜单"公棚"，无值；
 * 2、businessId 从“商品管理”商家页面 “资讯” 跳转过来，有值； home "信息管理" 二级菜单“商家”，无值；
 * 3、channelType ：区分 business、loft
 * 4、此js文件 information_business.html、information_loft.html 公用文件
 * 5、从"信息管理"进入，不再有添加资讯按钮
 * 6、从“商家管理”页面进入， 可以针对当前“商家” 或者 “公棚” 添加 “资讯信息”
 */
var oneloftId = getParameter("oneloftId") || "";
var businessId = getParameter("businessId") || "";
var channelType = getParameter("channelType") || ""; //business,loft
var shopName = getParameter("shopName") || "";
var oneloftName = getParameter("oneloftName") || "";
// if (!oneloftId || !businessId) {
//     $("#input_info_btn").hide();
// } else {
//     $("#input_info_btn").show();
// }

/**
 * 16、资讯列表接口
 * http://域名/operator/news/findList
 */
var inforObj = {
    newsRequstList: function(postData) {
        $.ajax({
            url: location.origin + "/operator/news/findList",
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
            listStr += '<li class="clearfix" newsId="' + val.newsId + '" ownerId="' + val.ownerId + '">' +
                '<div class="comm_list_l clearfix">' +
                '<div class="comm_list_check">' +
                '<input type="checkbox">' +
                '<label></label>' +
                '</div>' +
                '<div class="info_list_txt">' + val.newsTitle + '</div>' +
                '</div>' +
                '<div class="info_create_date ">' + newsDate + '</div>' +
                '<div class="info_create_date">' + val.userName + '</div>' +
                '<div class="info_create_date ">' + (val.ownerName || "神秘公棚") + '</div>' +
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
     * 17、资讯发布、撤稿接口
     * http://域名/operator/news/editPublished
     */
    cancelRequest: function(cancelData, cb) {
        $.ajax({
            url: location.origin + "/operator/news/editPublished",
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
     * 40、删除资讯接口
     * http://域名/operator/news/del
     * 用哪个？
     */
    delRequest: function(delData, cb) {
        $.ajax({
            url: location.origin + "/operator/news/del",
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