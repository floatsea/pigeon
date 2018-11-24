/*适配屏幕*/
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) {
                return
            }
            if (clientWidth < 320) {
                docEl.style.fontSize = "20px";
            } else {
                if (clientWidth >= 640) {
                    docEl.style.fontSize = "40px";
                } else {
                    docEl.style.fontSize = 20 * (clientWidth / 320) + "px";
                }
            }
        };
    if (!doc.addEventListener) {
        return
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false)
})(document, window);


var myLoad = {};
//黑色蒙层loading
myLoad.openLoading = function() {
        if ($(".myLoading").length == 0) {
            var loadingStr = "";
            loadingStr += '<div class="myLoading">';
            loadingStr += '<img src="../image/loading.gif" alt=""/>';
            loadingStr += '<span>加载中...</span>';
            $('body').append(loadingStr);
        }
    }
    /*删除loading*/
myLoad.closeLoading = function() {
    $(".myLoading").remove();
}

/*自定义弹窗*/
var myAlert = {};
myAlert.createBox = function(htmlStr) {
    if ($(".alert_box").length == 0) {
        var alert_box_str = '<div class="alert_mask"><div class="alert_box">' + htmlStr + '</div></div>';
        $('body').append(alert_box_str);
        setTimeout(function() {
            $(".alert_mask").remove();
        }, 2000);
    }
}

/*姓名校验*/
var checkFn = {};
checkFn.applicantName = function(val, el) {
        var value = removeSpace(val);
        var length = getLength(value);
        if (length > 20 || length < 1) {
            return false;
        }
        var filter1 = /^([\u4E00-\u9FA5]|[.|。|．|，|、|,|•|\-|_|\·|\s]){0,}[\u4E00-\u9FA5]+$/;
        var filter2 = /^[A-Za-z]+([A-Za-z]|[\-|.|。|．|，|、|,|•|\_|·|\s])+[A-Za-z]+$/;
        var filter3 = /([.。．，、,•])/g;
        if (filter1.test(value) || filter2.test(value)) {
            if (filter3.test(value)) {
                var flag = confirm("“您输入的姓名中含有非法字符，已将其转换为‘·’，请确认”");
                if (!flag) { return false; }
                value = value.replace(/([.。．，、,•])/g, "·");
                removeFuHao(value, el);
                //$(el).find(".error").hide();
                return true;
            } else {
                removeFuHao(value, el);
                return true;
            }
        } else {
            return false;
        }
    }
    //删除符号
function removeFuHao(val, el) {
    var arr = val.split("");
    var reg = /^.{0,}[-_·•]+.{0,}$/;
    var ind = "";
    for (var i = 0; i < arr.length; i++) {
        if (reg.test(arr[i]) && reg.test(arr[i + 1])) {
            arr.splice(i + 1, 1);
            i--;
        }
    }
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == " " && (reg.test(arr[j + 1]) || reg.test(arr[j - 1]))) {
            arr.splice(j, 1);
            i--;
        }
    }
    var new_str = arr.join("");
    $(el).val(new_str);
}
//删除空格
function removeSpace(val) {
    var filter_space1 = /([\u4E00-\u9FA5])/g;
    var value;
    value = val.replace(/\s+/g, "");
    return value;
}
//获取长度
function getLength(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var chanese = /^([\u4E00-\u9FA5])+$/;
        if (chanese.test(val.substr(i, 1))) {
            len = len + 2;
        } else {
            ++len;
        }
    }
    return len;
}

function setBirth(config) {
    var effect_date = new Date(config.date);
    var max = parseInt(config.max);
    var min = parseInt(config.min);
    var minBirth = null;
    var maxBirth = null;
    if (min == 0) {
        var min_date = new Date(config.date);
        min_date.setDate(min_date.getDate() - 30); // - 30
        minBirth = min_date.getFullYear() - min + "-" + (min_date.getMonth() + 1) + "-" + min_date.getDate();
    } else {
        minBirth = effect_date.getFullYear() - min + "-" + (effect_date.getMonth() + 1) + "-" + effect_date.getDate();
    }
    effect_date.setDate(effect_date.getDate() + 1); //必须放在最小值之后
    if (max == 17) {
        effect_date.setDate(effect_date.getDate() + 1); //保单生效时必须未满18岁
    }
    // maxBirth = effect_date.getFullYear() - (max + 1) + "-" + (effect_date.getMonth() + 1) + "-" + effect_date.getDate();
    maxBirth = (effect_date.getFullYear() - max) + "-" + (effect_date.getMonth() + 1) + "-" + (effect_date.getDate());
    return {
        min: minBirth,
        max: maxBirth
    };
}
//根据出生日期获取年龄
function getAge(birthday) {
    var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) {
        return false
    } else {
        if (r[3] > 12 || r[4] > 31) {
            myAlert.createBox("证件号格式有误，请重新输入");
            return false
        }
    }
    var birth = new Date(r[1], r[3] - 1, r[4]);
    if (birth.getFullYear() == r[1] && (birth.getMonth() + 1) == r[3] && birth.getDate() == r[4]) {
        var today = new Date();
        var age = today.getFullYear() - r[1];

        if (today.getMonth() > birth.getMonth()) {
            return age;
        }
        if (today.getMonth() == birth.getMonth()) {
            if ((today.getDate() + 1) > birth.getDate()) {
                return age;
            } else {
                return age - 1;
            }
        }
        if (today.getMonth() < birth.getMonth()) {
            return age - 1;
        }
    }
    return age;
}

/*校验手机号码*/
// 非1开头的号码；
// =   重复数字超过7位（含7位）；
// ?   数字递增或递减超过7位（含7位）；
// ?   两位数字组成的组合重复出现超4次（如13838383838）；
// ?   13800138000
// ?   含有非数字字符（如*#￥）；
//手机号码校验
function checkInputPhone(phone) {
    if (phone == "") {
        return false;
    }

    var reg = /^1[3,4,5,6,7,8,9]\d{9}$/; //手机号正则
    if (!reg.test(phone)) {
        return false;
    }
    var sub = phone.substr(2);
    var sub2 = phone.substr(3);
    var isCon = true;
    var len = sub.length;
    var offset = 0;
    var num = 0;
    for (var i = len - 1; i > 0; i--) {
        var a = parseInt(sub[i]);
        var b = parseInt(sub[i - 1]);
        if (a - b == 1 || b - a == 1) {
            num++;
            if (num >= 6) {
                return false;
            }
        } else {
            num = 0;
        }
        if (a - b == 0) {
            offset++;
            if (offset >= 6) {
                return false;
            }
        } else {
            offset = 0;
        }
    }
    if (phone == "13800138000") {
        return false;
    }
    if (sub2[0] + sub2[1] == sub2[2] + sub2[3] && sub2[4] + sub2[5] == sub2[6] + sub2[7] && sub2[4] + sub2[5] == sub2[0] + sub2[1]) {
        return false;
    }
    return true;
}

/*身份证号校验*/
function validateUser(userCardValue) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!(reg.test(userCardValue))) {
        return false;
    }
    return true;
}
//取身份证日期，并显示年龄
function getDateToAge(idCard) {
    var birthday = "";
    if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
        }

        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
}

//通过证件号判断性别
function getSex(cardid) {
    var num = cardid.charAt(cardid.length - 2);
    var sexName = (num % 2 == 0) ? "女" : "男";
    return sexName;
}

//设置年龄范围
function setAgeScope(minAge, maxAge) {
    var arr = [];
    for (var i = minAge; i < maxAge + 1; i++) {
        arr.push(i + "周岁")
    }
    return arr;
}

//通过年龄设置出生日期
function ageToBirth(age) {
    var oDateNew = new Date();
    if (age == 0) {
        oDateNew.setDate(oDateNew.getDate() - 30);
        var nowY = oDateNew.getFullYear();
        var nowM = oDateNew.getMonth() + 1;
        var nowD = oDateNew.getDate();
    } else {
        var nowY = oDateNew.getFullYear();
        var nowM = oDateNew.getMonth() + 1;
        var nowD = oDateNew.getDate();
    }
    return ((nowY - age) + "-" + toDou(nowM) + "-" + toDou(nowD));
}

//补0
function toDou(num) {
    return num < 10 ? "0" + num : "" + num;
}

function valedateXiaoshu(val, count) {
    var flag = false;
    if (count == 1) {
        flag = isPirce(val);
    } else if (count == 0) {
        var p = /^[1-9]\d*$/;
        flag = p.test(val);
    }
    return flag;
}

function isNum(n) {
    var num = /^[1-9]\d*$/;
    return num.test(n);
}

function isPirce(s) { //一位小数点的数字
    //s = trim(s);
    var p = /^[0-9]+([.][0-9]{1}){0,1}$/;
    return p.test(s);
}

function valedateXiaoshu(val, count) {
    var flag = false;
    if (count == 1) {
        flag = isPirce(val);
    } else if (count == 0) {
        var p = /^[1-9]\d*$/;
        flag = p.test(val);
    }
    return flag;
}

function getNum(arr) {
    for (var j = 0; j < arr.length; j++) {
        if (arr[j].age >= 18) {
            return j;
        }
    }
    return false
}

//------------新增--------------
// 判断是否为空
function isDefine(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
        return false;
    } else {
        value = value + "";
        value = value.replace(/\s/g, "");
        if (value == "") {
            return false;
        }
        return true;
    }
}
/* 截取地址栏的参数 */
function getParameter(param) {
    var query = window.location.search; //获取URL地址中？后的所有字符
    var iLen = param.length; //获取你的参数名称长度
    var iStart = query.indexOf(param); //获取你该参数名称的其实索引
    if (iStart == -1) { //-1为没有该参数
        return "";
    }
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart); //获取第二个参数的其实索引
    if (iEnd == -1) { //只有一个参数
        return query.substring(iStart); //获取单个参数的参数值
    }
    return query.substring(iStart, iEnd); //获取第二个参数的值
}
//姓名校验
function isCheckName(controlObj, el) {
    controlObj = removeSpace(controlObj);
    //判断是否为空
    if (controlObj.length == 0 || controlObj == null || controlObj == undefined) {
        myAlert.createBox("姓名不能为空");
        return false;
    }
    //匹配全部是空格
    var t = /^\s+$/;
    if (t.test(controlObj)) {
        myAlert.createBox("姓名不能为空");
        return false;
    };
    //匹配输入特殊字符
    var pattern = new RegExp("[`+~!@#$^&*()=|{}':;\\['\\]<>/?~！@#￥……&*（）;—|\\\{}【】‘；：”“'？]");
    if (controlObj.match(pattern) !== null) {
        myAlert.createBox("姓名格式不正确,且不得出现数字或特殊符号");
        return false;
    }
    //匹配输入的都是允许输入标点符号
    var dianstr1 = /^(·+)$/;
    var dianstr2 = /^(。+)$/;
    var dianstr3 = /^(\.+)$/;
    var dianstr4 = /^(,+)$/;
    var dianstr5 = /^(，+)$/;
    var dianstr6 = /^(、+)$/;
    var dianstr7 = /^(-+)$/;
    var dianstr8 = /^(_+)$/;
    var dianstr9 = /^(●+)$/;
    var dianstr10 = /^(\．+)$/;
    if (dianstr1.test(controlObj) || dianstr2.test(controlObj) || dianstr3.test(controlObj) || dianstr4.test(controlObj) || dianstr5.test(controlObj) || dianstr6.test(controlObj) || dianstr7.test(controlObj) || dianstr8.test(controlObj) || dianstr9.test(controlObj) || dianstr10.test(controlObj)) {
        myAlert.createBox("姓名格式不正确,不得出现连续特殊符号");
        return false;
    }
    //匹配数字
    var number = /^.*[0-9].*$/;
    if (number.test(controlObj)) {
        myAlert.createBox("姓名格式不正确,且不得出现数字或特殊符号");
        return false;
    }
    //匹配包含中文的
    var chinese = /^.*[\u4e00-\u9fa5].*$/;
    //匹配包含英文的
    var english = /^.*[a-zA-Z].*$/;
    if (chinese.test(controlObj) && english.test(controlObj)) {
        myAlert.createBox("姓名格式不正确,且不得出现数字或特殊符号");
        return false;
    }
    //中文去除空格并替换为点
    if (chinese.test(controlObj)) {
        //去除中文空格
        var controlObj = controlObj.replace(/\s/g, '');
        //匹配中文长度
        if (controlObj.length > 10 || controlObj.length < 1) {
            myAlert.createBox("姓名长度不匹配");
            return false;
        }
        //匹配特殊字符开头结尾
        var reg = /^(_|-|●|·|。|\.|,|，|、|．).*|.*(_|-|●|·|。|\.|,|，|、|．)$/;
        if (reg.test(controlObj)) {
            myAlert.createBox("姓名格式不正确,首尾不得出现特殊符号");
            return false;
        }
        //特殊字符进行转换
        var pattern = new RegExp("[。.,，、．]");
        if (controlObj.match(pattern) !== null) {
            $('#confirm').attr('confirm', controlObj);
            if (window.confirm("您输入的姓名中含有非法字符,已将其转换为'·',请确定")) {
                var controlObj = $('#confirm').attr('confirm');
                var a1 = new Array("·", "。", ".", "．", ",", "，", "、");
                if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0") {
                    for (var i = 0; i < a1.length; i++) {
                        for (var j = 0; j < controlObj.length; j++) {
                            if (controlObj.charAt(j) == a1[i]) {
                                controlObj = controlObj.replace(controlObj.charAt(j), '·');
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < a1.length; i++) {
                        for (var j = 0; j < controlObj.length; j++) {
                            if (controlObj[j] == a1[i]) {
                                controlObj = controlObj.replace(controlObj[j], '·');
                            }
                        }
                    }
                }
                //去掉多余的连续的·
                var controlObj = controlObj.replace(/(·)\1+/g, '$1');
                $(el).val(controlObj);
                return true;
            } else {
                myAlert.createBox("姓名格式不正确,且不得出现数字或特殊符号");
                return false;
            }
        } else {
            var controlObj = controlObj.replace(/(·)\1+/g, '$1');
            $(el).val(controlObj);
            return true;

        }
    }

    //英文去除空格并替换为点
    if (english.test(controlObj)) {
        // 去除首尾空格
        var controlObj = controlObj.replace(/^\s+|\s+$/g, '');
        //英文空格仅保留一个
        var controlObj = controlObj.replace(/   */g, ' ');
        //匹配英文长度
        if (controlObj.length > 10 || controlObj.length < 1) {
            myAlert.createBox("姓名长度不匹配");
            return false;
        }
        //匹配特殊字符开头结尾
        var reg = /^(_|-|●|·|。|\.|,|，|、).*|.*(_|-|●|·|。|\.|,|，|、)$/;
        if (reg.test(controlObj)) {
            myAlert.createBox("姓名格式不正确,首尾不得出现特殊符号");
            return false;
        }
        //特殊字符进行转换
        var pattern = new RegExp("[。.,，、．]");
        if (controlObj.match(pattern) !== null) {
            $('#confirm').attr('confirm', controlObj);
            if (window.confirm("您输入的姓名中含有非法字符,已将其转换为'·',请确定")) {
                var controlObj = $('#confirm').attr('confirm');
                var a1 = new Array("·", "。", ".", "．", ",", "，", "、");
                if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0") {
                    for (var i = 0; i < a1.length; i++) {
                        for (var j = 0; j < controlObj.length; j++) {
                            if (controlObj.charAt(j) == a1[i]) {
                                controlObj = controlObj.replace(controlObj.charAt(j), '·');
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < a1.length; i++) {
                        for (var j = 0; j < controlObj.length; j++) {
                            if (controlObj[j] == a1[i]) {
                                controlObj = controlObj.replace(controlObj[j], '·');
                            }
                        }
                    }
                }
                //去掉多余的连续的·
                var controlObj = controlObj.replace(/(·)\1+/g, '$1');
                $(el).val(controlObj);
                return true;
            } else {
                myAlert.createBox("姓名格式不正确,且不得出现数字或特殊符号");
                return false;
            }
        } else {
            var controlObj = controlObj.replace(/(·)\1+/g, '$1');
            $(el).val(controlObj);
            return true;
        }
    }
}

/*校验地区*/
function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        if (pattern.test(s[i])) {
            return false;
        }
    }
    return true;
}

/* 大数据插码*/
function _tkTrack(opt) {
    TKTrack({
        "subType": opt.subType || "",
        "event": opt.event,
        "userId": opt.userId,
        "label": {
            lrt_id: opt.lrt_id || "",
            lrtName: opt.lrtName || "",
            classifyName: opt.classifyName || "",
            cName: opt.cName || "",
            insureKind: opt.insureKind || "",
            productId: opt.productId || "",
            productName: opt.productName || "",
            fromId: opt.fromId || "",
            userType: opt.userType || ""
        }
    });
}
//刷新token
function reloadToken(postReloadToken, postLoginData, callback) {
    $.ajax({
        url: location.origin + "/customer/refresh",
        type: "post",
        data: JSON.stringify(postReloadToken),
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, request) {
            if (data.code == 0) {
                var Authorization = request.getResponseHeader("Authorization");
                localStorage.setItem("Authorization", Authorization);
                callback && callback();
            } else {
                getLogin(postLoginData, callback);
            }
        },
        error: function() {
            getLogin(postLoginData, callback);
        }
    })
}
//登录接口
function getLogin(postLoginData, callback) {
    $.ajax({
        url: location.origin + "/customer/login",
        type: "post",
        data: JSON.stringify(postLoginData),
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, request) {
            if (data.code == 0) {
                var Authorization = request.getResponseHeader("Authorization");
                localStorage.setItem("Authorization", Authorization);
                callback && callback();
            } else {
                return false;
            }
        },
        error: function() {
            myAlert.createBox("网络不给力")
        }
    })
}

// 上传文件 返回路径
function uploadRequest(postUrl,id,callback) {
    var file = $("#"+id).get(0).files[0];
    var fileSize = (file.size/1024)/1024;
    var fileType = file.type;
    //图片
    if(postUrl.indexOf("uploadimage")>-1){
        if (!/image\/\w+/.test(file.type)) {
            myAlert.createBox("文件必须为图片！");
            return false;
        }
    }
    $.ajaxFileUpload({
        url: postUrl, //用于文件上传的服务器端请求地址
        //url: '/ueditor?action=uploadvideo', //视频上传
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: id, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        success: function (data, status){ //服务器成功响应处理函数
            //alert(JSON.stringify(data));
            callback && callback(data.url);
        },
        error: function (data, status, e){ //服务器响应失败处理函数
            alert(e);
        }
    });
}
function setLocVal(name, val){
    localStorage.setItem(name, val);
}

function getLocVal(name) {
    localStorage.getItem(name);
}
if (isIphoneX()){
    $(document.body).append("<div style='height:68px;'></div>");
    $("footer").height($("footer").height()+68);
}
function isIphoneX() {
    return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
}

