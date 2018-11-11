/**
 *页面共5部分
 *1、轮播
 *2、商家及鸽子列表 
 *3、banner
 *4、赛事
 *5、公棚
 */
var openid = getParameter("openid") || "omCIGj2MoPE0FCWCiPFIIc2BXUPs";
var Authorization = localStorage.getItem("Authorization") || "";
var postData = {
    "location": "116.341849 40.030749"
};
var token = "1234567890";
sessionStorage.setItem("location", "116.341849" + " " + "40.030749");
var indexObj = {
    //获取经纬度
    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(indexObj.showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    },
    showPosition: function(position) {
        var latitude = position.coords.latitude || "40.030749"; //纬度 40.030749
        var longitude = position.coords.longitude || "116.341849"; //经度 116.341849
        var locationStr = longitude + " " + latitude;
        postData = {
            "location": locationStr
        }
        sessionStorage.setItem("location", locationStr); //当前位置存起来，子页面用
        //alert("初始化请求入参====" + JSON.stringify(postData))
        //indexObj.initPageQuery(postData);
    },
    //初始化页面
    initPageQuery: function(postData, callback) {
        $.ajax({
            url: location.origin + "/customer/configSystem/findHomeConfig",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                $(".myLoading").hide();

                if (data.code == "0") {
                    var list = data.data.list;
                    list.forEach(function(val) {
                        switch (val.configCategory) {
                            case "slideshow": //轮播
                                indexObj.createSlider(val.configValue.images);
                                break;
                            case "pigeon": //种鸽（商家）
                                indexObj.createBusiness(val.configValue.businesses);
                                break;
                            case "advertisment": //广告位
                                indexObj.createBanner(val.configValue.images);
                                break;
                            case "race": //赛事
                                indexObj.createRace(val.configValue.races);
                                break;
                            case "oneloft": //公棚
                                indexObj.createLoft(val.configValue.onelofts)
                                break;
                        }
                    })
                }
            },
            error: function() {
                $(".myLoading").hide();
                var data = LIST;
                if (data.code == "0") {
                    var list = data.data.configSystems;
                    list.forEach(function(val) {
                        switch (val.configCategory) {
                            case "slideshow": //轮播
                                indexObj.createSlider(val.configValue.images);
                                break;
                            case "pigeon": //种鸽（商家）
                                indexObj.createBusiness(val.configValue.businesses);
                                break;
                            case "advertisment": //广告位
                                indexObj.createBanner(val.configValue.images);
                                break;
                            case "race": //赛事
                                indexObj.createRace(val.configValue.races);
                                break;
                            case "oneloft": //公棚
                                indexObj.createLoft(val.configValue.onelofts);
                                break;
                        }
                    })
                }
            }
        })
    },
    //创建轮播图列表
    createSlider: function(imgList) {
        var slideshowStr = ""; //轮播图
        imgList.forEach(function(imgVal) {
            slideshowStr += '<div class="swiper-slide">' +
                '<a href="' + imgVal.url + '">' +
                '<img src="' + imgVal.img + '" alt="' + imgVal.alt + '" />' +
                '</a>' +
                '</div>';
        });
        $("#swiper_box").html(slideshowStr);
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            loop: true,
            autoplay: 1500,
            grabCursor: true,
            paginationClickable: true
        });
    },
    //种鸽列表（创建商家）
    createBusiness: function(businessList) {
        var busiNameStr = ""; //商家名称
        var pigeonsStr = ""; //鸽子列表
        businessList.forEach(function(bVal, i) {
            var pigeonListStr = ""; //鸽子列表
            bVal.pigeons.forEach(function(pigeonVal) {
                pigeonListStr += '<li pigeonId="' + pigeonVal.pigeonId + '">' +
                    '<div class="pigeonImgContainer"><img src="' + pigeonVal.pigeonImg + '" alt=""></div>' +
                    '<h4>' + pigeonVal.pigeonName + '</h4>' +
                    '<p class="in_hot_type_txt">' + pigeonVal.pigeonDesc + '</p>' +
                    '<p class="in_hot_type_money">¥' + pigeonVal.pigeonPrice + '</p>' +
                    '</li>';
            })
            if (i == 0) {
                var cl = "in_hot_active";
                var ulCl = "active";
            } else {
                var cl = "";
                var ulCl = "";
            }
            busiNameStr += '<li pigeonCount="' + bVal.pigeonCount + '" businessId="' + bVal.businessId + '" class="' + cl + '">' + bVal.shopName + '</li>';
            pigeonsStr += '<ul class="' + ulCl + '">' + pigeonListStr + '</ul>';
        })
        $("#business_hot").html(busiNameStr);
        $("#hot_bird").html(pigeonsStr);
    },
    //创建banner
    createBanner: function(imageList) {
        var bannerStr = "";
        imageList.forEach(function(val) {
            bannerStr += '<li>' +
                '<a href="' + val.url + '">' +
                '<img src="' + val.img + '" alt=""/>' +
                '</a>' +
                '</li>';
        })
        $("#banner_box").html(bannerStr);
    },
    //创建赛事
    createRace: function(raceList) {
        var raceStr = "";
        raceList.forEach(function(val) {
            //当前时间和报名结束时间对比
            var dateStatus = new Date() - new Date(val.enrolledTime);
            //当前提起和开始时间对比
            var dateStatus1 = new Date() - new Date(val.startedTime);
            //当前日期和结束日期对比
            var dateStatus2 = new Date() - new Date(val.endedTime)
            var status = "";
            if (dateStatus < 0) {
                status = "报名中";
            } else if (dateStatus1 >= 0 && dateStatus2 <= 0) {
                status = "进行中";
            } else {
                status = "已结束";
            }
            var startedTime = val.startedTime.split(" ")[0];
            var endedTime = val.endedTime.split(" ")[0];
            raceStr += '<li class="clearfix" raceId="' + val.raceId + '">' +
                '<div class="in_new_l">' +
                '<span class="in_new_month">' + startedTime.split("-")[1] + '月</span>' +
                '<span class="in_new_day">' + startedTime.split("-")[2] + '</span>' +
                '<img src="image/s_round.png" class="in_new_round" endDate="' + endedTime + '"">' +
                '</div>' +
                '<div class="in_new_r">' +
                '<p class="in_new_r_tit">' + val.raceName + '</p>' +
                '<button>' + status + '</button>' +
                '<p class="in_new_r_exp">' + val.oneloftName + '</p>' +
                '<p class="in_new_r_money">' +
                '<img src="image/in_hot_king.png" alt="">' +
                '<span>总奖金<i>' + val.reward + '</i>万元</span>' +
                '</p>' +
                '</div>' +
                '</li>';
        })
        $("#dove_list").html(raceStr);
    },
    //创建公棚
    createLoft: function(onelofts) {
        var loftStr = "";
        onelofts.forEach(function(val) {
            var years = parseInt((new Date() - new Date(val.establishTime)) / (86400 * 1000 * 365));
            loftStr += '<li class="clearfix" oneloftId="' + val.oneloftId + '">' +
                '<div class="in_gp_list_l">' +
                '<img src="' + val.logo + '" alt="">' +
                '</div>' +
                '<div class="in_gp_list_r">' +
                '<h5>' + val.oneloftName + '</h5>' +
                '<div class="in_gp_list_r_type">' +
                '<span>' + (val.oneloftType == 0 ? '春棚' : '秋棚') + '</span>' +
                '<span>成立' + years + '年</span>' +
                '</div>' +
                '<div class="in_gp_list_r_address">' +
                '<img src="image/in_address.png" alt="">' +
                '<span>' + (val.cityCode || "") + '&nbsp 距离' + (val.distance || "") + 'km</span>' +
                '</div>' +
                '</div>' +
                '</li>';
        })
        $("#gp_list").html(loftStr);
    }
}
indexObj.getLocation();
indexObj.initPageQuery(postData);