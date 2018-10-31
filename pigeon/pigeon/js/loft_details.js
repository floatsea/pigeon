var openid = getParameter("openid") || "";
var oneloftid = getParameter("oneloftid") || ""; //公棚id
var Authorization = localStorage.getItem("Authorization") || "";
var oneloftObj = {
    initPageQuery: function(loftData) {
        $.ajax({
            url: location.origin + "/customer/oneloft/find",
            type: "post",
            data: JSON.stringify(loftData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {

                if (data.code == 0) {
                    console.log(data);
                    oneloftObj.setBanner(data.data);
                    oneloftObj.getMap(data.data.location);
                } else if (data.code == "401") {
                    getLogin({
                        "openId": openid
                    });
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    //banner
    setBanner: function(oneloftData) {
        var oDate = new Date();
        var Y = oDate.getFullYear();
        var M = oDate.getMonth() + 1;
        var D = oDate.getDate();
        var nowDate = Y + "-" + toDou(M) + "-" + toDou(D);
        var years = (new Date(nowDate) - new Date(oneloftData.establishTime)) / (1000 * 86400 * 365);
        years = parseInt(years);
        $("#banner_img").attr("src", oneloftData.oneloftShow.images[0].img);
        $("#loft_name").html(oneloftData.oneloftName);
        $("#oneloftType").html(oneloftData.oneloftType == 0 ? "春棚" : "秋棚"); //春棚：0，秋棚：1,
        $("#createdTime").html("成立" + years + "年");
        $("#cityCode").html(oneloftData.address)
    },
    //立即报名
    setApply: function(applyData, callback) {
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
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    //关注
    setFlow: function(flowData, callback) {
        //关注接口 "followNo": 关注的id,"followType": 关注类型:客户:0,商家:1,工棚:2,运营:3,信鸽:4,赛事:5.
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
                } else {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    //公棚资讯列表
    getLoftNews: function(postNewsData) {
        $.ajax({
            url: location.origin + "/customer/news/findList",
            type: "post",
            data: JSON.stringify(postNewsData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {

                if (data.code == "0") {
                    var list = data.data.list;
                    oneloftObj.createLoftNews(list);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    //创建公棚动态列表
    createLoftNews: function(list) {
        var newsStr = "";
        if (list.length >= 3) {
            $("#more_loft_news").show();
            for (var i = 0; i < 3; i++) {
                newsStr += '<li>' + val.newsTitle + '</li>';
            }
        } else {
            list.forEach(function(val) {
                newsStr += '<li>' + val.newsTitle + '</li>';
            });
            $("#more_loft_news").hide();
        }
        $("#news_list_box").html(newsStr);
    },
    /**
     * 6、获取赛事列表
     * http://域名/customer/race/findList
     */
    getMatchRequest: function(postMatchData) {
        $.ajax({
            url: location.origin + "/customer/race/findList",
            type: "post",
            data: JSON.stringify(postMatchData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == "0") {
                    var list = data.data.list;
                    oneloftObj.createMatchList(list);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    },
    createMatchList: function(list) {
        var obj = list[0];
        var status = "";
        var statusDate = new Date() - new Date(obj.enrolledTime); //报名结束时间
        var statusDate1 = new Date() - new Date(obj.startedTime); //比赛开始时间
        var statusDate2 = new Date() - new Date(obj.enrolledTime); //比赛结束时间
        if (statusDate <= 0) {
            status = "报名中";
        } else {
            if (statusDate1 >= 0 && statusDate2 <= 0) {
                status = "进行中";
            } else {
                status = "已结束";
            }
        };
        var matchListStr = '<p class="latest_events_del">' + obj.raceTitile + '&nbsp<span>' + status + '</span></p>' +
            '<ul class="latest_events_l clearfix">' +
            '<li class="latest_events_ll" id="event_details" raceId="' + obj.raceId + '">查看比赛章程</li>' +
            '<li class="latest_events_rr" id="sign_btn" raceId="' + obj.raceId + '">报名</li>' +
            '</ul>';
        $("#loft_match_box").html(matchListStr);

    },
    getMap: function(location) {
        //var longitude = Number(location.split(" ")[0]);
        //var latitude = Number(location.split(" ")[1]);
        var map = new AMap.Map('container', {
            //center: [longitude, latitude], //116.341849, 40.030749
            center: [116.341849, 40.030749],
            zoom: 11
        });
        var options = {
            'showButton': true, //是否显示定位按钮
            'buttonPosition': 'LB', //定位按钮的位置
            /* LT LB RT RB */
            'buttonOffset': new AMap.Pixel(10, 20), //定位按钮距离对应角落的距离
            'showMarker': true, //是否显示定位点
            'markerOptions': { //自定义定位点样式，同Marker的Options
                'offset': new AMap.Pixel(-18, -36),
                'content': '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
            },
            'showCircle': true, //是否显示定位精度圈
            'circleOptions': { //定位精度圈的样式
                'strokeColor': '#0093FF',
                'noSelect': true,
                'strokeOpacity': 0.5,
                'strokeWeight': 1,
                'fillColor': '#02B0FF',
                'fillOpacity': 0.25
            }
        }
        AMap.plugin(["AMap.Geolocation"], function() {
            var geolocation = new AMap.Geolocation(options);
            map.addControl(geolocation);
            geolocation.getCurrentPosition()
        });
    }
}