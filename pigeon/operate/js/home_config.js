$(function() {
    $("#home_list_box").find("li").on("click", function() {
        $("#home_list_box").find("li").removeClass("active");
        $(".infor_seconds").hide();
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
                // $(".infor_seconds div").eq(0).trigger("click");
                //$(".infor_seconds").slideDown();
                $(".infor_seconds").slideDown();
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
                $("#pageContent").attr("src", "page/live_management.html");
                break;
        }
    });
    

    $(".infor_seconds div").on("click", function(ev) {
        ev.stopPropagation();
        var _index = $(this).index();
        if (_index == 0) {
            $("#pageContent").attr("src", "page/information_business.html?channelType=business");
        } else {
            $("#pageContent").attr("src", "page/information_loft.html?channelType=oneloft");
        }
    });

    var rightHeight = $("body").height();
    //$("#homeLeft").css("height",rightHeight);
})