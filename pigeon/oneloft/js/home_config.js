$(function() {
    $("#home_list_box").find("li").on("click", function() {
        $("#home_list_box").find("li").removeClass("active");
        $("#home_list_box").find("li").each(function(index) {
            var str = $("#home_list_box").find("li").eq(index).find("img").attr("src");
            var N = str.indexOf("1");
            if (N > -1) {
                $("#home_list_box").find("li").eq(index).find("img").attr("src", str.substring(0, N) + ".png");
            }

        })
        $(this).addClass("active")
        var _index = $(this).index();
        var imgSrc = $(this).find("img").attr("src");
        $(this).find("img").attr("src", imgSrc.substring(0, imgSrc.indexOf(".")) + "1.png");

        var txt = $(this).find("span").html();
        $(".infor_seconds div").removeClass("info_active");
        $(".live_seconds div").removeClass("live_active");
        switch (txt) {
            case "公棚概览":
                $("title").html("公棚概览");
                $("#pageContent").attr("src", "page/index.html");
                break;
            case "赛事管理":
                $("title").html("赛事管理");
                $("#pageContent").attr("src", "page/match_management.html");
                break;
            case "直播管理":
                $("title").html("直播管理");
                $(this).removeClass("active");
                var imgSrc = $(this).find("img").attr("src");
                $(".live_seconds").slideToggle();
                $(".live_seconds div").eq(0).trigger("click");
                $(this).find("img").attr("src", imgSrc.substring(0, imgSrc.indexOf("1")) + ".png");
                break;
            case "信息管理":
                $("title").html("信息管理");
                $("#pageContent").attr("src", "page/information_management.html");
                break;
            case "公棚设置":
                $("title").html("公棚设置");
                $("#pageContent").attr("src", "page/oneloft_information.html");
                break;
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
    var bodyHeight = document.documentElement.clientHeight;
    var pageContent = document.getElementById("pageContent");
    var homeLeft = document.getElementById("homeLeft");
    pageContent.style.height = bodyHeight + "px";
    homeLeft.style.height = bodyHeight + "px";
    var mobile = getParameter("mobile");
    $("#mobile").html(mobile);
})