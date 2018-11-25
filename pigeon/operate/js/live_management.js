var liveManagement = {
    /**
     * 53、直播列表接口
     * http://域名/operator/live/findList
     */
    initRequest: function(liveData, _index) {
        $.ajax({
            url: location.origin + "/operator/live/findList",
            type: "post",
            data: JSON.stringify(liveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (liveData.pageNum == "1") {
                        var total = data.data.total;
                        liveManagement.getPageNumer(total); //分页
                    }
                    var infoList = data.data.list;
                    if (_index == 0) {
                        liveManagement.getFinishLiveList(infoList); //已发布
                    } else {
                        liveManagement.getWaitingList(infoList); //待发布
                    }
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    //已发布
    getFinishLiveList: function(infoList) {
        var str = "";
        infoList.forEach(function(val) {
            str += '<tr>' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div style="line-height:90px;">' +
                '比利时亚精顿！国家赛' +
                '</div>' +
                '</td>' +
                '<td>2018-06-28 18:08</td>' +
                '<td>133****6456</td>' +
                '<td>天津宇航赛鸽公棚</td>' +
                '<td>' +
                '<span class="editor_btn">回放</span> |' +
                '<span class="del_btn">删除</span>' +
                '</td>' +
                '</tr>';
        });
        $("#already_cont").html(str);
    },
    //待发布
    getWaitingList: function(infoList) {
        var str = "";
        infoList.forEach(function(val) {
            str += '<tr>' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div style="line-height:90px;">' +
                '比利时亚精顿！国家赛' +
                '</div>' +
                '</td>' +
                '<td>2018-06-28 18:08</td>' +
                '<td>133****6456</td>' +
                '<td>天津宇航赛鸽公棚</td>' +
                '<td>已审核</td>' +
                '<td>' +
                '<span class="editor_btn">回放</span> |' +
                '<span class="del_btn">删除</span>' +
                '</td>' +
                '</tr>';
        });
        $("#waiting_cont").html(str);
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
     * 删除接口
     * 接口文档没有提供
     */
    deleteList: function(delData) {
        $.ajax({
            url: location.origin + "",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("删除成功");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    /**
     * 54、直播审核接口
     * http://域名/operator/live/editEstimate
     */
    audit: function(auditData) {
        $.ajax({
            url: location.origin + "/operator/live/editEstimate",
            type: "post",
            data: JSON.stringify(auditData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("发送成功");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    }
}