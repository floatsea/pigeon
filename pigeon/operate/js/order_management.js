var businessId = getParameter("businessId") || ""; //有businessId：从商家列表页进入此页面，businessId为空时，说明是订单管理页面
var shopName = getParameter("businessId") || "";
var pigeonImgSrc = location.origin + "/operate/image/cp.png"; //默认鸽子图片
/**
 * 11、商家订单列表接口
 * http://域名/operator/orderitem/findList
 */
var orderListObj = {
    initRequest: function(postData) { //
        $.ajax({
            url: location.origin + "/operator/orderitem/findList",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    var orderList = data.data.list;
                    orderTotalNum = data.data.total; //数据总数
                    if (postData.orderitemStatus == 0) { //待付款
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "pay_total_num", "pay_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderPay(orderList);
                    }
                    if (postData.orderitemStatus == 1) { //待确认
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "pay_total_num2", "pay_page_btn2"); //获取分页页码
                        }
                        orderListObj.createOrderSure(orderList);
                    }
                    if (postData.orderitemStatus == 2) { //待发货
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "goods_total_num", "goods_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderGoods(orderList);
                    }
                    if (postData.orderitemStatus == 3) { // 待收货
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "collect_total_num", "collect_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderCollect(orderList);
                    }
                    if (postData.orderitemStatus == 4) { //已完成
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "finish_total_num", "finish_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderFinish(orderList);
                    }
                    if (postData.orderitemStatus == -1) { //已取消
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "cancel_total_num", "cancel_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderCancel(orderList);
                    }
                    if (postData.orderitemStatus == "") { //全部
                        if (postData.pageNum == "1") {
                            orderListObj.getPageNumer(orderTotalNum, "all_total_num", "all_page_btn"); //获取分页页码
                        }
                        orderListObj.createOrderAll(orderList);
                    }
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    getOrderitemStatus: function(_index) {
        switch (_index) {
            case 0: //待付款
                return 0;
            case 1: //待确认
                return 1;
            case 2: //待发货
                return 2;
            case 3: //待收货
                return 3;
            case 4: //已完成
                return 4;
            case 5: //已取消
                return -1;
            case 6: //全部
                return "";
        }
    },
    getPageNumer: function(totalNum, totalNumDom, btn) { //获取页码
        var liStr = "";
        $("#" + totalNumDom).html(totalNum); //数据总数
        var pageNum = Math.ceil(totalNum / 20);
        var cls = "";
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) { cls = "active" } else { cls = "" }
            liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
        }
        $("#" + btn).html(liStr);
    },
    //点击每个 page_btn
    clickPageBtn: function(postData, pageBtnDom, _this) {
        $("#" + pageBtnDom).find("li").removeClass("active");
        $(_this).addClass("active");
        orderListObj.initRequest(postData); //重新获取数据
    },
    createOrderPay: function(list) { //待付款
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                var cancelStatus = val.orderStatus == -1 ? "已取消" : "取消订单";
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td>' +
                    '<input type="checkbox">' +
                    '<label for=""></label>' +
                    '</td>' +
                    '<td>' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>' +
                    '<span class="send_pay_btn">发送付款提醒</span>' +
                    '<span class="collect_money_btn">确认收款</span>' +
                    '<span class="cancel_order_btn">' + cancelStatus + '</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_pay_box").html(listStr);
    },
    createOrderSure: function(list) { //待确认
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                var cancelStatus = val.orderStatus == -1 ? "已取消" : "取消订单";
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td>' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>' +
                    '<span class="collect_money_btn">确认收款</span>' +
                    '<span class="cancel_order_btn">' + cancelStatus + '</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_sure_box").html(listStr);
    },
    createOrderGoods: function(list) { //待发货
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }

        if (list.length > 0) {
            list.forEach(function(val) {
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td style="text-align:left;">' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '<br>' + (val.paidTime || "") + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + val.goodsDesc.shopName + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>|' +
                    '<span class="send_goods_btn">提醒卖家发货</span>|' +
                    '<span class="sendSure_goods_btn">确认发货</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_list_goods").html(listStr);
    },
    createOrderCollect: function(list) { //待收货
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td style="text-align:left;">' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '<br>' + val.paidTime + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>|' +
                    '<span class="collect_goods_btn">确认收货</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_list_collect").html(listStr);
    },
    createOrderFinish: function(list) { //已完成
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td style="text-align:left;">' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '<br>' + (val.paidTime || "-") + '<br>' + (val.deliveredTime || "-") + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>|' +
                    '<span class="sure_money_btn">确认打款</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_list_finish").html(listStr);
    },
    createOrderCancel: function(list) { //已取消
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td style="text-align:left;">' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '<br>' + (val.cancledTime || "-") + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_list_cancel").html(listStr);
    },
    createOrderAll: function(list) { //全部
        var listStr = "";
        if (list.length == 0) {
            listStr = "<p style='text-align:center; padding-top:30px;'>没有查询到数据</p>";
        }
        if (list.length > 0) {
            list.forEach(function(val) {
                listStr += '<tr orderId="' + val.orderId + '" orderitemId="' + val.orderitemId + '">' +
                    '<td style="text-align:left;">' +
                    '<div class="clearfix">' +
                    '<div  style="float:left;">' +
                    '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="">' +
                    '</div>' +
                    '<span class="order_list_pigeon">' + val.orderId + '<br>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo + '</span>' +
                    '</div>' +
                    '</td>' +
                    '<td>¥' + val.goodsPrice + '</td>' +
                    '<td>' + val.createdTime + '<br>' + (val.paidTime || "-") + '<br>' + (val.deliveredTime || "-") + '</td>' +
                    '<td>' + val.userName + '</td>' +
                    '<td class="shopName">' + (val.goodsDesc.shopName || val.goodsDesc.shop_name) + '</td>' +
                    '<td>' +
                    '<span class="order_detail">订单详情</span>' +
                    '</td>' +
                    '</tr>';
            });
        }
        $("#order_list_all").html(listStr);
    },
    /**
     * 25、发送付款提醒接口
     * http://域名/operator/message/sendPaymentReminding
     */
    sendPayMsg: function(sendPayData, callback) {
        $.ajax({
            url: location.origin + "/operator/message/sendPaymentReminding",
            type: "post",
            data: JSON.stringify(sendPayData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("发送成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 26、运营确认收款接口
     * 接口地址：http://域名/operator/orders/confirmCustomerPaid
     */
    collectMoneyMsg: function(collectData, callback) {
        $.ajax({
            url: location.origin + "/operator/orders/confirmCustomerPaid",
            type: "post",
            data: JSON.stringify(collectData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("发送成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 28、发货提醒接口（消息发送接口）
     * http://域名/operator/message/sendDeliveryReminding
     */
    sendGoodsMsg: function(sendGoodsData, callback) {
        $.ajax({
            url: location.origin + "/operator/message/sendDeliveryReminding",
            type: "post",
            data: JSON.stringify(sendGoodsData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("发送成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 48、收货确认接口
     *http://域名/operator/orderitem/confirmReceived
     */
    collectGoods: function(collectGoodsData, callback) {
        $.ajax({
            url: location.origin + "/operator/orderitem/confirmReceived",
            type: "post",
            data: JSON.stringify(collectGoodsData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("发送成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 29、确认打款给商家接口
     * http://域名/operator/confirmPaidBusiness
     */
    sureMoney: function(sureMoneyData, callback) {
        $.ajax({
            url: location.origin + "/operator/orderitem/confirmPaidBusiness",
            type: "post",
            data: JSON.stringify(sureMoneyData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("发送成功");
                    callback && callback();
                } else {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 27、取消订单接口
     * http://域名/operator/orders/editCancled
     */
    cancelOrder: function(cancelOrder, callback) {
        $.ajax({
            url: location.origin + "/operator/orders/editCancled",
            type: "post",
            data: JSON.stringify(cancelOrder),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("订单取消成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 51、确认卖家发货
     * 待发货 
     * http://域名/operator/orderitem/confirmBusinessDelivery
     */
    sendSureGoodsMsg: function(sureSendData, callback) {
        $.ajax({
            url: location.origin + "/operator/orderitem/confirmBusinessDelivery",
            type: "post",
            data: JSON.stringify(sureSendData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("确认发货成功");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}