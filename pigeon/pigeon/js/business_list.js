/**
 *查询所有商家列表
 */
var scrollFlag = true; //上拉加载更多 标识， true 可以加载， false不可加载
var openid = getParameter("openid");
var businessObj = {
    initPageQuery: function(businessData) {
        $.ajax({
            url: location.origin + "/customer/business/findList",
            type: "post",
            data: JSON.stringify(businessData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                //
                if (data.code == "0") {
                    var list = data.data.list;
                    if (list.length > 0) {
                        businessObj.createBusinessList(list);
                        scrollFlag = data.data.hasNextPage;
                        if (!scrollFlag) {
                            $(".load_more img").hide();
                            $("#load_more_txt").html("没有更多数据");
                        } else {
                            $(".load_more img").hide();
                            $("#load_more_txt").html("上拉加载更多");
                        }
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
    createBusinessList: function (list) {
        var businessListStr = "";
        list.forEach(function(val) {
            var showHide = val.pigeonCount == 0 ? "none" : "block";
            businessListStr = '<div class="breeding_pigeons">' +
                '<div class="breeding_pigeons_n">' +
                '<img src="' + val.shopShow.images[0].img + '">' +
                '<p display="' + showHide + '">' + val.pigeonCount + '羽幼正在热卖 ¥' + val.minPrice + '起</p>' +
                '</div>' +
                '<ul class="breeding_pigeons_m clearfix">' +
                '<li class="breeding_pigeons_name">' +
                '<p class="breeding_pigeons_names">' + (val.shopName || val.shopNameEn) + '</p>' +
                '<p class="breeding_pigeons_namex">' + (val.shopIntro || val.shopIntroEn) + '</p>' +
                '</li>' +
                '<li class="breeding_pigeons_price">' +
                '<p class="breeding_pigeons_go">' +
                '<a href="business_detail_list.html?businessid=' + val.businessId + '&openid=' + openid + '">进店逛逛</a>' +
                '</p>' +
                '</li>' +
                '</ul>' +
                '</div>';
            $("#list_box").append(businessListStr);
        })
    }
}