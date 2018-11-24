var weixinInit = {
    trigger: function() {},
	showOptionMenu: true,
	config: {
		appId: "wxcd7143c00e5bb6f7",
		debug: false,
		jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideOptionMenu", "showOptionMenu", "checkJsApi", "chooseWXPay", "addCard", "chooseCard", "openCard","chooseImage", "previewImage", "uploadImage", "downloadImage","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice"]
	},
	signature: {
		type: "POST",
		surl: "/wechat_hera_v4/rest/platform/wx/signiture",
        contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({url: location.href.split("#")[0]}),
		success: function(data) {
			var sinobj = {};
			sinobj.ok = true;
			sinobj.t = data.data.timestamp;
			sinobj.n = data.data.noncestr;
			sinobj.s = data.data.signature;
			return sinobj
		}
	},
	share: {
        title: "",
        desc: "",
        link: "",
        imgUrl: "",
        success: function() {},
        cancel: function() {},
        fail: function() {},
        trigger: function() {}
    },
    hideMenu: [],
    showMenu: [],
	isFunc: function(f) {
		if (typeof(f) === "function" && (f instanceof Function)) {
			return true
		} else {
			return false
		}
	},
	loadJQ: function(cb) {
		if (typeof(jQuery) === "undefined") {
			var jqscriptEle = document.createElement("script");
			jqscriptEle.src = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
			document.head.insertBefore(jqscriptEle, document.head.childNodes[0]);
			jqscriptEle.onload = function() {
				if (weixinInit.isFunc(cb)) {
					cb()
				} else {
					return
				}
			}
		} else {
			if (weixinInit.isFunc(cb)) {
				cb()
			} else {
				return
			}
		}
	}
};
function addCard(cardLists) {
	$.each(cardLists, function(index, el) {
		cardLists[index].cardExt = JSON.stringify(el.cardExt);
	});
	wx.ready(function() {
		wx.addCard({
			cardList: cardLists,
			success: function(res) {
				var resCardList = res.cardList;
				var cardOpenList = [];
				if (resCardList.length > 0) {
					for (var a = 0; a < resCardList.length; a++) {
						var cardOpenLi = {};
						var caId = resCardList[a].cardId;
						var caExt = resCardList[a].cardExt;
						var caCodeJson = eval("(" + caExt + ")");
						var caCode = caCodeJson.code;
						cardOpenLi.cardId = caId;
						cardOpenLi.code = caCode;
						cardOpenList.push(cardOpenLi)
					}
				}
				//toCard(cardOpenList);
			},
			error: function(res) {
				alert(res);
			}
		})
	})
}

function toCard(cardOpenList) {
	wx.openCard({
		cardList: cardOpenList
	})
}


var tkWX = {
	requeryWXJS: function(cb) {
		weixinInit.loadJQ(function() {
			if (typeof wx === "undefined") {
				var scriptEle = document.createElement("script");
				scriptEle.src = "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
				scriptEle.setAttribute("id", "wxload");
				document.head.insertBefore(scriptEle, document.head.childNodes[1]);
				scriptEle.onload = function() {
					if (weixinInit.isFunc(cb)) {
						cb()
					} else {
						return
					}
				}
			} else {
				if (weixinInit.isFunc(cb)) {
					cb()
				} else {
					return
				}
			}
		})
	},
	WXConfigMenu: function(obj) {
		jQuery.ajax({
			type: obj.signature.type,
			url: obj.signature.surl,
			data: obj.signature.data,
			dataType: "json",
			contentType: "application/json;",
			success: function(data) {
				var retCode = obj.signature.success(data);
				if (retCode.ok) {
					tkWX.WXconfig(retCode.t, retCode.n, retCode.s, obj);
					tkWX.WXready(obj, obj.callback)
				} else {
					alert("获取签名失败")
				}
			},
			error: function() {},
			complete: function() {}
		})
	},
	WXconfig: function(t, n, s, obj) {
		var appid = obj.config.appId || "";
		var debug = obj.config.debug || false;
		var jsl = obj.config.jsApiList || ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"];
		wx.config({
			debug: debug,
			appId: appid,
			timestamp: t,
			nonceStr: "" + n + "",
			signature: "" + s + "",
			jsApiList: jsl
		})
	},
	WXready: function(objx, cb) {
		wx.ready(function() {
			if(objx.showOptionMenu){
				wx.showOptionMenu()
			}else{
				wx.hideOptionMenu();
				return;
			}
			wx.onMenuShareAppMessage({
				title: objx.share.title || "",
				desc: objx.share.desc || "",
				link: objx.share.link || "",
				imgUrl: objx.share.imgUrl || "",
				trigger: function(res) {
					if (weixinInit.isFunc(objx.share.trigger)) {
						objx.share.trigger(res)
					} else {
						return
					}
					
				},
				success: function(res) {
					if (weixinInit.isFunc(objx.share.success)) {
						objx.share.success(res)
					} else {
						return
					}
				},
				cancel: function(res) {
					if (weixinInit.isFunc(objx.share.cancel)) {
						objx.share.cancel(res)
					} else {
						return
					}
				},
				fail: function(res) {
					if (weixinInit.isFunc(objx.share.fail)) {
						objx.share.fail(res)
					} else {
						return
					}
				},
				complete: function(res) {
					if (weixinInit.isFunc(objx.share.complete)) {
						objx.share.complete(res)
					} else {
						return
					}
				}
			});
			wx.onMenuShareTimeline({
				title: objx.share.title || "",
				link: objx.share.link || "",
				imgUrl: objx.share.imgUrl || "",
				trigger: function(res) {
					if (weixinInit.isFunc(objx.share.trigger)) {
						objx.share.trigger(res)
					} else {
						return
					}
				},
				success: function(res) {
					if (weixinInit.isFunc(objx.share.success)) {
						objx.share.success(res)
					} else {
						return
					}
				},
				cancel: function(res) {
					if (weixinInit.isFunc(objx.share.cancel)) {
						objx.share.cancel(res)
					} else {
						return
					}
				},
				fail: function(res) {
					if (weixinInit.isFunc(objx.share.fail)) {
						objx.share.fail(res)
					} else {
						return
					}
				},
				complete: function(res) {
					if (weixinInit.isFunc(objx.share.complete)) {
						objx.share.complete(res)
					} else {
						return
					}
				}
			});
			wx.hideMenuItems({
				menuList: objx.hideMenuItems || ["menuItem:readMode", "menuItem:favorite","menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:originPage", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:copyUrl"],
				success: function(res) {},
				fail: function(res) {}
			});
			wx.showMenuItems({
				menuList: objx.showMenuItems || [],
				success: function(res) {},
				fail: function(res) {}
			});
			if (weixinInit.isFunc(cb)) {
        		cb()
    		} else {
        		return
    		}
		})
	},
	chooseimg: function(cb,chooimgs) {
		wx.ready(function() {
			wx.chooseImage({
				count: chooimgs.photoNum || 9,
				sizeType: chooimgs.sizeType || ['original', 'compressed'],
				sourceType: chooimgs.sourceType || ['album', 'camera'],
				success: function(res) {
					var b = res.localIds;
					if (weixinInit.isFunc(cb)) {
						cb(b)
					} else {
						return
					}
				}
			})
		})
	},
	uploadimg: function(locimgs, cb) {
		var loc = locimgs;
		var serverId = [];
		wx.ready(function() {
			if (loc.length == 0) {
				alert("请先使用 chooseImage 接口选择图片");
				return
			}
			var i = 0,
				length = loc.length;
			function upload() {
				wx.uploadImage({
					localId: loc[i],
					success: function(res) {
						i++;
						serverId.push(res.serverId);
						if (i < length) {
							upload()
						} else {
							if (weixinInit.isFunc(cb)) {
								cb(serverId)
							} else {
								return
							}
						}
					},
					fail: function(res) {
						alert(JSON.stringify(res))
					}
				})
			}
			upload()
		})
	},
	//开始录音
	startRecord:function(){
		wx.ready(function(){
			wx.startRecord({
				cancel:function(){
					alert('用户拒接授权录音')
				}
			})
		})
	},
	//停止录音
	stopRecord:function(cb){
		wx.ready(function(){
			wx.stopRecord({
				success:function(res){
					//voice.localId=res.localId;
					var b = res.localId;
					if (weixinInit.isFunc(cb)) {
						cb(b)
					} else {
						return
					}
				},
				fail:function(res){
					alert(JSON.stringify(res))
				}
			})
		})
	},
	//监听录音自动停止
	monitorRecord:function(){
		wx.onVoiceRecordEnd({
			complete:function(res){
				voice.localId=res.localId;
				alert('录音时间超过一分钟自动停止')
			}
		})
	},
	//播放录音
	playVoice:function(vio){
		if(vio==''){
			alert('请先开始一段录音');
			return
		}
		wx.playVoice({
			localId:vio
		})
	},
	//暂停播放录音
	pauseVoice:function(vio){
		wx.pauseVoice({
			localId:vio
		})
	},
	//停止播放
	stopVoice:function(vio){
		wx.stopVoice({
			localId:vio
		})
	},
	//监听录音播放停止
	onVoicePlayEnd:function(cb){
		wx.onVoicePlayEnd({
			complete:function(res){
				if (weixinInit.isFunc(cb)) {
						cb(res.localId)
					} else {
						return
				}
			}
		});
	},
	//上传语音
	uploadVoice:function(vio,cb){
		if(vio==''){
			alert('请先开始一段录音再上传');
			return
		}
		wx.uploadVoice({
			localId:vio,
			success:function(res){
				//alert('上传语音成功,serverId为'+res.serverId);
				var b = res.serverId;
					if (weixinInit.isFunc(cb)) {
						cb(b)
					} else {
						return
					}
				//voice.serverId=res.serverId
			}
		})
	},
	//下载语音
	downloadVoice:function(vio,cb){
		if(vio==''){
			alert('请先使用uploadVoice上传声音');
			return
		}
		wx.ready(function(){
			wx.downloadVoice({
				serverId:vio,
				success:function(res){
					alert('下载语音成功,localId为'+res.localId);
					var b = res.localId;
						if (weixinInit.isFunc(cb)) {
							cb(b)
						} else {
							return
						}
					//voice.localId=res.localId;
				}
			})
		})
	},
	init: function(obj) {
		tkWX.requeryWXJS(function() {
			tkWX.WXConfigMenu(obj)
		})
	}
};