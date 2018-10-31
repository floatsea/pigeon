var customerId = getParameter("customerId");
var openId = getParameter("openId");
$("#openId").html(openId);
var initObj = {
    initPage: function() {
        $.ajax({
            url: location.origin + "/operator/customer/find",
            type: "post",
            data: JSON.stringify({
                "customerId": customerId
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                var custumers = data.data;
                $("#headImg").attr("src", custumers.profilePhoto); //头像
                $("#nickName").html(custumers.nickName); //昵称
                $("#createdTime").html(custumers.createdTime); //注册日期
                $("#lastTime").html(custumers.loginTime); //最后登录日期  接口没有返回
                $("#realName").html(custumers.realName); //姓名
                $("#idCard").html(custumers.idCard); //证件号
                $("#birthday").html(getDateToAge(custumers.idCard)); //后台没有返回
                $("#address").html(custumers.address); //地址
                $("#mobile").html(custumers.mobile); //手机号
            },
            error: function() {
                alert("网络不给力")
            }
        })
    }
}