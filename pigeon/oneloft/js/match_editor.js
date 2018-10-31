var oneloftId = getParameter("oneloftId") || ""; //有oneloftId：公棚 “添加赛事”
var raceId = getParameter("raceId") || ""; //编辑
/**
 * 18、赛事详情接口
 * http://域名/oneloft/race/find
 */
var matchEditoObj = {
    matchInfo: function() {
        $.ajax({
            url: location.origin + "/oneloft/race/find",
            type: "post",
            data: JSON.stringify({ "raceId": raceId }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    matchEditoObj.createInfo(data.data);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    },
    createInfo: function(matchInfo) {
        $("#oneloftName").val(matchInfo.oneloftName); //公棚名称
        $("#raceTitile").val(matchInfo.raceTitile); //赛事标题
        $("#matchStartedTime").val(matchInfo.startedTime); //赛事开始时间
        $("#matchEndedTime").val(matchInfo.endedTime); //赛事结束时间
        $("#reward").val(matchInfo.reward); //奖金
        $("#race_item_tit").val(matchInfo.raceTitile); // 赛事标题
        $("#enrolledTime").val(matchInfo.enrolledTime); //报名截止日期
        matchEditoObj.createRaceitems(matchInfo.raceitems); //赛程
        matchEditoObj.createUpfile(matchInfo.raceShow); //橱窗
        var desc = matchInfo.raceDesc;
        setTimeout(function() {
            UE.getEditor('editor').execCommand('insertHtml', desc)
        }, 1000);
    },
    //赛程
    createRaceitems: function(raceitems) { //赛程
        var liStr = "";
        raceitems.forEach(function(val, index) {
            liStr += '<li class="schedule_time clearfix" raceitemId="' + val.raceitemId + '">' +
                '<span>赛程' + (index + 1) + '</span>' +
                '<input type="text" placeholder="赛程名称 " class="schedule_time_name raceitemTitile" value="' + val.raceitemTitile + '">' +
                '<div class="schedule_time_ff">' +
                '<span>放飞日期</span>' +
                '<div class="J-datepicker c-datepicker">' +
                '<i class=""></i>' +
                '<input type="text" autocomplete="off" name="" placeholder="选择日期" class="startedTime" value="' + val.startedTime + '">' +
                '</div>' +
                '</div>' +
                '<div class="schedule_time_ff schedule_time_ff2">' +
                '<span>放飞地点</span>' +
                '<i class="address"></i>' +
                '<input type="text" value="' + val.startedPlace + '" class="startedPlace">' +
                '</div>' +
                '<div class="schedule_time_ff schedule_time_ff2">' +
                '<span>空距</span>' +
                '<input type="text" placeholder="" value="' + val.distance + '" class="distance">' +
                '</div>'
            '</li>';
        });
        $("#race_item_box").html(liStr);
    },
    //橱窗图片
    createUpfile: function(raceShow) {
        $("#raceShow li").eq(0).find("img").attr("src", raceShow.videos[0].video); // 视频缩略图

        $("#raceShow li").eq(0).find("b").html("查看视频");
        raceShow.images.forEach(function(val, _index) {
            $("#raceShow li").eq(_index + 1).find("img").attr("src", val.img);
            $("#raceShow li").eq(_index + 1).find("i").html("设为封面");
        });

    },
    /**
     * 7、新增赛事接口
     * http://域名/oneloft/race/add
     */
    addMatch: function(saveData) {
        $.ajax({
            url: location.origin + "/oneloft/race/add",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    },
    /**
     * 8、编辑赛事接口
     * http://域名/oneloft/race/edit
     */
    saveMatch: function(saveData) {
        $.ajax({
            url: location.origin + "/oneloft/race/edit",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    }
}