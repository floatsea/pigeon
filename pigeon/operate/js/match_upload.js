/**
 *47、赛事详情接口 获取赛程
 * http://域名/operator/race/find
 */
var raceId = getParameter("raceId") || "";
var uploadObj = {
    getListRequest: function(listData) { //获取初始化数据
        $.ajax({
            url: location.origin + "/operator/race/find",
            type: "post",
            data: JSON.stringify(listData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var list = data.data.raceitems;
                    uploadObj.createList(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    createList: function(list) {
        var str = "";
        list.forEach(function(val, index) {
            var statusStr = "";
            if (val.status == 0) { //没有该状态
                statusStr = '<span style="border-bottom:1px solid #000;">已导入(45)</span>'
            } else {
                statusStr = '<div class="match_info_btn">' +
                    '<input type="file" id="upfile' + index + '" name="upfile" class="input_upload" accept=".xls,.doc,.txt,.pdf"> 选择文件' +
                    '</div>';
            }
            str += '<tr raceId="' + raceId + '" raceitemId="' + val.raceitemId + '">' +
                '<td>' +
                '<span>' + (index + 1) + '</span>' +
                '</td>' +
                '<td>' +
                '<span>' + val.raceitemTitile + '</span>' +
                '</td>' +
                '<td>' + val.startedPlace + '</td>' +
                '<td>' + val.distance + 'km</td>' +
                '<td>' +
                '<p>' + val.startedTime + '</p>' +
                '</td>' +
                '<td>' + statusStr + '</td>' +
                '</tr>';
        });
        $("#match_list").html(str);
    },
    //获取分页的页码
    // getPageNumer: function(totalNum) {
    //     var liStr = "";
    //     var pageNum = Math.ceil(totalNum / 20);
    //     var cls = "";
    //     for (var i = 0; i < pageNum; i++) {
    //         if (i == 0) {
    //             cls = "active"
    //         } else {
    //             cls = ""
    //         }
    //         liStr += '<li class="' + cls + '">' + (i + 1) + '</li>'
    //     }
    //     $("#page_btn ul").html(liStr);
    //     $("#total_num").html(totalNum);
    // },
    /**
     * 32、上传赛事成绩接口
     * http://域名/operator/raceitem/edit
     */
    upRace: function(upData, callback) {
        $.ajax({
            url: location.origin + "/operator/raceitem/edit",
            type: "post",
            data: JSON.stringify(upData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("上传成功！");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    /**
     * 36、赛事报名导入接口
     * http://域名/operator/enroll/addByImport
     */
    downLoad: function() {
        $.ajax({
            url: location.origin + "/operator/enroll/addByImport",
            type: "post",
            data: JSON.stringify({ "raceId": raceId }),
            dataType: "json",
            //processData: false,
            //contentType: false,
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("下载成功！");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    }
}