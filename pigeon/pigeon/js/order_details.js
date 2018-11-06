/**
 * 没有接口
 * 2018-09-25
 */
var openid = getParameter("openid") || "";
var orderid = getParameter("orderid") || "";
var priceSum = 0;

var PAYWAY = ["银行转账", "微信", "支付宝"];
var orderDetailObj = {
    initPageRequest: function() {
        $.ajax({
            url: location.origin + " ",
            type: "post ",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization},
            success: function(data) {
                if (data.code == "0") {
                    var list = data.data.orderitems;
                    orderDetailObj.createOrder(list); //创建列表
                    orderDetailObj.showOrderInfo(data.data);
                    orderDetailObj.showPayInfo(data.data);
                    orderDetailObj.showLogistics(data.data);
                }else if(data.code == "401"){
                    // reloadToken();
                    getLogin({
                        "openId": openid
                    }, orderDetailObj.initPageRequest);//, 
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
            priceSum += val.goodsPrice;
            orderListStr += '<li class="order_for_singe clearfix">' +
                '<div class="order_for_l">' +
                '<img src="' + val.goodsDesc.pigeonPic+'">' +
                '<div class="order_for_z">' +
                '<p class="order_for_zl">' + val.goodsDesc.pigeonName +'</p>' +
                '<p class="order_for_zr">' + val.goodsDesc.pigeonNo +'</p>' +
                '</div>' + 
                '</div>' +
                '<p class="order_for_r">¥' + val.goodsPrice +'</p>' +
                '</li>';
        });
        $("#order_list").html(orderListStr);
    },
    showOrderInfo: function(data) {
        $("#order_money").html("￥"+priceSum); //订单金额
        $("#create_time").html(data.createdTime); //下单时间
    },
    showPayInfo: function(data) { //支付信息
        $("#pay_date").html(data.paidTime); //支付时间
        $("#pay_type").html(PAYWAY[data.payway]); //支付方式
        $("#bank_name").html(""); //支付银行
    },
    showLogistics: function(logisticsinfo) { //物流信息
        $("#send_date").html(""); //发货时间
        $("#carrier").html(""); //承运方
        $("#logistics_num").html(""); //物流单号
    }
}
var postData = { "orderId": orderid};
var Authorization = localStorage.getItem("Authorization")||"";
orderDetailObj.initPageRequest(postData);
