/**
 * 没有接口
 * 2018-09-25
 */
var openid = getParameter("openid ") || "";
var orderid = getParameter("orderid") || "";
var orderDetailObj = {
    initPageRequest: function(postData) {
        $.ajax({
            url: location.origin + " ",
            type: "post ",
            data: JSON.stringify(postData),
            dataType: "json ",
            contentType: "application/json ",
            success: function(data) {
                if (data.code == "0 ") {
                    var list = data.data.list;
                    orderDetailObj.createOrder(list); //创建列表
                    orderDetailObj.showOrderInfo();
                    orderDetailObj.showPayInfo();
                    orderDetailObj.showLogistics();
                }else if(data.code == "401"){
                    getLogin({
                        "openId": openid
                    });
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！ ")
            }
        })
    },
    createOrder: function(list) {
        var orderListStr = "";
        list.forEach(function(val) {
            orderListStr += '<li class="order_for_singe clearfix">' +
                '<div class="order_for_l">' +
                '<img src="../image/jfs.png">' +
                '<div class="order_for_z">' +
                '<p class="order_for_zl">白明星</p>' +
                '<p class="order_for_zr">DV01769-18-09</p>' +
                '</div>' +
                '</div>' +
                '<p class="order_for_r">¥3888.00</p>' +
                '</li>';
        });
        $("#order_list").html(orderListStr);
    },
    showOrderInfo: function() {
        $("#order_money").html(""); //订单金额
        $("#create_time").html(""); //下单时间
    },
    showPayInfo: function(payinfo) { //支付信息
        $("#pay_date").html(""); //支付时间
        $("#pay_type").html(""); //支付方式
        $("#bank_name").html(""); //支付银行
    },
    showLogistics: function(logisticsinfo) { //物流信息
        $("#send_date").html(""); //发货时间
        $("#carrier").html(""); //承运方
        $("#logistics_num").html(""); //物流单号
    }
}