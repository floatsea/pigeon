//页面初始化
/**
 * 2、公棚统计接口
 * http://域名/oneloft/statistics
 */
var indexObj = {
        initRequest: function(initData) {
            $.ajax({
                url: location.origin + "/oneloft/statistics",
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
                    myAlert.createBox("网络不给力！");
                }
            });
        },
        createDate: function(obj) {
            $("#raceNum").html(obj.races);
            $("#newsNum").html(obj.newses);
            $("#followNum").html(obj.follows);
            $("#personNum").html(obj.visitors);
            $("#signUp").html(obj.enrolls);
        }
    }
    //方法调用
$(function() {
    var initData = {};
    indexObj.initRequest(initData);
})