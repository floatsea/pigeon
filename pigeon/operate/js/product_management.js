/**
 * 44、信鸽列表接口
 * http://域名/operator/pigeon/findList
 */
var businessId = getParameter("businessId") || ""; //有businessId：从商家列表页进
var shopName = getParameter("shopName") || ""; //有shopName：从商家列表页进
var productObj = {
    proListRequst: function(proListData) {
        $.ajax({
            url: location.origin + "/operator/pigeon/findList",
            type: "post",
            data: JSON.stringify(proListData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
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
                myAlert.createBox("网络不给力");
            }
        });
    },
    createInfoList: function(infoLists) {
        var listStr = "";
        if (infoLists.length == 0) {
            listStr = "没有查询到数据";
            $("#pro_list_box").html(listStr);
            return;
        }
        infoLists.forEach(function(val) {
            var pigeonStatus = "";
            switch (val.pigeonStatus + "") {
                case "0":
                    pigeonStatus = "上架";
                    break;
                case "1":
                    pigeonStatus = "下架";
                    break;
                case "1":
                    pigeonStatus = "";
                    break;

            }
            var stickyTime = val.stickyTime == 0 ? "置顶" : "取消置顶";
            var imgSrc = "";
            if (val.pigeonShow.images.length > 0) {
                val.pigeonShow.images.forEach(function(imgObj) {
                    if (imgObj.isCover && imgObj.isCover == "Y") {
                        imgSrc = imgObj.img;
                    } else {
                        if (!imgSrc && imgObj.img) {
                            imgSrc = imgObj.img;
                        }
                    }
                })
            }
            listStr += '<tr businessId="' + val.businessId + '" pigeonId="' + val.pigeonId + '">' +
                ' <td>' +
                '<input type="checkbox" pigeonId="1">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div>' +
                '<div>' +
                '<img src="' + imgSrc + '" alt="">' +
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
    frame: function(frameData, callback) { //下架 /上架
        $.ajax({
            url: location.origin + "/operator/pigeon/editPublished",
            type: "post",
            data: JSON.stringify(frameData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (frameData.pigeonStatus == 0) {
                        myAlert.createBox("下架成功");
                    } else {
                        myAlert.createBox("上架成功");
                    }
                    callback && callback();
                } else {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
                callback && callback();
            }
        });
    },
    deleteList: function(delData, callback) { //删除
        $.ajax({
            url: location.origin + "/operator/pigeon/del",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("删除成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
                callback && callback();
            }
        });
    },
    setTop: function(setTopData, callback) { //置顶
        $.ajax({
            url: location.origin + "/operator/pigeon/editSticky",
            type: "post",
            data: JSON.stringify(setTopData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (setTopData.sticky) {
                        myAlert.createBox("置顶成功");
                    } else {
                        myAlert.createBox("取消置顶");
                    }
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
                callback && callback();
            }
        });
    }
}