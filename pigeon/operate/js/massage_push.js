/**
 * 41、消息列表接口
 * http://域名/operator/message/find
 */
var msgListObj = {
    msgListRequest: function(msgData) {
        $.ajax({
            url: location.origin + "/operator/message/findList",
            type: "post",
            data: JSON.stringify(msgData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    var total = data.data.total;
                    var msgList = data.data.list;
                    msgListObj.getPageNumer(total); //分页
                    msgListObj.createMsgList(msgList); //创建dom
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    createMsgList: function(list) {
        var str = ""
        list.forEach(function(val) {
            str += '<tr messageId="'+val.messageId+'">' +
                '<td>' +
                '<span>' + val.messageTitle + '</span>' +
                '</td>' +
                '<td>' + val.preparedTime + '</td>' +
                '<td>' +
                '<span class="look_btn">查看</span>' +
                '</td>' +
                '</tr>';
        })
        $("#msg_list").html(str);
    },
    //获取分页的页码
    getPageNumer: function(totalNum) {
        var liStr = "";
        var pageNum = Math.ceil(totalNum / 20);
        var cls = "";
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) {
                cls = "active"
            } else {
                cls = ""
            }
            liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
        }
        $("#page_btn ul").html(liStr);
        $("#total_num").html(totalNum);
    }
}