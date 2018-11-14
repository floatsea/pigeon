var businessId = getParameter("businessId");
var businessInfoObj = {
    /**
     * 7、商家详情接口
     * http://域名/operator/business/find
     */
    infoRequest: function() {
        $.ajax({
            url: location.origin + "/operator/business/find",
            type: "post",
            data: JSON.stringify({
                "businessId": businessId
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    var businessObj = data.data;
                    businessInfoObj.createInfo(businessObj);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    createInfo: function(businessObj) {
        $("#creatTime").html(businessObj.createdTime); //创建时间
        $("#loginTime").html(businessObj.loginTime); //最后登录时间
        $("#shopName").val(businessObj.shopName || businessObj.shopNameEn); //店铺名称
        $("#shopDesc").val(businessObj.shopIntro || businessObj.shopIntroEn); //特色描述
        setTimeout(function() { //商家简介
            UE.getEditor('editor').execCommand('insertHtml', businessObj.shopDesc || "");
        }, 1000);
        businessInfoObj.createImg(businessObj.shopShow); //图片展示
    },
    createImg: function(shopShow) {
        if (shopShow.images.length > 0) {
            shopShow.images.forEach(function(val, index) {
                $("#shopShow li").eq(index + 1).find("img").attr("src", val.img);
                $("#shopShow li").eq(index + 1).find("input").hide();
                $("#shopShow li").eq(index + 1).find("em").show();
                if (val.isCover && val.isCover == "Y") {
                    $("#shopShow li").eq(index + 1).find("i").html("设为封面").addClass("active");
                } else {
                    $("#shopShow li").eq(index + 1).find("i").html("设为封面");
                }
            })
        }
        // video
        if (shopShow.videos && shopShow.videos.length > 0) {
            var videoURL = shopShow.videos[0].video;
            $("#small_video").attr("src", videoURL);
            $("#big_video").attr("src", videoURL)
            $("#shopShow li").eq(0).find("b").html("查看视频");
            $("#shopShow li").eq(0).find(".del_img").show();
            $("#shopShow li").eq(0).find("input").hide();
        }
    },
    /**
     * 8、商家修改接口
     * 点击保存时用到
     */
    infoEditor: function(postData, callback) {
        $.ajax({
            url: location.origin + "/operator/business/edit",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    myAlert.createBox("保存成功！");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}