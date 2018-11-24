var businessid = getParameter("businessid") || "";
var openid = getParameter("openid") || "";
var scrollFlag = true; //滚动加载标志
/**
 * 整个页面分2部分
 * 1、轮播图  商家详情接口   http://域名/customer/business/find
 * 2、鸽子列表    http://域名/customer/pigeon/findList
 * 2.1、筛选    
 * 2.2、升序、降序
 */
var pigeonStr = ""; //鸽子列表
var businessDetailObj = {
    getSwiperData: function() { //获取swiper数据
        $.ajax({
            url: location.origin + "/customer/business/find",
            type: "post",
            data: JSON.stringify({ "businessId": businessid }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                //
                if (data.code == "0") {
                    var obj = data.data;
                    businessDetailObj.createSwiperDom(obj);
                    businessDetailObj.setBusinessBanner(obj); //店铺标题及资讯
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
    createSwiperDom: function(obj) { //循环数据创建dom元素
        var bgImgList = obj.shopShow.images;
        var imgStr = "";
        bgImgList.forEach(function(val) {
            imgStr += '<div class="swiper-slide">' +
                '<img src="' + val.img + '" alt="" />' +
                '</div>';
        });
        $("#swiper_box").html(imgStr);
        //轮播插件
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            loop: true,
            autoplay: 1500,
            grabCursor: true,
            paginationClickable: true
        });
    },
    setBusinessBanner: function(obj) { //设置banner标题、资讯等
        setLocVal("shopName", (obj.shopName || obj.shopNameEn)); //店铺名称
        setLocVal("shopDesc", (obj.shopDesc || obj.shopDescEn||""));//商家简介
        // setLocVal("shopName", (obj.shopName || obj.shopNameEn));

        $("#banner_tit h5").html((obj.shopName || obj.shopNameEn)); //店铺名称
        $("#banner_tit h5").attr("shopName", (obj.shopName || obj.shopNameEn))
        $("#banner_tit p").html(obj.shopIntro || obj.shopIntroEn) //特色描述
            //资讯
        var msgStr = "";
        obj.newses.forEach(function(val, index) {
            msgStr += '<div>' +
                '<p>' + val.newsTitle + '</p>' +
                '<i>2018-03-17</i></div>';
        });
        $("#msg_box").html(msgStr);
        var msgScrollDom = $("#msg_box").get(0);
        businessDetailObj.setMsgScroll(msgScrollDom);
    },
    setMsgScroll: function(dom) { //设置资讯滚动
        if (dom.children.length > 1) {
            var top = 0;
            var timer = setInterval(function() {
                top -= 1;
                if (top == -(dom.offsetHeight - dom.children[0].offsetHeight)) {

                    top = 0;
                }
                dom.style.top = top + "px"
            }, 20)
        }
    },
    /**
     * 初始化鸽子数据  接口4
     * @params pigeonPostData //接口请求入参
     * @params detailType //判断是 "列表视图" 还是 "橱窗视图"
     */
    getPigeonData: function(pigeonPostData, detailType) {
        $.ajax({
            url: location.origin + "/customer/pigeon/findList",
            type: "post",
            data: JSON.stringify(pigeonPostData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                //
                if (pigeonPostData.pageNum==1){
                    $("#list_view_box").html("");
                }
                if (data.code == "0") {
                    var list = data.data.list;
                    scrollFlag = data.data.hasNextPage;
                    if (list.length > 0) {
                        if (detailType == "list") {
                            businessDetailObj.createPigeonList(list);
                        } else {
                            businessDetailObj.createPigeonView(list);
                        }
                        if (!scrollFlag) {
                            $(".load_more img").hide();
                            $("#load_more_txt").html("没有更多数据~");
                            return;
                        } else {
                            $(".load_more img").hide();
                            $("#load_more_txt").html("上拉加载更多");
                        }
                    }
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    //创建鸽子列表
    createPigeonList: function(questPigeonList) {
        // var shopName = $("#banner_tit h5").attr("shopName");
        var pigeonStr = "";
        questPigeonList.forEach(function(val) {
            pigeonStr += '<li class="list_images_n clearfix" pigeonId="' + val.pigeonId + '">' +
                '<div class="list_images_l">' +
                '<img src="' + val.pigeonShow.images[0].img + '">' +
                '</div>' +
                '<div class="list_images_r">' +
                '<p class="list_images_rn">' + (val.pigeonName || val.pigeonNameEn) +
                '<span class="pigeon_no">' + val.pigeonNo + '</span>' +
                '</p>' +
                '<p class="list_images_rl">' + (val.pigeonPoint || val.pigeonPointEn) + '</p>' +
                '<p class="dove_price1"><span>&yen</span>' + (val.pigeonPrice || val.pigeonPriceUsd) + '元</p>' +
                '<div class="seller1">' +
                '<img src="../image/dinw.jpg" />' +
                '<p>卖家：' + val.shopName + '</p>' +
                '</div>' +
                '</div>' +
                '</li> ';
        })
        $("#list_view_box").append(pigeonStr);
    },
    //橱窗视图
    createPigeonView: function(list) {
        // var shopName = $("#banner_tit h5").attr("shopName"); //商家名称
        var pigeonStr = "";
        list.forEach(function(val) {
            pigeonStr += '<li pigeonId="' + val.pigeonId + '">' +
                '<div class="dove_pic">' +
                '<img src="../image/tp.png" />' +
                '</div>' +
                '<p class="dove_label">' + val.pigeonNo + '</p>' +
                '<p class="dove_name">' + (val.pigeonName || val.pigeonNameEn) + '</p>' +
                '<p class="dove_content">' + (val.pigeonPoint || val.pigeonPointEn) + '</p>' +
                '<p class="dove_price"><span>&yen</span>' + (val.pigeonPrice || val.pigeonPriceUsd) + '元</p>' +
                '<div class="seller">' +
                '<img src="../image/dinw.jpg" />' +
                '<p>卖家：' + val.shopName + '</p>' +
                '</div>' +
                '</li>';
        })
        $("#pigeon_view_box").append(pigeonStr);
    },
    //筛选  显示方法
    getScreen: function($this) {
        if ($this.hasClass("active")) {
            $this.removeClass("active");
        } else {
            $this.parent().find("span").removeClass("active");
            $this.addClass("active");
        }
    },
    findSiteConfig(){
        $.ajax({
            url: location.origin + "/customer/configSystem/findSiteConfig",
            type: "post",
            data: JSON.stringify({}),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.code == "0") {
                    console.log(data);
                } else if (data.code == "401") {
                    getLogin({
                        "openId": openid
                    }, businessDetailObj.findSiteConfig);
                }
            },
            error: function () {
                myAlert.createBox("服务器开小差！");
            }
        })
    }
}