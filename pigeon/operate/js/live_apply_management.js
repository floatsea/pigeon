//假数据
var data = {
    "processDate": "2018-08-24 18:35:46",
    "msg": "接口成功执行",
    "data": {
        "pageNum": "",
        "pages": "",
        "total": "3",
        "list": [{
                "liveId": "1",
                "userId": "2",
                "userType": "2", //直播人类型(客户: 0, 商家: 1, 公棚: 2, 运营: 3),
                "liveStatus": "0", //直播状态(0: 申请中, 1: 已通过, 2: 已拒绝),
                "application": "直播申请描述",
                "appliedTime": "直播申请时间",
                "estimation": "直播申请通过或者拒绝原因",
                "estimatedTime": "直播申请评估时间",
                "estimateId": "直播申请评估人编号"
            },
            {
                "liveId": "2",
                "userId": "3",
                "userType": "2", //直播人类型(客户: 0, 商家: 1, 公棚: 2, 运营: 3),
                "liveStatus": "0", //直播状态(0: 申请中, 1: 已通过, 2: 已拒绝),
                "application": "直播申请描述",
                "appliedTime": "直播申请时间",
                "estimation": "直播申请通过或者拒绝原因",
                "estimatedTime": "直播申请评估时间",
                "estimateId": "直播申请评估人编号"
            },
            {
                "liveId": "3",
                "userId": "4",
                "userType": "2", //直播人类型(客户: 0, 商家: 1, 公棚: 2, 运营: 3),
                "liveStatus": "0", //直播状态(0: 申请中, 1: 已通过, 2: 已拒绝),
                "application": "直播申请描述",
                "appliedTime": "直播申请时间",
                "estimation": "直播申请通过或者拒绝原因",
                "estimatedTime": "直播申请评估时间",
                "estimateId": "直播申请评估人编号"
            }
        ]
    },
    "code": "0"
}

var liveApplyObj = {
    /**
     * 53、直播列表接口
     * http://域名/operator/live/findList
     */
    getLiveRequest: function(postData) {
        $.ajax({
            url: location.origin + "/operator/live/findList",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    var total = data.data.total;
                    var liveList = data.data.list;
                    liveApplyObj.getPageNumer(total); //分页
                    liveApplyObj.getLiveList(liveList); //获取直播列表
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
                var total = data.data.total;
                var liveList = data.data.list;
                liveApplyObj.getPageNumer(total); //分页
                liveApplyObj.getLiveList(liveList); //获取直播列表
            }
        });
    },
    getLiveList: function(list) {
        var listStr = "";
        if (list.length == 0) {
            listStr = "没有查询到数据";
        } else {
            list.forEach(function(val) {
                listStr += '<tr liveId="' + val.liveId + '" userId="' + val.userId + '" userType="' + liveApplyObj.getLivePerson(val.userType) + '" liveInfo="' + encodeURI(JSON.stringify(val)) + '">' +
                    '<td>' +
                    '<input type="checkbox">' +
                    '<label for=""></label>' +
                    '</td>' +
                    '<td>' +
                    '<div style="line-height:90px;">' + val.application +
                    '</div>' +
                    '</td>' +
                    '<td>' + val.appliedTime + '</td>' +
                    '<td>' + val.estimateId + '</td>' +
                    '<td>' + liveApplyObj.getLivePerson(val.userType) + '</td>' +
                    '<td>' + liveApplyObj.getLiveStatus(val.liveStatus) + '</td>' +
                    '<td>' +
                    '<span class="editor_btn">查看详情</span> |' +
                    '<span class="del_btn">删除</span>' +
                    '</td>' +
                    '</tr>'
            });
        }
        $("#waiting_cont").html(listStr);
    },
    getLivePerson(statusCode) {
        switch (statusCode + "") {
            case "0":
                return "客户";
            case "1":
                return "商家";
            case "2":
                return "公棚";
            case "3":
                return "运营"
        }
    },
    getLiveStatus(liveStatus) {
        switch (liveStatus + "") {
            case "0":
                return "申请中";
            case "1":
                return "已通过";
            case "2":
                return "已拒绝";
        }
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
    },
    /**
     * 54、直播审核接口
     * 审核（通过/拒审）
     * http://域名/operator/live/editEstimate
     */
    liveApplyRequest: function(applyData) {
        $.ajax({
            url: location.origin + "/operator/live/editEstimate",
            type: "post",
            data: JSON.stringify(applyData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    callback && callback();
                    myAlert.createBox("提交成功");
                } else {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    /*
     *  没有删除接口
     */
    delLiveList: function(delData, callback) {
        $.ajax({
            url: location.origin + "",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    callback && callback();
                    myAlert.createBox("删除成功");
                }
            },
            error: function() {
                callback && callback();
                myAlert.createBox("没有删除接口");
            }
        });
    }
};