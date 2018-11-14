/*
 *涉及到的功能：
 *1、获取产品详情页存的数据
 *2、展示购物车列表
 *3、全选
 *4、提交，校验输入框
 *5、调接口：15下订单接口
 */

//获取产品详情页存的数据
var pigeonsInfoArr = JSON.parse(sessionStorage.getItem("pigeonsInfoArr"));

console.log(pigeonsInfoArr)
var Authorization = localStorage.getItem("Authorization") || "";
var openid = getParameter("openid");
var orderSureObj = {
    //初始化商家信息
    initPageItem: function(pigeonsInfoArr) {
        var initStr = "";
        pigeonsInfoArr.forEach(function(val, index) {
            initStr += '<div class="order_item_list" businessNum="' + index + '">' +
                '<div class="shop clearfix">' +
                '<label for="business' + index + '">' +
                '<div class="order-checkbox">' +
                '<input type="checkbox" class="j_check_item" id="business' + index + '">' +
                '<span></span>' +
                '</div>' +
                '<span class="shop_name">' +
                '<a href="javascript:;">' + val.shopName + '</a>' +
                '</span>' +
                '</label>' +
                '</div>' +
                '<ul class="item-list">' + orderSureObj.initPageUl(val.pigeonArr) + '</ul>' +
                '</div>'
        })
        $("#item_box").html(initStr);
    },
    //初始化每个商家的鸽子列表
    initPageUl: function(pigeonArr) {
        var ulStr = "";
        pigeonArr.forEach(function(val, index) {
            ulStr += '<li class="item-single clearfix" pigeonId="' + val.pigeonId + '" pieonNum="' + index + '">' +
                        '<div class="p_checkbox">' +
                            '<input type="checkbox" class="j_check" pigeonInfo="' + encodeURIComponent(JSON.stringify(val)) + '">' + //鸽子信息存储在checkbox内 提交时用
                            '<label for=""></label>' +
                        '</div>' +
                        '<div class="item_from">' +
                            '<img src="' + val.imgSrc + '" class="item_from_img">' +
                            '<div class="item_from_list">' +
                                '<p>' + val.pigeonName + '<i>' + val.pigeonNo + '</i></p>' +
                                '<p>' + val.pigeonPoint + '</p>' +
                                '<p class="item_from_pic">¥' + val.pigeonPrice + '元</p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';
        })
        return ulStr;
    },
    findCheckInp: function() {
        if ($("#item_box").find("input[type=checkbox]").length == $("#item_box").find("input[type=checkbox]:checked").length) {
            $("#check_all").prop("checked", true);
        } else {
            $("#check_all").prop("checked", false);
        }
    },
    changeAllPrice: function() {
        var Allprice = 0;
        $(".j_check:checked").each(function(index) {
            var json = decodeURIComponent($(".j_check:checked").eq(index).attr("pigeonInfo"));
            Allprice += parseInt(JSON.parse(json).pigeonPrice);
        })
        return Allprice;
    },
    submitOrder: function(orderData, callback) {
        Authorization = localStorage.getItem("Authorization") || "";
        $.ajax({
            url: location.origin + "/customer/orders/add",
            data: JSON.stringify(orderData),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == "0") {
                    myAlert.createBox("订单提交成功！");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！")
            }
        })
    }
}