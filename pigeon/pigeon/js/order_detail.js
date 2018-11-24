/**
 * 订单详情页
 * 接口24 http://域名/operator/orders/find
 * 入参：orderId
 * 2018.10.01
 */
var orderId = getParameter("orderId") || "";
var shopName = decodeURI(getParameter("shopName")) || "";
var orderType = getParameter("orderType") || "";
var pigeonImgSrc = location.origin + "/operate/image/cp.png"; //默认鸽子图片
var orderDetailObj = {
    initPageRequest: function() {
        $.ajax({
            url: location.origin + "/operator/orders/find",
            type: "post",
            data: JSON.stringify({
                "orderId": orderId
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                var obj = data.data;
                orderDetailObj.updateData(obj);
            },
            error: function() {
                myAlert.createBox("网络不给力");
            },
        })
    },
    updateData: function(obj) {
        $("#orderId").html(obj.orderId); //订单编号
        $("#createdTime").html(obj.createdTime); //下单时间
        $("#buyer").html(obj.orderitems[0].userName); //买家
        $("#business").html(shopName); //卖家
        orderDetailObj.creatOrderList(obj);
        //0：待付款，1：待确认， 2：待发货， 3：待收货， 4：已完成，5：已取消，"":全部
        if (obj.orderStatus == 0 || obj.orderStatus == 5) { //待付款、已取消、2：待发货
            $("#pay_date").hide();
        } else {
            orderDetailObj.createPayInfo(obj);
            $("#pay_date").show();
        }
    },
    creatOrderList: function(obj) { //订单列表
        var str = "";
        var sumPrice = 0;
        obj.orderitems.forEach(function(val) {
            if (obj.orderStatus == 0 || obj.orderStatus == 1) {
                var logistics = "";
            } else {
                var logistics = orderDetailObj.createLogistics(val);
            }
            str += '<li>' +
                '<div class="order_all_cont clearfix">' +
                '<div>' +
                '<img src="' + (val.goodsDesc.pigeonPic || pigeonImgSrc) + '" alt="" style="width:100%">' +
                '</div>' +
                '<div>' +
                '<p>' + val.goodsDesc.pigeonName + ' ' + val.goodsDesc.pigeonNo +
                '</p>' +
                '<p>' +
                '<span>¥' + val.goodsPrice + '元</span>' +
                '</p>' +
                '</div>' +
                '</div>' + logistics +
                '</li>';
            sumPrice += Number(val.goodsPrice);
        })
        $("#sum_price").html(sumPrice + "元");
        $("#small_order_list").html(str);
    },
    createLogistics: function(logis) { //物流信息
        var expressStatus = logis.expressStatus == 0 ? "配送中" : '已签收';
        return '<div class="send_goods_date">' +
            '<div class="order_detail_tab order_grey clearfix" style="border-top:1px solid #ddd;">' +
            '<div>' +
            '<span>发货时间</span>' +
            '<span>' + (logis.deliveredTime || "无") + '</span>' +
            '</div>' +
            '<div>' +
            '<span>物流单号</span>' +
            '<span>' + (logis.expressNo || "无") + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="order_detail_tab clearfix">' +
            '<div>' +
            '<span>承&nbsp运&nbsp商</span>' +
            '<span>' + (logis.carrier || "无") + '</span>' +
            '</div>' +
            '<div>' +
            '<span>收&nbsp货&nbsp人</span>' +
            '<span>' + (logis.address.userName || "无") + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="order_detail_tab order_grey clearfix">' +
            '<div>' +
            '<span>收货地址</span>' +
            '<span>' + logis.address.address + '</span>' +
            '</div>' +
            '<div>' +
            '<span>物流状态</span>' +
            '<span>' + expressStatus + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
    },
    //支付方式
    createPayInfo: function(obj) {
        $("#paidTime").html(obj.paidTime || "无"); //支付时间
        var payWay = "无";
        if (obj.payway == 0) {
            payWay = "银行转账";
        }
        if (obj.payway == 1) {
            payWay = "微信";
        }
        if (obj.payway == 2) {
            payWay = "支付宝";
        }
        $("#payType").html(payWay); //支付方式
        var voucher = obj.voucher; //应该是个图片数组
        var imgStr = "";
        if (voucher && voucher.images.length > 0) {
            voucher.images.forEach(function(val) {
                imgStr += '<li>' +
                    '<img src="' + val.img + '" alt="">' +
                    '</li>';
            });
        } else {
            imgStr = "未上传支付凭证！";
        }
        $("#payImgList").html(imgStr);
    }
}