var oneloftId = getParameter("oneloftId") || ""; //有oneloftId：从公棚列表页进来
/**
 * 17、赛事列表接口
 * http://域名/oneloft/race/findList
 */
var matchListObj = {
    matchListRequest: function(matchListData, _index) {
        $.ajax({
            url: location.origin + "/oneloft/race/findList",
            type: "post",
            data: JSON.stringify(matchListData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                //errorToken(data.code);
                if (data.code == "0") {
                    if (matchListData.pageNum == "1") {
                        var total = data.data.total;
                        matchListObj.getPageNumer(total); //分页
                    }
                    var infoList = data.data.list;
                    if (_index == 0) {
                        matchListObj.onGoingCreateList(infoList); //进行中
                    } else {
                        matchListObj.finishedCreateList(infoList); //已结束
                    }
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
                var infoList = [1, 2, 3];
            }
        });
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
     * 赛事 进行中
     */
    onGoingCreateList: function(infoList) {
        var str = "";
        infoList.forEach(function(val) {
            str += '<tr raceId="' +
                val.raceId + '" oneloftId="' + val.oneloftId + '" >' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<span>' + val.raceTitile + '</span>' +
                '</td>' +
                '<td class="sign_up"><span>' + val.enrollCount + '</span></td>' +
                '<td>' +
                '<p>' + val.startedTime + '起</p>' +
                '<p>' + val.endedTime + '止</p>' +
                '</td>' +
                '<td>' + val.oneloftName + '</td>' +
                '<td>' +
                '<span class="editor_btn">编辑</span><br>' +
                '<span class="set_finish">设为结束</span><br>' +
                '<span class="match_upload">上传比赛成绩单</span><br>' +
                '<span class="del_race">删除</span>' +
                '</td>' +
                '</tr>';
        });
        $("#match_list").html(str);
    },
    /**
     * 赛事 已结束
     */
    finishedCreateList: function(infoList) {
        var str = "";
        infoList.forEach(function(val) {
            str += '<tr raceId="' + val.raceId + '" oneloftId="' + val.oneloftId + '">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<span>' + val.raceTitile + '</span>' +
                '</td>' +
                '<td class="sign_up"><span>' + val.enrollCount + '</span></td>' +
                '<td>' +
                '<p>' + val.startedTime + '起</p>' +
                '<p>' + val.endedTime + '止</p>' +
                '</td>' +
                '<td>' + val.oneloftName + '</td>' +
                '<td>' +
                '<span class="editor_btn">编辑</span><br>' +
                '<span class="match_upload">查看比赛成绩</span><br>' +
                '<span class="del_race">删除</span>' +
                '</td>' +
                '</tr>';
        })
        $("#match_list").html(str);
    },
    /**
     * 10、赛事删除接口
     * http://域名/oneloft/race/del
     */
    deleteRace: function(delData, callback) {
        $.ajax({
            url: location.origin + "/oneloft/race/del",
            type: "post",
            data: JSON.stringify(delData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    },
    /**
     *设为已结束
     * 没有接口
     */
    setFinishRace: function(finishData, callback) {
        $.ajax({
            url: location.origin + "",
            type: "post",
            data: JSON.stringify(finishData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    }
}