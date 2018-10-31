//鼠标移入、移出功能

//默认状态， 左边移入事件
$(function() {
    $("body").on("mouseenter",function(){
        $("#phone_left").addClass("login_left3");
    });
    $("body").on("mouseleave",function(){
        $("#phone_left").removeClass("login_left3");
    });
    // 鼠标移入左侧
    $("#default_left").on("mouseenter", function() {
        $(this).hide();
        $("#phone_left").show();
    });
    $("#phone_left").on("mouseleave", function() {
        $(this).hide();
        $("#default_left").show();
    });
    //鼠标移入 右侧
    $("#login_right_box").on("mouseenter", function() {
        $("#phone_left").hide();
        $("#default_left").addClass("login_left3").show(); //左边显示默认
        $("#default_right").hide();
        $("#loging_main").show();
    });
    // 鼠标移出 右侧
    $("#login_right_box").on("mouseleave", function() {
        $("#phone_left").hide();
        $("#default_left").removeClass("login_left3").show(); //左边显示默认
        $("#default_right").show();
        $("#loging_main").hide();
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

    //点击获取验证码 (登录)
    $("#login_code_btn").on("click", function() {
        var telStr = $("#login_tel").val();
        if (!checkInputPhone(telStr)) {
            $("#login_tel").val("");
            $("#login_code").val("");
            return;
        } else {
            //倒计时
            var $this = $(this);
            if ($this.html() == "获取验证码") {
                getCode(getCodeData, function() {
                    tick($this);
                })
            } else {
                return;
            }
        }
    });

    //点击 “登录” 按钮
    $("#login_btn").on("click", function() {
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
                    "mobile":  $("#login_tel").val(),
                    "userPwd": $("#login_code").val()
                };
                loginRequest(loginData,function(){
                    location.href = location.origin + "/operate/home.html";
                });
            }
        }
    });

    //点击获取验证码 (注册)
    $("#regist_code_btn").on("click", function() {
        var telStr = $("#regist_tel").val();
        if (!checkInputPhone(telStr)) {
            $("#regist_tel").val("");
            $("#regist_code").val("");
            return;
        } else {
            //倒计时
            var $this = $(this);
            if ($this.html() == "获取验证码") {
                getCode(getCodeData, function() {
                    tick($this);
                })
            } else {
                return;
            }
        }
    });

    //倒计时
    function tick(dom) {
        var time = 10;
        timer = setInterval(function() {
            if (time > 0) {
                if (time < 10) {
                    time = "0" + time;
                }
                //loginCodeFlag = false;
                var str = time + 's 重新获取';
                dom.html(str);
                time--;
            } else {
                clearInterval(timer);
                dom.html("获取验证码");
                return true;
            }
        }, 1000);
    }
    //获取验证码接口
    function getCode(getCodeData, cb) {
        $.ajax({
            url: location.origin + "",
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
    //登录
    function loginRequest(loginData,cb) {
        console.log(loginData)
        console.log(location.origin + "/operator/login");
        $.ajax({
            url: location.origin + "/operator/login",
            type: "post",
            data: JSON.stringify(loginData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    cb && cb();
                }else{
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        })
    }
    //注册
    function registRequest(registData) {
        $.ajax({
            url: location.origin + "",
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
        })
    }
})