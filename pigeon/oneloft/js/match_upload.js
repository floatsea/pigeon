/**
 *18、赛事详情接口
 * http://域名/oneloft/race/find
 */
var raceId = getParameter("raceId") || "";
var uploadObj = {
    getListRequest: function(listData) { //获取初始化数据
        $.ajax({
            url: location.origin + "/oneloft/race/find",
            type: "post",
            data: JSON.stringify(listData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    var list = data.data.raceitems;
                    uploadObj.createList(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
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
                    '<input type="file" class="input_upload"> 选择文件' +
                    '</div>';
            }
            str += '<tr raceId="' + raceId + '">' +
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
        $("#match_list").html(list);
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
     * 入参：{
            "raceitemId": 赛程id, ？在哪里取
            "raceitemResult": "成绩文件",
            }
     */
    upRace: function(upData, callback) {
        $.ajax({
            url: location.origin + "/operator/raceitem/edit",
            type: "post",
            data: JSON.stringify(upData),
            //dataType: "json",
            //processData: false,
            contentType: false,
            success: function(data) {
                if (data.code == 0) {
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    /**
     * 13、赛事报名导入接口 ？？
     * http://域名/oneloft/enroll/addByImport
     */
    downLoad: function(callback) {
        $.ajax({
            url: location.origin + "/oneloft/enroll/addByImport",
            type: "post",
            data: JSON.stringify({ "raceId": raceId }),
            dataType: "json",
            //processData: false,
            //contentType: false,
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
}