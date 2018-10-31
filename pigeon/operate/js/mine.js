var openid = getParameter("openid");
var wx_userInfo = "";
var Authorization = localStorage.getItem("Authorization") || "";
/**
 * 1、页面初始化
 * 2、入参 除了openid以外，其它获取不到
 * 3、接口7 获取用户信息
 */
var mineObj = {
    initRequest: function(mineQuestData, matchPostData) {
        $.ajax({
            url: location.origin + "/customer/find",
            type: "post",
            data: JSON.stringify(mineQuestData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == "0") {
                    var custumers = data.data;
                    mineObj.setUserInfo(custumers); //获取用户信息
                    mineObj.followRequest(); //关注初始化
                    mineObj.getMatchRequest(matchPostData); //我的赛事
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    setUserInfo: function(custumers) {
        $("#nickName").html(custumers.nickName);
        $("#headImg").css("src", custumers.profilePhoto);
        $("#followCount").html(custumers.followCount);
        //用户信息存到缓存里，在editor_userinfo.html 取出来回显
        sessionStorage.setItem("custumerInfo", JSON.stringify(custumers));
    },
    followRequest: function() { //22、关注列表接口（鸽子、赛事）
        $.ajax({
            url: location.origin + "/customer/follow/findList",
            type: "post",
            data: JSON.stringify({ "followType": 3 }), // , //关注类型：商家：0，信鸽：1,公棚：3,比赛：4
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == "0") {
                    var loftList = data.data.list;
                    mineObj.createfollowLoft(loftList);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    createfollowLoft: function(list) {
        var len = list.length >= 3 ? 3 : list.length;
        var str = "";
        for (var i = 0; i < len; i++) {
            str += '<li>' +
                '<div class="focus_on_datat">' +
                '<span>' + list[i].oneloftName + '收鸽数据' +
                '<img src="../image/vi.png" alt="" class="vedio_btn">' +
                '</span>' +
                '</div>' +
                '<div class="focus_on_name">' +
                '<span class="">' + list[i].oneloftName + '</span>' +
                '<span>' + list[i].establishTime + '</span>' +
                '</div>' +
                '</li>';
        }
        $("#loft_box").html(str);
    },
    getMatchRequest: function(matchPostData) {
        $.ajax({
            url: location.origin + "/customer/race/findSelfList",
            type: "post",
            data: JSON.stringify(matchPostData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if(data.code=="0"){
                    var obj = data.data.list[0];
                    mineObj.createMatch(obj)
                }
            },
            error: function() {

            }
        })
    },
    createMatch: function(obj) {
        var dateStatus = new Date() - new Date(obj.enrolledTime);
        var dateStatus1 = new Date() - new Date(obj.startedTime);
        var dateStatus2 = new Date() - new Date(obj.endedTime);
        var matchStatus = "";
        if (dateStatus < 0) {
            matchStatus = "报名中";
        } else if (dateStatus1 >= 0 && dateStatus2 <= 0) {
            matchStatus = "进行中";
        } else {
            matchStatus = "已结束";
        }
        var matchStr = '<li>' +
            '<div class="focus_on_datat my_fault_list">' +
            '<span class="focus_on_ing">' + matchStatus + '</span>' +
            '<span>' + obj.raceTitile + '</span>' +
            '<img src="../image/mon.png">' +
            '<span>总奖金<i>' + obj.reward / 10000 + '</i>万元</span>' +
            '</div>' +
            '<div class="focus_on_name">' +
            '<span>' + obj.startedTime.split(" ")[0] + '至 ' + obj.endedTime.split(" ")[0] +
            '</span>' +
            '</div>' +
            '</li>';
        $("#mine_match").html(matchStr);
    }

}