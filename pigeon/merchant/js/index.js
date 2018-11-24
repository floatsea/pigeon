//页面初始化
/**
 * 2、商家统计接口
 * http://域名/business/statistics
 */
var indexObj = {
        initRequest: function(initData) {
            $.ajax({
                url: location.origin + "/business/statistics",
                type: "post",
                data: JSON.stringify(initData),
                dataType: "json",
                contentType: "application/json",
                success: function(data) {
                    if (data.code == "0") {
                        indexObj.createDate(data.data);
                    }
                },
                error: function() {
                    myAlert.createBox("网络不给力");
                }
            });
        },
        createDate: function(obj) {
            $("#pigeons").html(obj.pigeons);
            $("#ordersForSend").html(obj.ordersForSend);
            $("#newses").html(obj.newses);
            $("#messages").html(obj.messages);
            $("#visitors").html(obj.visitors);
            $("#ordersFinished").html(obj.ordersFinished);
            $("#sumAmount").html(obj.sumAmount);
            $("#sumPrice").html(obj.sumPrice);
        }
    }
    //方法调用
$(function() {
    var initData = {};
    indexObj.initRequest(initData);
})