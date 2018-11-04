/**
 *1、地址栏截取openid 、raceid
 */
var openid = getParameter("openid");
var raceid = getParameter("raceid");
var Authorization = localStorage.getItem("Authorization") || "";
var raceObj = {
    raceData: raceData,
    initPageQuery: function(raceData) {
        $.ajax({
            url: location.origin + "/customer/race/find",
            type: "post",
            data: JSON.stringify(raceData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    raceObj.getBannerInfo(data.data); //banner信息
                    var raceitems = data.data.raceitems;
                    raceObj.getRaceArrange(raceitems);
                    $(".entry_con").html(data.data.raceDesc);
                } else if (data.code == "401") {
                    getLogin({
                        "openId": openid
                    });
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    getBannerInfo: function(races) { //获取banner信息
        $("#banner_img").attr("src", races.raceShow.images[0].img); //banner路径
        $("#race_title").html(races.raceTitile); //赛事标题
        $("#reward").html(races.reward); //奖金
    },
    getRaceArrange: function(raceitems) { //赛程安排
        var str = "";
        raceitems.forEach(function(val) {
            var dateStatus = (new Date() - new Date(val.startedTime)) / 1000;
            dateStatus = parseInt(dateStatus / 86400);
            var cl = "";
            var imgSrc = "small_r.png";
            if (dateStatus == 0) { //如果 赛事开始时间 == 当前时间，默认选中状态
                cl = "active";
                imgSrc = "small_act.png";
            } else {
                if (dateStatus < 0) { //注意此字段返回参数值 不确定 根据值判断当前赛程的状态
                    cl = "noSel";
                    imgSrc = "grey.png";
                }
            }
            var pdfHref = val.raceitemResult ? "val.raceitemResult" : "javascript:;"
            var pdfStr = val.raceitemResult ? "查看成绩表" : "成绩表未上传";
            str += '<li class="clearfix ' + cl + '">' +
                '<span>' + val.startedTime.split(" ")[0] + '</span>' +
                '<div>' +
                '<p>' + val.raceitemTitile + '</p>' +
                '<p>' + val.distance + ' 公里</p>' +
                '<img src="../image/' + imgSrc + '">' +
                '</div>' +
                '<a href="' + pdfHref + '">' + pdfStr + '</a>' +
                '</li>'
        })
        $("#race_list").html(str);
    },
    setFlow: function(flowData, callback) { //关注
        //关注接口 "followNo": 关注的id,"followType": 客户:0,商家:1,工棚:2,运营:3,信鸽:4,赛事:5.
        $.ajax({
            url: location.origin + "/customer/follow/add",
            type: "post",
            data: JSON.stringify(flowData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {

                if (data.code == "0") {
                    myAlert.createBox("关注成功~");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    setApply: function(applyData, callback) { //立即报名
        $.ajax({
            url: location.origin + "/customer/enroll/add",
            type: "post",
            data: JSON.stringify(applyData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {

                if (data.code == "0") {
                    myAlert.createBox("报名成功~");
                    $("#sign_btn").html("已报名");
                    $("#sign_mark").hide();
                    $("#sign_btn").unbind("click", fn);
                    callback && callback();
                }
            },
            error: function() {
                alert(1)
                myAlert.createBox("服务器开小差！")
            }
        })
    }
}