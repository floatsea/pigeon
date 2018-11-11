var openid = getParameter("openid") || "abc";
/**
 * 赛事列表
 * 1、关键字查询
 * 2、按发布时间、人气查询
 * 3、上拉加载更多
 * 4、接口6 赛事列表接口
 */
var scrollFlag = true; //滚屏事件用到
var matchListObj = {
    initMatchQuest: function(postMatchData) { //初始化调接口获取数据
        $.ajax({
            url: location.origin + "/customer/race/findList",
            type: "post",
            data: JSON.stringify(postMatchData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    var list = data.data.list;
                    matchListObj.createMatchList(list);
                    scrollFlag = data.data.hasNextPage;
                    if (scrollFlag) {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("上拉加载更多");
                    } else {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("没有更多的数据");
                        return;
                    }
                }else if(data.code=="401"){
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
    createMatchList: function (list) { //创建赛事列表
        $("#match_list_box").html("");
        var matchListStr = ""; //赛事列表dom
        list.forEach(function(val) {
            var enrolledTime = val.enrolledTime.split(" ")[0]; //报名开始时间
            var startedTime = val.startedTime.split(" ")[0]; //赛事开始时间
            var endedTime = val.endedTime.split(" ")[0]; //赛事截止时间
            var M = startedTime.split("-")[1];
            var D = startedTime.split("-")[2];
            var dateStatus = new Date() - new Date(val.enrolledTime);
            var dateStatus1 = new Date() - new Date(val.startedTime);
            var dateStatus2 = new Date() - new Date(val.endedTime);
            var matchStatus = "";
            if (dateStatus < 0) {
                matchStatus = "报名中";
            } else if (dateStatus1 >= 0 && dateStatus2 <= 0) {
                matchStatus = "进行中";
            } else {
                matchStatus = "已结束";
            }

            //赛事开始时间
            //赛事结束时间
            matchListStr += '<li class="clearfix" raceId="' + val.raceId + '">' +
                '<div class="dove_event_conl">' +
                '<p class="clearfix dove_event_t">' +
                '<span class="dove_event_in">' + M + '月</span>' +
                '<span class="dove_event_day">' + D + '</span>' +
                '</p>' +
                '<p class="dove_event_time clearfix">' +
                '<span class="dove_event_timel">止</span>' +
                '<span class="dove_event_timer">' + endedTime + '</span>' +
                '</p>' +
                '</div>' +
                '<div class="dove_event_conr">' +
                '<p class="dove_event_n">' + val.raceTitile + '</p>' +
                '<p class="dove_event_b">' + matchStatus + '</p>' +
                '<p class="dove_event_g">' + val.oneloftName + '</p>' +
                '<div class="dove_event_p clearfix">' +
                '<img src="../image/mon.png">' +
                '<p>' +
                '总奖金<span>' + val.reward + '</span>万元' +
                '</p>' +
                '</div>' +
                '<img src="../image/s_round.png" alt="" class="dove_event_conr1">' +
                '</div>' +
                '</li>';
        })
        $("#match_list_box").append(matchListStr);
    }
}