var contentObj = {
    /**
     * 页面初始化 调 客户端 首页展示 接口， 把之前配置的信息 带出来
     * 1、首页页面渲染接口
     * http://域名/customer/configSystem/findHomeConfig
     */
    innitRequest: function(initData) {
        $.ajax({
            url: location.origin + "/customer/configSystem/findHomeConfig",
            type: "post",
            data: JSON.stringify(initData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var list = data.data.list;
                    contentObj.createInitInfo(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 初始化 渲染页面
     */
    createInitInfo: function(list) {
        list.forEach(function(val) {
            switch (val.configCategory) {
                case "slideshow": //轮播
                    $("#swiper_box").attr("configId", val.configId);
                    contentObj.initCreateImg(val.configValue.images, "swiper_box");
                    break;
                case "pigeon": //商家及鸽子
                    $("#business_list").attr("configId", val.configId);
                    contentObj.createBusiness(val.configValue.businesses);
                    $("#business_list li").eq(0).trigger("click");
                    break;
                case "advertisment": //banner
                    $("#banner_box").attr("configId", val.configId);
                    contentObj.initCreateImg(val.configValue.images, "banner_box");
                    break;
                case "race": //赛事
                    $("#race_box").attr("configId", val.configId);
                    $("#race_box").html(contentObj.createRace(val.configValue.races));
                    break;
                case "oneloft": //公棚
                    $("#oneloft_box").attr("configId", val.configId);
                    $("#oneloft_box").html(contentObj.createOneloft(val.configValue.onelofts));
                    break;
            }
        });
    },
    /**
     *6、商家列表接口
     *http://域名/operator/business/findList
     *希望提供个新接口，把该商家名下对应的所有鸽子都查询出来
     */
    businessRequest: function(businessData, callback) {
        $.ajax({
            url: location.origin + "/operator/business/findList",
            type: "post",
            data: JSON.stringify(businessData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var list = data.data.list;
                    var totalNum = data.data.total; //商家总数
                    contentObj.createBusinessMark(list);
                    $("#business_sum_num").html(totalNum);
                    contentObj.getPageNumer(totalNum, "business_page_btn");
                    callback && callback();
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    /**
     * 创建商家列表
     */
    createBusiness: function(list) {
        var liStr = "";
        var pigeonTab = "";
        var tbodyStr = "";
        list.forEach(function(val, i) {
            liStr += '<li pigeonCount="' + val.pigeonCount + '" businessId="' + val.businessId + '">' +
                '<span>' + val.shopName + '</span>' +
                '<img src="../image/g1.png" class="set_bus" />' +
                '<img src="../image/close.png" class="del_bus" />' +
                '</li>';
            if (val.pigeons) {
                tbodyStr = contentObj.createPigeonList(val.pigeons);
            } else {
                tabClass = "hide";
            }
            pigeonTab += '<table class="hide" businessId="' + val.businessId + '">' +
                '<thead>' +
                '<tr>' +
                '<td style="width:30%">产品名称</td>' +
                '<td style="width:30%">卖点</td>' +
                '<td>价格</td>' +
                '<td style="width:15%">操作</td>' +
                '</tr>' +
                '</thead>' +
                '<tbody class="pigeonbody">' + tbodyStr + '</tbody>' +
                '</table>';
        });
        $("#business_list").append(liStr); // 商家列表
        $("#business_pigeon_list").append(pigeonTab); //鸽子列表
    },
    /**
     * 创建蒙层商家列表
     */
    createBusinessMark: function(list) {
        var str = '<dt>商家列表</dt>';
        list.forEach(function(val) {
            str += '<dd businessId="' + val.businessId + '" pigeonCount="' + val.pigeonCount + '">' +
                '<label for="">' +
                '<input type="checkbox">' +
                '<i></i>' +
                '<span class="shopName">' + val.shopName + '</span>' +
                '</label>' +
                '</dd>';
        });
        $("#business_list_box_dl").html(str);
    },
    /**
     * 创建展示鸽子列表
     */
    createPigeonList: function(list) {
        var trStr = "";
        list.forEach(function(val, k) {
            trStr += '<tr pigeonId="' + val.pigeonId + '">' +
                '<td>' +
                '<div class="clearfix">' +
                '<div>' +
                '<img class="pigeonImg" src="' + val.pigeonImg + '" alt="">' +
                '</div>' +
                '<input class="pigeonName" type="text" placeholder="" pigeonNo="' + val.pigeonNo + '" value="' + val.pigeonName + ' ' + val.pigeonNo + '"/>' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<input class="pigeonDesc" type="text" placeholder="" value="' + val.pigeonDesc + '" />' +
                '</td>' +
                '<td>¥<i class="pigeonPrice">' + parseInt(val.pigeonPrice) + '</i></td>' +
                '<td class="operation">' +
                '<span><img class="up" src="../image/up.png"></span>' +
                '<span><img class="down" src="../image/down.png"></span>' +
                '<span><img class="del" src="../image/close.png"></span>' +
                '</td>' +
                '</tr>';
        });
        return trStr;
    },
    /**
     * 44、信鸽列表接口
     * http://域名/operator/pigeon/findList
     * 点击 "商家" 按钮时，查询对应商家的鸽子列表
     * busIndex有值的情况，说明是通过搜索出来的，默认展示5个鸽子
     */
    pigeonRequest: function(proListData, callback) {
        $.ajax({
            url: location.origin + "/operator/pigeon/findList",
            type: "post",
            data: JSON.stringify(proListData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == "0") {
                    if (callback) {
                        var list = data.data.list.splice(0, 5);
                        callback(list);
                    } else {
                        var infoList = data.data.list;
                        var totalNum = data.data.total; //商品总数
                        $("#pigeon_sum_num").html(totalNum);
                        contentObj.getPageNumer(totalNum, "pigeon_page_btn"); //分页
                        contentObj.createPigeonMark(infoList);
                    }
                }
            },
            error: function() {
                myAlert.createBox("网络不给力！");
            }
        });
    },
    // 蒙层 筛选鸽子列表
    createPigeonMark: function(list) {
        var str = "";
        list.forEach(function(val) {
            var imgSrc = "";
            val.pigeonShow.images.forEach(function(imginfoVal) {
                if (imginfoVal.isCover == "Y") {
                    imgSrc = imginfoVal.img;
                }
            });
            imgSrc = !imgSrc ? val.pigeonShow.images[0].img : imgSrc;
            str += '<tr pigeonId="' + val.pigeonId + '">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div class="clearfix">' +
                '<div>' +
                '<img class="pigeon_img" src="' + imgSrc + '" alt="">' +
                '</div>' +
                '<span class="pigeon_name">' + val.pigeonName + ' ' + val.pigeonNo + '</span>' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<span class="pigeon_point">' + val.pigeonPoint + '</span>' +
                '</td>' +
                '<td>¥<i class="pigeon_price">' + parseInt(val.pigeonPrice) + '<i></td>' +
                '</tr>';
        });
        $("#pigeon_mark_list").html(str);
    },
    //获取分页的页码
    getPageNumer: function(totalNum, pageId) {
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
        $("#" + pageId).html(liStr);
    },
    /**
     * 轮播图
     * 广告位
     */
    //初始化展示
    initCreateImg: function(list, box) {
        var str = "";
        list.forEach(function(val, index) {
            str += '<li>' +
                '<div class="input_info_tit clearfix">' +
                '<span>图片' + (index + 1) + '</span>' +
                '<div class="content_file_box">' +
                '<div class="content_file">' +
                '<img src="' + val.img + '" alt="" class="loadImg">' +
                '<input type="file" accept="image/*" class="upImg" name="upfile" id="upImg' + box + '' + index + '">' +
                '</div>' +
                '<i class="j_del_img"></i>' +
                '</div>' +
                '</div>' +
                '<div class="input_info_tit clearfix">' +
                '<span>链接地址</span>' +
                '<input type="text" value="' + val.url + '" class="swiper_url">' +
                '</div>' +
                '</li>';
        });
        $("#" + box).html(str);
    },
    //点击 “添加下一张”
    createImg: function(box) {
        var num = box.find("li").length + 1;
        var liStr = '<li>' +
            '<div class="input_info_tit clearfix">' +
            '<span>图片' + num + '</span>' +
            '<div class="content_file_box">' +
            '<div class="content_file">' +
            '<img src="" alt="" class="loadImg">' +
            '<input type="file" class="upImg" name="upfile" id="' + box.attr("id") + '' + Date.now() + '">' +
            '</div>' +
            '<i class="j_del_img"></i>' +
            '</div>' +
            '</div>' +
            '<div class="input_info_tit clearfix">' +
            '<span>链接地址</span>' +
            '<input type="text" class="swiper_url">' +
            '</div>' +
            '</li>';
        box.append(liStr);
        if (num > 1) {
            box.find(".j_del_img").show();
        }
    },
    delImg: function(box, $this) {
        if (box.find("li").length > 1) {
            $this.closest("li").remove();
        }
        if (box.find("li").length == 1) {
            box.find(".j_del_img").hide();
        }
    },
    //初始化创建赛事
    createRace: function(list) {
        var str = "";
        list.forEach(function(val) {
            str += '<tr raceId="' + val.raceId + '">' +
                '<td>' +
                '<div class="race_tit" class="clearfix">' + val.raceName +
                '</div>' +
                '</td>' +
                '<td>' +
                '<p><i class="started_time">' + val.startedTime + '</i>起</p>' +
                '<p><i class="ended_time" enrolledTime="' + val.enrolledTime + '">' + val.endedTime + '</i>止</p>' +
                '</td>' +
                '<td class="oneloft_name">' + val.oneloftName + '</td>' +
                '<td>¥<i class="reward">' + val.reward + '</i></td>' +
                '<td class="operation">' +
                '<span><img class="up" src="../image/up.png"></span>' +
                '<span><img class="down" src="../image/down.png"></span>' +
                '<span><img class="del" src="../image/close.png"></span>' +
                '</td>' +
                '</tr>';
        });
        // $("#race_box").attr("list", list);
        //$("#race_box").html(str);
        return str;
    },
    /**
     * 46、赛事列表接口
     * http://域名/operator/race/findList
     */
    raceListRequest: function(raceData) {
        $.ajax({
            url: location.origin + "/operator/race/findList",
            type: "post",
            data: JSON.stringify(raceData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var list = data.data.list;
                    var total = data.data.total;
                    $("#race_sum_num").html(total); // 数据总数
                    contentObj.getPageNumer(total, "race_page_btn"); //分页
                    contentObj.createMarkRace(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        });
    },
    //创建蒙层赛事列表
    createMarkRace: function(list) {
        var str = "";
        list.forEach(function(val) {
            str += '<tr raceId="' + val.raceId + '">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div class="race_tit" class="clearfix">' + val.raceTitile +
                '</div>' +
                '</td>' +
                '<td>' +
                '<p><i class="started_time">' + val.startedTime + '</i>起</p>' +
                '<p><i class="ended_time" enrolledTime="' + val.enrolledTime + '">' + val.endedTime + '</i>止</p>' +
                '</td>' +
                '<td class="oneloft_name">' + val.oneloftName + '</td>' +
                '<td>¥<i class="reward">' + val.reward + '</i></td>' +
                '</tr>';
        });
        $("#race_mark_list").html(str);
    },


    //创建公棚
    createOneloft: function(list) {
        var str = "";
        list.forEach(function(val) {
            var oneloftShow = JSON.stringify(val.oneloftShow);
            oneloftShow = encodeURI(oneloftShow);
            var oneloftType = val.oneloftType == 0 ? "春棚" : "秋棚";
            str += '<tr oneloftId="' + val.oneloftId + '" location="' + val.location + '" distance="' + val.distance + '" oneloftShow="' + oneloftShow + '" logo="' + val.logo + '">' +
                '<td>' +
                '<div class="oneloft_name" class="clearfix">' + val.oneloftName +
                '</div>' +
                '</td>' +
                '<td>' +
                '<p class="establishTime">' + val.establishTime + '</p>' +
                '</td>' +
                // '<td class="cityCode" provinceCode="'+val.provinceCode+'">' + val.cityCode + '</td>' +
                '<td class="oneloftType" oneloftType="' + val.oneloftType + '">' + oneloftType + '</td>' +
                '<td class="operation">' +
                '<span><img class="up" src="../image/up.png" ></span>' +
                '<span><img class="down" src="../image/down.png"></span>' +
                '<span><img class="del" src="../image/close.png"></span>' +
                '</td>' +
                '</tr>';
        });
        return str;
        //$("#oneloft_box").attr("list", list);
        //$("#oneloft_box").html(str);
    },
    /**
     * 12、公棚列表接口
     * http://域名/operator/oneloft/findList
     */
    oneloftRequest: function(oneloftData) {
        $.ajax({
            url: location.origin + "/operator/oneloft/findList",
            type: "post",
            data: JSON.stringify(oneloftData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    var list = data.data.list;
                    var total = data.data.total;
                    $("#oneloft_sum_num").html(total); // 数据总数
                    contentObj.getPageNumer(total, "oneloft_page_btn"); //分页
                    contentObj.createMarkOneloft(list);
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    },
    //创建公棚 蒙层 列表
    createMarkOneloft: function(list) {
        var str = "";
        list.forEach(function(val) {
            var oneloftShow = JSON.stringify(val.oneloftShow);
            oneloftShow = encodeURI(oneloftShow);
            var oneloftType = val.oneloftType == 0 ? "春棚" : "秋棚";
            str += '<tr oneloftId="' + val.oneloftId + '" location="' + val.location + '" distance="' + val.distance + '" oneloftShow="' + oneloftShow + '" logo="' + val.logo + '">' +
                '<td>' +
                '<input type="checkbox">' +
                '<label for=""></label>' +
                '</td>' +
                '<td>' +
                '<div class="oneloftName" class="clearfix">' + val.oneloftName + '</div>' +
                '</td>' +
                '<td>' +
                '<p class="establishTime">' + val.createdTime + '</p>' +
                '</td>' +
                // '<td class="cityCode" provinceCode="'+val.provinceCode+'" >'+val.cityCode+'</td>'+
                '<td class="oneloftType" oneloftType="' + val.oneloftType + '">' + oneloftType + '</td>' +
                '</tr>';
        });
        $("#oneloft_mark_list").html(str);
    },


    /**
     * 43、首页配置编辑接口
     * http://域名/operator/configSystem/edit
     */
    saveRequest: function(saveData) {
        $.ajax({
            url: location.origin + "/operator/configSystem/editMulti",
            type: "post",
            data: JSON.stringify(saveData),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                errorToken(data.code);
                if (data.code == 0) {
                    myAlert.createBox("保存成功！");
                }
            },
            error: function() {
                myAlert.createBox("网络不给力");
            }
        })
    }
}