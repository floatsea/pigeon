var businessId = getParameter("businessId");
var businessInfoObj = {
    /**
     * 3、商家详情接口
     * http://域名/business/find
     */
    infoRequest: function() {
        $.ajax({
            url: location.origin + "/business/find",
            type: "post",
            data: JSON.stringify({
                "businessId": businessId
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                var businessObj = data.data;
                businessInfoObj.createInfo(businessObj);

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
        businessInfoObj.createImg(businessObj.shopShow); //图片展示
    },
    createImg: function(shopShow) {
        if (shopShow.videos) {
            var video = shopShow.videos[0];
            $("#shopShow li").eq(0).find("img").attr("src", video.video);
        }
        shopShow.images.forEach(function(val, index) {
            $("#shopShow li").eq(index + 1).find("img").attr("src", val.img);
            $("#shopShow li").eq(index + 1).find("i").html("设为封面");
            $("#shopShow li").eq(index + 1).find("em").show();
        })
    },
    /**
     * 4、商家修改接口
     * http://域名/business/edit
     */
    infoEditor: function(postData) {
        $.ajax({
            url: location.origin + "/business/edit",
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                myAlert.createBox(data.msg);
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}