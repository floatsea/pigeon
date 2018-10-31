/**
 * 17、信鸽列表接口
 * http://域名/business/pigeon/findList
 */
var businessId = getParameter("businessId") || ""; //有businessId：从商家列表页进
var productObj = {
    proListRequst: function(proListData) {
        $.ajax({
            url: location.origin + "/business/pigeon/findList",
            type: "post",
            data: JSON.stringify(proListData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    if (proListData.pageNum == "1") {
                        var total = data.data.total;
                        productObj.getPageNumer(total); //分页
                    }
                    var infoList = data.data.list;
                    productObj.createInfoList(infoList); //创建dom
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    createInfoList: function(infoLists) {
        var listStr = "";
        infoLists.forEach(function(val) {
            var pigeonStatus = val.pigeonStatus == 0 ? "上架" : "上架";
            var stickyTime = val.stickyTime == 0 ? "置顶" : "取消置顶";
            listStr += '<tr businessId="' + val.businessId + '" pigeonId="' + val.pigeonId + '">' +
                ' <td>' +
                '<input type="checkbox" pigeonId="1">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div>' +
                '<div>' +
                '<img src="' + val.pigeonShow.images[0].img + '" alt="">' +
                '</div>' +
                '<span>' + val.pigeonName + '</span>' +
                '</div>' +
                '</td>' +
                '<td>' + val.pigeonPrice + '</td>' +
                '<td>' + val.createdTime + '</td>' +
                '<td>' + val.shopName + '</td>' +
                '<td>' +
                '<span class="editor_btn">编辑</span>|<span class="frame_btn">' + pigeonStatus + '</span>|' +
                '<span class="del_btn">删除</span>|<span class="setTop_btn">' + stickyTime + '</span>' +
                '</td>' +
                '< /tr > ';
        });
        $("#pro_list_box").html(listStr);
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
     * 11、信鸽下架接口
     * http://域名/business/pigeon/editPublish
     */
    frame: function(frameData, callback) { //下架
        $.ajax({
            url: location.origin + "/business/pigeon/editPublish",
            type: "post",
            data: JSON.stringify(frameData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    myAlert.createBox(data.msg);
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
                callback && callback();
            }
        });
    },
    /**
     * 12、信鸽删除接口
     * http://域名/business/pigeon/del
     */
    deleteList: function(delData, callback) { //删除
        $.ajax({
            url: location.origin + "/business/pigeon/del",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    myAlert.createBox(data.msg);
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
                callback && callback();
            }
        });
    },
    /**
     * 置顶 文档上没有接口
     * /business/pigeon/editSticky
     */
    setTop: function(setTopData, callback) { //置顶
        $.ajax({
            url: location.origin + "/business/pigeon/editSticky",
            type: "post",
            data: JSON.stringify(setTopData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    myAlert.createBox(data.msg);
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
                callback && callback();
            }
        });
    }
}