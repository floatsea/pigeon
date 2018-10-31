var openid = getParameter("openid") || "abc";
var locationStr = sessionStorage.getItem("location"); //index.js存储，本页取
/**
 * 公棚列表
 * 1、关键字查询
 * 2、按发布时间、人气查询
 * 3、上拉加载更多
 * 4、接口5 公棚列表接口
 */
var scrollFlag = true;
var loftListStr = ""; //公棚列表dom
var loftListObj = {
    initLostQuest: function(postLoftData) { //初始化调接口获取数据
        $.ajax({
            url: location.origin + "/customer/oneloft/findList",
            type: "post",
            data: JSON.stringify(postLoftData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                //
                if (data.code == "0") {
                    var list = data.data.list;
                    loftListObj.createLoftist(list);
                    scrollFlag = data.data.hasNextPage;
                    if (scrollFlag) {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("上拉加载更多");
                    } else {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("没有更多的数据");
                        return;
                    }
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    createLoftist: function(list) { //创建赛事列表
        list.forEach(function(val) {
            var years = parseInt((new Date() - new Date(val.establishTime)) / (86400 * 1000 * 365));
            loftListStr += '<li class="clearfix paddingB" oneloftId="' + val.oneloftId + '">' +
                '<div class="loft_search_cnl">' +
                '<img src="' + val.oneloftShow.images[0].img + '">' +
                '</div>' +
                '<div class="loft_search_cnr">' +
                '<p class="cnr_name">' + val.oneloftName + '</p>' +
                '<p class="cnr_c">' +
                '<span class="cnr_Introduction">' + (val.oneloftType == 0 ? '春棚' : '秋棚') + '</span>' +
                '<span class="cnr_time">成立' + years + '年</span>' +
                '</p>' +
                '<p class="cnr_location">' +
                '<img src="../image/dinw.png">' +
                '<span>' + val.address + ' 距离' + (val.distance || 100) + 'km</span>' +
                '</p>' +
                '</div>' +
                '</li>';
        })
        $("#loft_list_box").append(loftListStr);
    }
}