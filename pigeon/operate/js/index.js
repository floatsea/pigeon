var mobile = getCookie("mobile") || "";
//var postData = { "operatorId": mobile }
var postData = {};
var indexObj = {
    initRequest: function(postData) {
        $.ajax({
            url: location.origin + "/operator/statistics",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var data = data.data;
                    $("#cust_num").html(data.customers); //用户数
                    $("#merchant_num").html(data.businesses); //卖家数
                    $("#loft_num").html(data.onelofts); //公棚数

                    $("#commodity_num").html(data.pigeons); //商品数
                    $("#treated_order").html(data.ordersForPay); //待处理订单
                    $("#Deliver").html(data.ordersForSend); //待发货订单

                    $("#match").html(data.races); //赛事数
                    $("#information").html(data.newses); //资讯数
                    $("#msg").html(data.messages); //未读消息数

                    $("#visitor").html(data.visitors); //累积访客数
                    $("#deal_order").html(data.ordersFinished); //累积成交订单数
                    $("#amount").html(data.sumAmount); //累积成交金额
                    $("#money").html(data.sumPrice); //累积成交价格
                }
            },
            error: function() {
                // myAlert.createBox("网络不给力");
            }
        })
    }
}

$(function() {
    indexObj.initRequest(postData);
})