//var userListStr = ""; //创建出来的dom元素
//请求数据接口
var userListObj = {
    /**
     * 3、用户列表接口
     * http://域名/operator/customer/findList
     */
    getUserList: function(_data, callback) {
        $.ajax({
            url: location.origin + "/operator/customer/findList",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (_data.pageNum == "1") { //第一次进来查询
                    var totalNum = data.data.total; //查询的数据总数
                    userListObj.getPageNumer(totalNum); //页码 
                }
                var list = data.data.list;
                userListStr = userListObj.initList(list); //列表
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },

    //返回数据列表
    initList: function(list) {
        var listStr = "";
        list.forEach(function(val, index) {
            var profilePhoto = val.profilePhoto ? val.profilePhoto : "../image/cp.png";
            var status = val.isDisabled ? "解冻" : "冻结"
            listStr += '<tr customerId="' + val.customerId + '" openId="' + val.openId + '">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div class="clearfix">' +
                '<div>' +
                '<img src="' + profilePhoto + '" alt="">' +
                '</div>' +
                '<span>&nbsp;' + val.nickName + '</span>' +
                '</div>' +
                '</td>' +
                '<td>' + val.openId + '</td>' +
                '<td>' + val.createdTime + '</td>' +
                '<td>' + val.loginTime + '</td>' +
                '<td>' +
                '<span class="look_btn">查看</span>|<span openid="' + val.openId + '" class="cust_disable">' + status + '</span>' +
                '</td>' +
                '</tr>'
        })
        $("#user_list").html(listStr);
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
        $("#page_btn").html(liStr);
        $("#sum_num").html(totalNum); //数据总条数
    },

    //用户冻结
    /**
     * http://域名/operator/customer/editDisabled
     */
    getCustDisable: function(_data, callback) {
        $.ajax({
            url: location.origin + "/operator/customer/editDisabled",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                myAlert.createBox("操作成功");
                callback && callback();
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}