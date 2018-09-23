var wechat = require('./wechat/wechat')
var config = require('./config')
var menuObj = require('./menu')
var wechatApi = new wechat(config.wechat)
module.exports.reply = async function(next) {
    var message = this.weixin;
    var replyObj;
    if (message.MsgType == 'event'){
        if (message.Event == 'subscribe') {
            replyObj = '欢迎关注我的测试号';
        }
        if (message.Event == 'unsubscribe') {
            console.log('取消关注')
        } 
        if (message.Event == 'SCAN') {
            console.log(message.EventKey, message.Ticket)

        } 
        if (message.Event == 'LOCATION') {
            replyObj = '您的位置为' + JSON.stringify(message)

        } 
        if (message.Event == 'location_select') {
            console.log(message)
            replyObj = 'success'
        } 
        if (message.Event == 'CLICK') {
            console.log(message.EventKey)
            if (message.EventKey == 'zan'){
                replyObj = '感谢您赞了一下我'
            }
        } 
        if (message.Event == 'pic_photo_or_album') {
            console.log(message)
            if (message.EventKey == 'photo2') {
                replyObj = 'success'
            }
        } 
        if (message.Event == 'scancode_waitmsg') {
            console.log(message)
            replyObj = 'success'
        } 
    } else if (message.MsgType == 'text') {
        // replyObj = `您发送的文本消息为${message.Content}`
        // replyObj = [{
        //     title:'哈哈哈',
        //     description:'简介',
        //     picurl:'http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg',
        //     url:'https://www.baidu.com',
        // }]
        // replyObj = {
        //     type:'image',
        //     filename:`${__dirname}/1.jpg`
        // }
        // var data = await wechatApi.updateMaterial('image', `${__dirname}/1.jpg`)
        // console.log(data)
        // replyObj = {
        //     msgType: 'image',
        //     mediaId: data.media_id,
        // }
        if(message.Content == 1){
            var data = await wechatApi.createTags('默认用户')
            console.log(data)
            replyObj = '您创建了一个标签'+JSON.stringify(data)
        }
        if (message.Content == 2) {
            var data = await wechatApi.getTags('默认用户')
            console.log(data)
            replyObj = '获取标签' + JSON.stringify(data)
        }
        if (message.Content == 3) {
            var data = await wechatApi.updateTags(2,'xiugai用户')
            console.log(data)
            replyObj = '获取标签' + JSON.stringify(data)
        }
        if (message.Content == 4) {
            var data = await wechatApi.createMenu(menuObj)
            console.log(data)
            replyObj = '创建菜单' + JSON.stringify(data)
        }

        

    } else if (message.MsgType == 'voice') {
        replyObj = `您发送的语音消息为${message.MediaId}-${message.MsgID}-${message.Format}`
          
    } else if (message.MsgType == 'video') {
        replyObj = `您发送的视频消息为${message.MediaId}-${message.MsgID}-${message.ThumbMediaId}`
    } else if (message.MsgType == 'shortvideo') {
        replyObj = `您发送的小视频消息为${message.MediaId}-${message.MsgID}-${message.ThumbMediaId}`
    } else if (message.MsgType == 'location') {
        replyObj = `您发送的地理位置为${message.Location_X}-${message.Location_Y}-${message.Scale}-${message.Label}-${message.MsgId}`
    } else if (message.MsgType == 'link') {
        replyObj = `您发送的地理位置为${message.Title}-${message.Description}-${message.Url}-${message.MsgId}`
    } else if (message.MsgType == 'image'){
        console.log(message)
        replyObj = '你发了个啥'
    }
    this.content = replyObj
    await next;
    
}