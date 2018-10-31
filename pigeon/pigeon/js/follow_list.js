var Authorization = localStorage.getItem("Authorization") || "";
var openid = getParameter("openid");
var scrollFlag = true;
var followListObj = {
    /**
     * 22、关注列表接口（鸽子、赛事）
     * 客户:0,商家:1,工棚:2,运营:3,信鸽:4,赛事:5.
     */
    initPageListRequest: function(followData) {
        $.ajax({
            url: location.origin + "/customer/follow/findList",
            type: "post",
            data: JSON.stringify(followData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                //
                if (data.code == "0") {
                    var list = data.data.list;
                    if (followData.followType == 4) { //商品
                        followListObj.getPigeons(list);
                    }
                    if (followData.followType == 2) { //公棚
                        followListObj.getLofts(list);
                    }
                    scrollFlag = data.data.hasNextPage;
                    if (!scrollFlag) {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("没有更多数据");
                    } else {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("上拉加载更多");
                    }
                } else if (data.code == "401") {
                    getLogin({
                        "openId": openid
                    });
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差~");
            }
        });
    },
    getPigeons: function(list) {
        var str = "";
        list.forEach(function(val) {
            str += '<li pigeonId="' + val.pigeonId + '" class="list_images_n">' +
                '<div class="list_cont clearfix">' +
                '<div class="list_images_l">' +
                '<img src="' + val.pigeonShow.images[0].img + '">' +
                '</div>' +
                '<div class="list_images_r">' +
                '<p class="list_images_rn">' +
                (val.pigeonName || val.pigeonNameEn) +
                '<span>' + val.pigeonNo + '</span>' +
                '</p>' +
                '<p class="list_images_rl">' + val.pigeonPoint + '</p>' +
                '<p class="dove_price1">¥' + (val.pigeonPrice || val.pigeonPriceUsd) + '元</p>' +
                '<div class="seller1">' +
                '<img src="../image/or_detil.png" />' +
                '<p>卖家：' + val.shopName + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="collect_cancel_btn">' +
                '<span>取消关注</span>' +
                '</div>' +
                '</li>';
        })
        $("#my_collection").html(str);
    },
    getLofts: function(loftList) {
        var str = "";
        loftList.forEach(function(val) {
            str += '<li>' +
                '<h3>' + val.oneloftName + '收鸽数据' +
                '<img src="../image/vi.png" alt="" class="vedio_btn">' +
                '</h3>' +
                '<p>' +
                '<span>' + val.oneloftName + '</span>' +
                '<span>' + val.establishTime + '</span>' +
                '</p>' +
                '</li>';
        })
        $("#loft_box").html(str);
    },
    setMove: function(listBox) {
        var list = listBox.children;
        var btnW = document.querySelectorAll(".collect_cancel_btn")[0].offsetWidth;
        for (var i = 0; i < list.length; i++) {
            list[i].index = i;
            list[i].addEventListener("touchstart", function(ev) {
                var _this = this;
                console.log(this.index)
                var X = ev.touches[0].clientX;

                function Move(ev) {
                    ev.preventDefault();
                    var l = ev.touches[0].clientX - X;
                    if (l <= -btnW - 10) {
                        l = -btnW - 10;
                    }
                    if (l >= 0) {
                        l = 0
                    }
                    _this.style.left = l + "px";
                }

                function End() {
                    _this.removeEventListener("touchmove", Move, false)
                    _this.removeEventListener("touchend", End, false)
                }
                _this.addEventListener("touchmove", Move, false)
                _this.addEventListener("touchend", End, false)
            }, false)
        }
    }
};