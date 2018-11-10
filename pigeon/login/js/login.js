//鼠标移入、移出功能

//默认状态， 左边移入事件
$(function() {
    $("body").on("mouseenter", function() {
        $("#default_left").addClass("login_left3");
    });
    $("body").on("mouseleave", function() {
        $("#default_left").removeClass("login_left3");
        $("#login_right_box").css("width", "100%");
    });
    // 鼠标移入左侧
    $("#default_left").on("mouseenter", function() {
        $(".defaultLeft").hide();
        $(".phoneLeft").show();
        $(this).addClass("login_left2");
    });
    $("#default_left").on("mouseleave", function() {
        $(this).removeClass("login_left2");
        $(".defaultLeft").show();
        $(".phoneLeft").hide();
    });
    //鼠标移入 右侧
    $("#login_right_box").on("mouseenter", function() {
        $("#phone_left").hide();
        $("#default_left").addClass("login_left3").show(); //左边显示默认
        $("#default_right").hide();
        $("#loging_main").show();
        $(this).css("width", "100%");
    });
    // 鼠标移出 右侧
    $("#login_right_box").on("mouseleave", function() {
        $("#phone_left").hide();
        $("#default_left").removeClass("login_left3").show(); //左边显示默认
        $("#default_right").show();
        $("#loging_main").hide();
        $(this).css("width", "80%");
    });

    // 点击 "还没有账号，免费注册"
    $("#regist_text").on("click", function() {
        $("#login_dom").hide();
        $("#regist_dom").show();
    });

    //点击 “已有账号，立即登录”
    $("#login_text").on("click", function() {
        $("#regist_dom").hide();
        $("#login_dom").show();
    });
    /*-------------------------------------------------------------------------- */
    //切换 “商家” “公棚” 登录
    $("#switch_login li").on("click", function() {
        $("#login_code").val("");
        $("#switch_login li").removeClass("active");
        var _index = $(this).index();
        $(this).addClass("active");
        switch (_index) {
            case 0:
                $("#iphone_box").hide();
                $("#email_box").show();
                break;
            case 1:
                $("#iphone_box").show();
                $("#email_box").hide();
                break;
        }
    });

    //切换 "商家" “公棚” 注册
    $("#switch_regist li").on("click", function() {
        $("#switch_regist li").removeClass("active");
        var _index = $(this).index();
        $(this).addClass("active");
        switch (_index) {
            case 0:
                $("#regist_tel").hide();
                $("#regist_email_box").show();
                break;
            case 1:
                $("#regist_tel").show();
                $("#regist_email_box").hide();
                break;
        }
    });
    /*================================登录=================================== */
    /* 登录接口
     * 商家 /business/login
     * 公棚 /oneloft/login
     */
    function loginRequest(postData, postUrl, cb) {
        $.ajax({
            url: postUrl,
            type: "post",
            data: JSON.stringify(postData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    cb && cb();
                    //myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
    //公棚登录
    function oneloftLogin() {
        var telStr = $("#login_tel").val();
        var codeStr = $("#login_code").val();
        if (!checkInputPhone(telStr)) {
            $("#login_tel").val("");
            $("#login_code").val("");
            return;
        } else {
            if (isNaN(codeStr) || !codeStr) {
                $("#login_code").val("");
                myAlert.createBox("验证码有误");
                return;
            } else {
                // 调登录接口
                var loginData = {
                    "mobile": telStr,
                    "userPwd": "",
                    "code": codeStr
                };
                var postUrl = location.origin + "/oneloft/login";
                loginRequest(loginData, postUrl, function() {
                    telStr = telStr.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                    location.href = location.origin + "/oneloft/home.html?mobile=" + telStr;
                });
            }
        }
    }
    //商家登录
    function businessLogin() {
        var emailStr = $("#login_email").val();
        var emailCodeStr = $("#login_code").val();
        if (checkEmail(emailStr)) {
            if (isNaN(emailCodeStr) || !emailCodeStr) {
                $("#login_code").val("");
                myAlert.createBox("验证码有误");
                return;
            } else {
                // 调登录接口
                var loginData = {
                    "email": emailStr,
                    "userPwd": "",
                    "code": emailCodeStr
                };
                var postUrl = location.origin + "/business/login";
                loginRequest(loginData, postUrl, function() {
                    location.href = location.origin + "/merchant/home.html?email=" + emailStr;
                });
            }
        }
    }

    /*获取验证码接口
     *商家 /business/message/code
     *公棚 /oneloft/message/code
     */
    function getRequestCode(getCodeData, postUrl, cb) {
        $.ajax({
            url: postUrl,
            type: "post",
            data: JSON.stringify(getCodeData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    cb && cb();
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
    //获取商家验证码
    function getBusinessCode($this, emailStr) {
        if (checkEmail(emailStr)) {
            if ($this.html() == "获取验证码") {
                var postUrl = location.origin + "/business/message/code";
                getRequestCode({ "email": emailStr }, postUrl, function() {
                    tick($this);
                })
            } else {
                return;
            }
        }
    }
    // 公棚获取验证码
    function getOneloftCode($this, telStr) {
        if (!checkInputPhone(telStr)) {
            return;
        } else {
            //倒计时
            if ($this.html() == "获取验证码") {
                var postUrl = location.origin + "/oneloft/message/code";
                getOneloftRequestCode({ "mobile": telStr }, postUrl, function() {
                    tick($this);
                })
            } else {
                return;
            }
        }
    }
    //点击获取验证码 (登录)
    $("#login_code_btn").on("click", function() {
        var switchIndex = $("#switch_login .active").index();
        var $this = $(this);
        if (switchIndex == 0) { //商家
            var emailStr = $("#login_email").val();
            getBusinessCode($this, emailStr);
        } else { //公棚
            var telStr = $("#login_tel").val();
            getOneloftCode($this, telStr);
        }
    });

    /**
     * 点击 “登录” 按钮 
     * 判断是商家 还是 公棚
     */
    $("#login_btn").on("click", function() {
        var switchIndex = $("#switch_login .active").index();
        if (switchIndex == 0) {
            businessLogin();
        } else {
            oneloftLogin();
        }
    });

    /*============================注册================================ */
    /*注册接口
     * 商家 /business/add
     * 公棚 /oneloft/add
     */
    function registRequest(registData, postUrl) {
        $.ajax({
            url: postUrl,
            type: "post",
            data: JSON.stringify(registData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    cb && cb();
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    }
    //商家注册
    function busRegist() {
        var registEmail = $("#regist_email").val();
        var codeStr = $("#regist_code").val();
        if (checkEmail(registEmail)) {
            if (isNaN(codeStr) || !codeStr) {
                $("#login_code").val("");
                myAlert.createBox("验证码有误");
                return;
            } else {
                // 调登录接口
                var registData = {
                    "email": registEmail,
                    "userPwd": "",
                    "code": codeStr
                };
                var postUrl = location.origin + "/business/add";
                registRequest(registData, postUrl);
            }
        }
    }
    //公棚注册
    function oneloftRegist() {
        var telStr = $("#regist_tel").val();
        var codeStr = $("#regist_code").val();
        if (!checkInputPhone(telStr)) {
            $("#regist_tel").val("");
            $("#regist_code").val("");
            return;
        } else {
            if (isNaN(codeStr) || !codeStr) {
                $("#regist_code").val("");
                myAlert.createBox("验证码有误");
                return;
            } else {
                var registData = {
                    "mobile": telStr,
                    "userPwd": $("#password").val(),
                    "code": codeStr
                };
                var postUrl = location.origin + "/oneloft/add";
                registRequest(registData, postUrl);
            }
        }
    }
    //点击获取验证码 (注册)
    $("#regist_code_btn").on("click", function() {
        var registIndex = $("#switch_regist .active").index();
        var $this = $(this);
        if (registIndex == 0) { //商家
            var emailStr = $("#regist_email").val();
            getBusinessCode($this, emailStr);
        } else { //公棚
            var telStr = $("#regist_tel").val();
            getOneloftCode($this, telStr);
        }
    });

    //点击 “注册” 按钮
    $("#regist_btn").on("click", function() {
        var registIndex = $("#switch_regist .active").index();
        if (registIndex == 0) { //商家
            busRegist();
        } else { //公棚
            oneloftRegist();
        }
    });

    //倒计时
    function tick(dom) {
        var time = 59;
        var str = '60s 重新获取'
        timer = setInterval(function() {
            if (time > 0) {
                if (time < 10) {
                    time = "0" + time;
                }
                str = time + 's 重新获取';
                dom.html(str);
                time--;
            } else {
                clearInterval(timer);
                dom.html("获取验证码");
                return true;
            }
        }, 1000);
    }
})