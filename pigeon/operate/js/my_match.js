var openid = getParameter("openid");
var Authorization = localStorage.getItem("Authorization") || "";
scrollFlag = true;
var myMatchObj = {
    /**
     * postData 请求入参
     * tabNum 0：进行中 , 1:已结束
     */
    initQuest: function(postData, tabNum) {
        $.ajax({
            url: location.origin + "/customer/race/findSelfList",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if(data.code=="0"){
                    var list = data.data.list;
                    myMatchObj.setArray(list, tabNum);
                    scrollFlag = data.data.hasNextPage;
                    if (!scrollFlag) {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("没有更多数据");
                    } else {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("上拉加载更多");
                    }
                }
            },
            error: function() {
                myAlert.createBox("网络开小差");
            }
        })
    },
    setArray: function(list, tabNum) {
        var gamingArr = []; //进行中
        var overArr = []; //已结束
        list.forEach(function(val) {
            var status = "";
            var timeNum = new Date() - new Date(val.enrolledTime); //对比报名结束时间
            var timeNum1 = new Date() - new Date(val.startedTime); //对比开始时间
            var timeNum2 = new Date() - new Date(val.endedTime); //对比结束时间
            if (timeNum <= 0) {
                status = "报名中";
            } else {
                if (timeNum1 >= 0 && timeNum2 <= 0) {
                    status = "进行中";
                } else {
                    status = "已结束";
                }
            }
            val.status = status;
            if (status == "报名中" || status == "进行中") {
                gamingArr.push(val);
            } else {
                overArr.push(val);
            }
        });
        var newlist = tabNum == 0 ? gamingArr : overArr;
        myMatchObj.createGaming(newlist, tabNum);
    },
    createGaming: function(arr, tabNum) {
        var str = "";
        arr.forEach(function(val) {
            var startTime = val.startedTime.split(" ")[0];
            str += '<li class="clearfix">' +
                '<div class="dove_event_conl">' +
                '<p class="clearfix dove_event_t">' +
                '<span class="dove_event_in">' + startTime.split("-")[1] + '月</span>' +
                '<span class="dove_event_day">' + startTime.split("-")[2] + '</span>' +
                '</p>' +
                '<p class="dove_event_time clearfix">' +
                '<span class="dove_event_timel">止</span>' +
                '<span class="dove_event_timer">' + val.endedTime.split(" ")[0] + '</span>' +
                '</p>' +

                ' </div>' +
                '<div class="dove_event_conr">' +
                '<p class="dove_event_n">' + val.raceTitile + '</p>' +
                '<p class="dove_event_b">' + val.status + '</p>' +
                '<p class="dove_event_g">' + val.oneloftName + '</p>' +
                '<p class="dove_event_g">报名日期:2018-07-12</p>' +
                '<img src="../image/s_round.png" alt="" class="dove_event_conr1">' +
                '</div>' +
                '</li>';
        });
        if (tabNum == 0) {
            $("#my_match_gaming").append(str);
        } else {
            $("#my_match_over").append(str);
        }
    }
}