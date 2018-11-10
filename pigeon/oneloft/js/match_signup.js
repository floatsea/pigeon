/**
 *11、赛事报名列表接口
 *http://域名/oneloft/enroll/findList
 */
var raceId = getParameter("raceId") || "";
var signupObj = {
    getListRequest: function(listData) { //获取初始化数据
        $.ajax({
            url: location.origin + "/oneloft/enroll/findList",
            type: "post",
            data: JSON.stringify(listData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var total = data.data.total;
                    $("#signUpNum").html("（" + total + "）"); //报名用户数量
                    signupObj.getPageNumer(total); //分页
                    var list = data.data.list;
                    signupObj.createList(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    createList: function(list) {
        str = "";
        list.forEach(function(val) {
            str += '<tr enrollId="' + val.enrollId + '" userId="' + val.userId + '" userType="' + val.userType + '" >' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<span>' + val.mobile + '</span>' +
                '</td>' +
                '<td>' + val.realName + '</td>' +
                '<td>' +
                '<span style="color:#000">' + val.createdTime + '</span>' +
                '</td>' +
                '<td><span class="del_upsign">删除</span></td>'
            '</tr>';
        });
        $("#list_box_cont").html(str);
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
     * 13、赛事报名导入接口
     * http://域名/oneloft/enroll/addByImport
     */
    addByImport: function(importData, callback) {
        $.ajax({
            url: location.origin + "/oneloft/enroll/addByImport",
            type: "post",
            data: JSON.stringify(importData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("导入成功！");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    /**12、 赛事报名删除接口 
     *http://域名/oneloft/enroll/del
     */
    deleteRace: function(delData, callback) {
        $.ajax({
            url: location.origin + "/oneloft/enroll/del",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    },
}