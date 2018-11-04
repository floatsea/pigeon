var openid = getParameter("openid");
var scrollFlag = true; //上拉加载更多 标识， true 可以加载， false不可加载
var Authorization = localStorage.getItem("Authorization") || "";
var myOrderObj = {
    initRequest: function(myOrderPostData) { //接口21
        $.ajax({
            url: location.origin + "/customer/orders/findList",
            type: "post",
            data: JSON.stringify(myOrderPostData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == "0") {
                    var list = data.data.list;
                    switch (myOrderPostData.orderitemStatus) {
                        case "0": //待付款
                            myOrderObj.createPayList(list);
                            break;
                        case "3": //待收货
                            myOrderObj.createSendGoods(list);
                            break;
                        case "": //全部
                            myOrderObj.createAllList(list);
                            break;
                    }
                    scrollFlag = data.data.hasNextPage;
                    if (!scrollFlag) {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("没有更多数据~");
                    } else {
                        $(".load_more img").hide();
                        $("#load_more_txt").html("上拉加载更多");
                    }
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        })
    },
    createPayList: function(list) { //待付款
        var payOrderStr = "";
        list.forEach(function(val) {
            if (val.orderStatus == 0) {
                var orderitems = val.orderitems;
                var imgList = "";
                var sumMoney = 0;
                orderitems.forEach(function(imgVal) {
                    //orderitemStatus
                    imgList += '<li>' +
                        '<img src="' + imgVal.goodsDesc.pigeonPic + '">' +
                        '</li>';
                    sumMoney += Number(imgVal.goodsPrice);
                });
                payOrderStr += '<div class="order_del" onclick="goDtl(\'' + val.orderId + '\')" orderId="' + val.orderId + '">' +
                    '<div class="order_num clearfix">' +
                    '<p class="order_number">订单号：' + val.orderId + '</p>' +
                    '<p class="order_w">等待付款</p>' +
                    '</div>' +
                    '<div class="on_hot_banner">' +
                    '<ul class="order_img">' + imgList + '</ul>' +
                    '</div>' +
                    '<div class="price_sum clearfix">' +
                    '<div class="price_sum_left">' +
                    '<p class="price_sum_num">共' + orderitems.length + '件商品</p>' +
                    '<p class="price_sum_mon">待付款 <i style="color:#f9454e;">' + sumMoney + '</i>元</p>' +
                    '</div>' +
                    '<div class="price_sum_right">' +
                    '<button class="pay_sure_btn">确认付款</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        })
        $("#pay_order_box").append(payOrderStr);
    },
    createSendGoods: function(list) { //待收货
        var sendOrderStr = "";
        list.forEach(function(val) {
            var orderitems = val.orderitems;
            var imgList = "";
            orderitems.forEach(function(imgVal) {
                if (imgVal.orderitemStatus == 3) {
                    imgList += '<li class="list_images_n clearfix">' +
                        '<div class="list_images_l">' +
                        '<img src="' + imgVal.goodsDesc.pigeonPic + '">' +
                        '</div>' +
                        '<div class="list_images_r">' +
                        '<p class="list_images_rn">' + imgVal.goodsDesc.pigeonName + '<span>' + imgVal.goodsDesc.pigeonNo + '</span></p>' +
                        '<p class="dove_price1"><span>&yen</span>' + imgVal.goodsPrice + '元</p>' +
                        '</div>' +
                        '<button class="goods_sure_btn" orderitemId="' + imgVal.orderitemId + '">确认收货</button>' +
                        '</li>';
                }

            });
            if (imgList) {
                sendOrderStr += '<div class="order_del"  onclick="goDtl(\'' + val.orderId + '\')">' +
                    '<div class="order_num clearfix">' +
                    '<p class="order_number">订单号：' + val.orderId + '</p>' +
                    '<p class="order_w">等待收货</p>' +
                    '</div>' +
                    '<div>' +
                    '<ul class="goods_items">' + imgList + '</ul>' +
                    '</div>' +
                    '<div class="price_sum clearfix">' +
                    '<div class="price_sum_right">' +
                    '<p class="price_sum_num">共' + orderitems.length + '件商品</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        })
        $("#goods_box").append(sendOrderStr);
    },
    createAllList: function(list) { //全部
        var allOrderStr = "";
        list.forEach(function(val) {
            var orderitems = val.orderitems;
            var imgList = "";
            orderitems.forEach(function(imgVal) {
                imgList += '<li>' +
                    '<img src="' + imgVal.goodsDesc.pigeonPic + '">' +
                    '</li>';
            });
            console.log(val.orderStatus)
            var orderstatus = myOrderObj.setOrderStatus(val.orderStatus);
            allOrderStr += '<div class="order_del"  onclick="goDtl(' + val.orderId + ')" orderId="' + val.orderId + '">' +
                '<div class="order_num clearfix">' +
                '<p class="order_number">订单号：' + val.orderId + '</p>' +
                '<p class="order_w">' + orderstatus + '</p>' +
                '</div>' +
                '<div class="on_hot_banner">' +
                '<ul class="order_img">' + imgList + '</ul>' +
                '</div>' +
                '<div class="price_sum clearfix">' +
                '<div class="price_sum_left">' +
                '<p class="price_sum_num">共' + orderitems.length + '件商品</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        })
        $("#all_order").append(allOrderStr);
    },
    setOrderStatus: function(orderitemStatus) {
        var orderstatus = "";
        switch (orderitemStatus+"") {
            case "0":
                orderstatus = "待付款";
                break;
            case "-1":
                orderstatus = "已取消";
                break;
            case "5":
                orderstatus = "已付款";
                break;
            case "2":
                orderstatus = "待发货";
                break;
            case "3":
                orderstatus = "已发货";
                break;
            case "4":
                orderstatus = "已完成";
                break;
        }
        return orderstatus;
    },
    submitPay: function(payPostData) { //确认付款
        Authorization = localStorage.getItem("Authorization") || "";
        $.ajax({
            url: location.origin + "/customer/orders/confirmPaid",
            type: "post",
            data: JSON.stringify(payPostData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        });
    },
    //确认收货
    goodsSure: function(postGoodsData) {
        Authorization = localStorage.getItem("Authorization") || "";
        $.ajax({
            url: location.origin + "/customer/orderitem/confirmReceived",
            type: "post",
            data: JSON.stringify(postGoodsData),
            dataType: "json",
            contentType: "application/json",
            headers: { Authorization: Authorization },
            success: function(data) {
                
                if (data.code == 0) {
                    myAlert.createBox(data.msg);
                }
            },
            error: function() {
                myAlert.createBox("服务器开小差！");
            }
        });
    },
    readFile: function() {
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("文件必须为图片！");
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        //当文件读取成功便可以调取上传的接口
        reader.onload = function(e) {
            console.log(this)
            var data = this.result.split(',');
            var tp = (file.type == 'image/png') ? 'png' : 'jpg';
            var imgSrc = this.result; //"data:image/*;base64,"+data[1];
            //需要上传到服务器的在这里可以进行ajax请求
            //document.getElementById("upImg").src= "data:image/*;base64,"+imgSrc;
            var oImg = document.createElement("img");
            oImg.src = imgSrc;
            document.getElementById("img_list_box").appendChild(oImg);
        }
    }
}