var messageId = getParameter("messageId")||"";

var msgDetailObj = {
    /**
     * 41、消息详情接口
     * http://域名/operator/message/find
     */
    initRequest: function() {
        $.ajax({
            url: location.origin + "/operator/message/find",
            type: "post",
            data: JSON.stringify({
                "messageId": messageId
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    msgDetailObj.createInfo(data);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    //赋值
    createInfo: function(data) {
        $("#msg_tit").prop("readonly",true).html(data.messageTitle); //消息标题
        $("#msg_detail").prop("readonly",true).html(data.messageContent);
    },
    /**
     * 消息 “保存” 接口
     * 
     */
    saveMsg: function(saveData) {
        $.ajax({
            url: location.origin + "/operator/news/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
     /**
     * 新增 “消息” 接口
     *
     */
    addMsg: function() {
        $.ajax({
            url: location.origin + "",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    }
}