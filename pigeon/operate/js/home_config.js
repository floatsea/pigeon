$(function() {
    $("#home_list_box").find("li").on("click", function() {
        $("#home_list_box").find("li").removeClass("active");
        $("#home_list_box").find("li").each(function(index) {
            var str = $("#home_list_box").find("li").eq(index).find("img").attr("src");
            var N = str.indexOf("1");
            if (N > -1) {
                $("#home_list_box").find("li").eq(index).find("img").attr("src", str.substring(0, N) + ".png");
            }

        });
        $(this).addClass("active")
        var _index = $(this).index();
        var imgSrc = $(this).find("img").attr("src");
        $(this).find("img").attr("src", imgSrc.substring(0, imgSrc.indexOf(".")) + "1.png");

        var txt = $(this).find("span").html();
        $(".infor_seconds div").removeClass("info_active");
        $(".live_seconds div").removeClass("live_active");
        switch (txt) {
            case "运营概览":
                $("title").html("运营概览");
                $("#pageContent").attr("src", "page/index.html");
                break;
            case "用户管理":
                $("title").html("用户管理");
                $("#pageContent").attr("src", "page/user_management.html");
                break;
            case "商家管理":
                $("title").html("商家管理");
                $("#pageContent").attr("src", "page/business_management.html");
                break;
            case "商品管理":
                $("title").html("商品管理");
                $("#pageContent").attr("src", "page/product_management.html");
                break;
            case "订单管理":
                $("title").html("订单管理");
                $("#pageContent").attr("src", "page/order_management.html");
                break;
            case "赛事管理":
                $("title").html("赛事管理");
                $("#pageContent").attr("src", "page/match_management.html");
                break;
            case "信息管理":
                $("title").html("信息管理");
                $(".infor_seconds").slideToggle();
                $(".infor_seconds div").eq(0).trigger("click");
                $(this).removeClass("active")
                var imgSrc = $(this).find("img").attr("src");
                $(this).find("img").attr("src", imgSrc.substring(0, imgSrc.indexOf("1")) + ".png");
                break;
            case "客服消息":
                $("title").html("客服消息");
                $("#pageContent").attr("src", "");
                break;
            case "消息推送":
                $("title").html("消息推送");
                $("#pageContent").attr("src", "page/message_push.html");
                break;
            case "内容推荐":
                $("title").html("内容推荐");
                $("#pageContent").attr("src", "page/content_push.html");
                break;
            case "平台设置":
                $("title").html("平台设置");
                $("#pageContent").attr("src", "page/platform_set.html");
                break;
            case "直播管理":
                $("title").html("直播管理");
                $(this).removeClass("active");
                var imgSrc = $(this).find("img").attr("src");
                $(".live_seconds").slideToggle();
                $(".live_seconds div").eq(0).trigger("click");
                $(this).find("img").attr("src", imgSrc.substring(0, imgSrc.indexOf("1")) + ".png");
                // $("#pageContent").attr("src", "page/live_management.html");
                break;
        }
        // setHomeHeight();
    });
    $(".infor_seconds div").on("click", function(ev) {
        ev.stopPropagation();
        $("#home_list_box").find("li").removeClass("active");
        $("#home_list_box").find("li img").each(function(i) {
            var imgSrc = $("#home_list_box").find("li img").eq(i).attr("src");
            if (imgSrc.indexOf("1") >= 0) {
                imgSrc = imgSrc.split("1")[0] + ".png";
                $("#home_list_box").find("li img").eq(i).attr("src", imgSrc);
            }
        });
        $(".infor_seconds div").removeClass("info_active");
        $(this).addClass("info_active");
        var _index = $(this).index();
        if (_index == 0) {
            $("#pageContent").attr("src", "page/information_business.html?channelType=business");
        } else {
            $("#pageContent").attr("src", "page/information_loft.html?channelType=oneloft");
        }
    });
    //视频直播
    $(".live_seconds div").on("click", function(ev) {
        ev.stopPropagation();
        $("#home_list_box").find("li").removeClass("active");
        $("#home_list_box").find("li img").each(function(i) {
            var imgSrc = $("#home_list_box").find("li img").eq(i).attr("src");
            if (imgSrc.indexOf("1") >= 0) {
                imgSrc = imgSrc.split("1")[0] + ".png";
                $("#home_list_box").find("li img").eq(i).attr("src", imgSrc);
            }
        });
        $(".live_seconds div").removeClass("live_active");
        $(this).addClass("live_active");
        var _index = $(this).index();
        if (_index == 0) { //直播申请
            $("#pageContent").attr("src", "page/live_apply_management.html");
        } else { //视频回放
            $("#pageContent").attr("src", "page/live_play_management.html");
        }
    });

    //存cookie
    function Setcookie(name, value) {
        //设置名称为name,值为value的Cookie
        var expdate = new Date(); //初始化时间
        expdate.setTime(expdate.getTime() + 30 * 60 * 1000); //时间单位毫秒
        document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
        //即document.cookie= name+"="+value+";path=/";  时间默认为当前会话可以不要，但路径要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！
    }

    var bodyHeight = document.documentElement.clientHeight;
    var pageContent = document.getElementById("pageContent");
    var homeLeft = document.getElementById("homeLeft");
    pageContent.style.height = bodyHeight + "px";
    homeLeft.style.height = bodyHeight + "px";
    var mobile = getParameter("mobile");
    Setcookie("mobile", mobile);
    $("#mobile").html(mobile);
})