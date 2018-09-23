var Koa = require('Koa');
var wechat = require('./wechat/g')
var path = require('path')
var weixin = require('./weixin')
var config = require('./config')
var Wechat = require('./wechat/wechat')
var app = new Koa();
var sha1 = require('sha1');


var ejs = require('ejs');
var heredoc = require('heredoc');
var tpl = heredoc(function () {/*
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>语音</title>
        <style lang="">
            html {
                width: 100%;
            }
            body {
                width: 100%;
            }
            .button,.cancelbutton {
                width:280px;
                margin：20px auto;
                height:40px;
                line-height:40px;
                text-align:center;
                background:red;
                color:#fff;
                border-radius:5px;
            }
            
        </style>
    </head>
    <body>
        <div class="button" style="margin-bottom:30px">点击搜索</div>
        <div class="cancelbutton">结束录音</div>
        <p id="title"></p>
        <div id="poster"></div>
        <script src="http://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script>
        <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
        <script>
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端window.alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxa549d7c4b991f060', // 必填，公众号的唯一标识
                timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
                nonceStr: '<%= nonceStr %>', // 必填，生成签名的随机串
                signature: '<%= signature %>',// 必填，签名
                jsApiList: [
                    'chooseImage',
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareWeibo",
                    "onMenuShareQZone",
                    "startRecord",
                    "stopRecord",
                    "onVoiceRecordEnd",
                    "playVoice",
                    "pauseVoice",
                    "stopVoice",
                    "onVoicePlayEnd",
                    "uploadVoice",
                    "downloadVoice",
                    "chooseImage",
                    "previewImage",
                    "uploadImage",
                    "downloadImage",
                    "translateVoice",
                    "getNetworkType"
                ] // 必填，需要使用的JS接口列表 
            });
            wx.ready(function(){
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                console.log('finish')
                $('.button').on('click',function(e){
                   window.alert('开始录音')
                    wx.startRecord({
                        cancel:function(){
                            window.alert('11111')
                        }
                    });
                })
                $('.cancelbutton').on('click',function(e){
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            console.log(localId)
                            wx.translateVoice({
                                localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    window.alert(res.translateResult); // 语音识别的结果
                                    $.ajax({
                                        url:'https://api.douban.com/v2/movie/search?q=黑客帝国',
                                        type:'get',
                                        dataType:'jsonp',
                                        callback:'callback',
                                        success:function(data){
                                            console.log(data)
                                        }
                                    })
                                }
                            });
                        }
                    });
                })
                
            });
            wx.error(function(res){
                console.log(res)
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        </script>
    </body>
    </html>
*/})
function createTimestamp(){
    return parseInt(new Date().getTime()/1000)
}
function createNonceStr() {
    var str = Math.random().toString(32).substring(2,15);
    return str;
}
function _sign(timestamp, nonceStr, ticket, url) {
    var arr = [
        'noncestr=' + nonceStr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ]
    
    var str = arr.sort().join('&');
    var hash = sha1(str);
    return hash;
}
function sign(ticket,url){
    var timestamp = createTimestamp();
    var nonceStr = createNonceStr();
    var signature = _sign(timestamp, nonceStr, ticket, url)
    return {
        timestamp,
        nonceStr,
        signature
    }
}
app.use(async function(ctx,next){
    if(ctx.url.indexOf('move')>-1) {
        var wechatApi = new Wechat(config.wechat)
        var data1 = await wechatApi.fetchAccessToken();
        var token = data1.access_token;
        var data = await wechatApi.fetchTicket(token)
        // var url = ctx.href.replace(/http/,'https')
        var url = ctx.href;
        var params = sign(data.ticket,url);
        ctx.body = ejs.render(tpl, params)
        return next;
    }
    await next; 
})
app.use(wechat(config.wechat,weixin.reply))
app.listen(1001)






