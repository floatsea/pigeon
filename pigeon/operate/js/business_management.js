//商家
var businessTotalNum = 500; //数据总数
var businessListStr = ""; //创建出来的dom元素
var businessPageLiStr = ""; //分页页码
var businessObj = {
    /**
     * 6、商家列表接口
     * http://域名/operator/business/findList
     */
    getBusinessList: function(_data) { //调后端接口获取数据
        $.ajax({
            url: location.origin + "/operator/business/findList",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                businessTotalNum = data.data.total; //查询的数据总数
                var list = data.data.list;
                businessObj.getPageNumer(businessTotalNum); //页码
                businessObj.createList(list); //商家列表
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    //返回数据列表
    createList: function(list) {
        var listStr = "";
        list.forEach(function(val, index) {
            var disHtml = "冻结";
            disHtml = val.isDisabled ? "解冻" : "冻结";
            var setTopHtml = "置顶";
            setTopHtml = (val.stickyTime == 0) ? "置顶" : "取消置顶";
            listStr += '<tr businessId="' + val.businessId + '">' +
                '<td >' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<span class="shopName">' + (val.shopName || val.shopNameEn) + '</span>' +
                '</td>' +
                '<td>' + val.createdTime + '</td>' +
                '<td><span class="blue pigeon_num">' + val.pigeonCount + '</span></td>' +
                '<td><span class="blue order_num">' + val.orderCount + '</span></td>' +
                '<td><span class="blue news_num">' + val.newsCount + '</span></td>' +
                '<td>' + val.loginTime + '</td>' +
                '<td>' +
                '<span class="business_look_btn">查看</span>|<span class="bus_disabled">' + disHtml + '</span>|<span class="business_setTop">' + setTopHtml + '</span>' +
                '</td>' +
                '</tr>'
        })
        $("#business_list").html(listStr); //数据
    },
    //获取分页的页码
    getPageNumer: function(totalNum) {
        var liStr = "";
        var pageNum = Math.ceil(totalNum / 20);
        var cls = "";
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) { cls = "active" } else { cls = "" }
            liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
        }
        $("#business_page_btn").html(liStr); //分页页码
        $("#business_sum_num").html(totalNum);
    },
    //用户冻结/解冻
    getCustDisable: function(_data, callback) {
        $.ajax({
            url: location.origin + "/operator/business/editDisabled",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                myAlert.createBox(data.msg);
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    setTop: function(_data, callback) { //置顶
        $.ajax({
            url: location.origin + "/operator/business/editSticky",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                myAlert.createBox(data.msg);
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}

var loftObj = {
    //调接口获取数据
    getLoftList: function(_data) {
        $.ajax({
            url: location.origin + "/operator/oneloft/findList",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                loftTotalNum = data.data.total; //查询的数据总数
                var onelofts = data.data.list;
                loftObj.getLoftPageNumer(loftTotalNum); //页码
                loftObj.createLoftList(onelofts); //商家列表
            },
            error: function() {
                myAlert.createBox("网络不给力!");
            }
        })
    },
    //创建 "公棚" 列表
    createLoftList: function(loftList) {
        var listStr = "";
        loftList.forEach(function(val, index) {
            var disHtml = "冻结";
            disHtml = val.isDisabled ? "解冻" : "冻结";
            var setTopHtml = "置顶";
            setTopHtml = (val.stickyTime == 0) ? "置顶" : "取消置顶";
            listStr += '<tr oneloftId="' + val.oneloftId + '" oneloftName="'+val.oneloftName+'">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<span>' + val.oneloftName + '</span>' +
                '</td>' +
                '<td>' + val.createdTime + '</td>' +
                '<td><span class="blue match_list">' + val.raceCount + '</span></td>' +
                '<td><span class="blue news_list">' + val.newsCount + '</span></td>' +
                '<td>' + val.loginTime + '</td>' +
                '<td>' +
                '<span class="loft_look">查看</span>|<span class="loft_disabled">' + disHtml + '</span>|<span class="loft_setTop">' + setTopHtml + '</span>' +
                '</td>' +
                '</tr>';
        })
        $("#loft_list").html(listStr);
    },
    //获取 “公棚” 分页页码
    getLoftPageNumer: function(totalNum) {
        var liStr = "";
        var pageNum = Math.ceil(totalNum / 20);
        var cls = "";
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) { cls = "active" } else { cls = "" }
            liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
        }
        $("#loft_page_btn ul").html(liStr);
    },
    /**
     * 14、公棚冻结接口
     * 接口地址：http://域名/operator/oneloft/editDisabled
     */
    getLoftDisable: function(_data, callback) {
        $.ajax({
            url: location.origin + "/operator/oneloft/editDisabled",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                myAlert.createBox(data.msg);
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 15、公棚置顶接口
     * http://域名/operator/oneloft/editSticky
     */
    loftSetTop: function(_data, callback) {
        $.ajax({
            url: location.origin + "/operator/oneloft/editSticky",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                myAlert.createBox(data.msg);
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}