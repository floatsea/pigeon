var openid = getParameter("openid");
var shopName = decodeURIComponent(getParameter("shopName"));
var pigeonid = getParameter("pigeonid"); //鸽子id
var Authorization = localStorage.getItem("Authorization") || "";
var pigeonObj = {
    //初始化页面
    initPageQuery: function(_data) {
        $.ajax({
            url: location.origin + "/customer/pigeon/find",
            type: "post",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    var list = data.data;
                    pigeonObj.createBanner(list.pigeonShow); //banner 展示
                    pigeonObj.createOtherInfo(list); //其它信息
                } else if (data.code == "401") {
                    getLogin({
                        "openId": openid
                    });
                }
            },
            error: function() {
                var list = pigeonDetail.data;
                pigeonObj.createBanner(list.pigeons[0].pigeonShow.images); //banner 展示
                pigeonObj.createOtherInfo(list.pigeons[0]); //其它信息

            }
        })
    },
    createBanner: function(pigeonShow) { //banner 模块展示
        document.getElementById("myVideo").src = pigeonShow.videos[0].video;
        // $("#banner_img").attr("href", images[0].url); //跳转链接
        $("#banner_img img").attr("src", pigeonShow.images[0].img); //图片链接
    },
    createOtherInfo: function(pigeons) {
        $("#parent_box").attr("businessId", pigeons.businessId);
        $("#pigeonPrice").html(pigeons.pigeonPrice); //价格
        $("#pigeonName").html(pigeons.pigeonName); //鸽子名称
        $("#pigeonNo").html(pigeons.pigeonNo);
        $("#pigeonPoint").html(pigeons.pigeonPoint);
        $("#pigeonGender").html(pigeons.pigeonGender == "F" ? "雌性" : "雄性"); //性别:雄性,M;雌性F
        $("#pigeonEye").html(pigeons.pigeonEye);
        $("#pigeonBlood").html(pigeons.pigeonBlood);
        $("#pigeonDesc").html(pigeons.pigeonDesc);
        $("#pigeonFeather").html(pigeons.pigeonFeather);
        var pigeonTags = pigeons.pigeonTags.split("，");
        var tagStr = "";
        pigeonTags.forEach(function(val) {
            tagStr += '<li> #' + val + '</li>';
        })
        $("#pigeonTags").html(tagStr);
    },
    findInArr: function(pigeonsInfoArr, businessId) {
        for (var i = 0; i < pigeonsInfoArr.length; i++) {
            if (pigeonsInfoArr[i].businessId == businessId) {
                return i;
            }
        }
        return "false";
    },
    getPigeonNum: function(pigeonsInfoArr) {
        var count = 0;
        for (var i = 0; i < pigeonsInfoArr.length; i++) {
            if (pigeonsInfoArr[i].pigeonArr) {
                count += pigeonsInfoArr[i].pigeonArr.length;
            }
        }
        return count;
    },
    setFlow: function(flowData, callback) { //关注
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
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    }
}