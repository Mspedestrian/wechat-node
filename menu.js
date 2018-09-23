var config = require('./config')
module.exports = {
    "button": [
    //     {
    //     "name": "今日歌曲",
    //     "sub_button": [{
    //         "name": "发送位置",
    //         "type": "location_select",
    //         "key": "rselfmenu_2_0"
    //     },{
    //         "type": "media_id",
    //         "name": "图片",
    //         "media_id": "MEDIA_ID1"
    //     },{
    //         "type": "view_limited",
    //         "name": "图文消息",
    //         "media_id": "MEDIA_ID2"
    //     }]
    // },
    {
        "name": "菜单",
        "sub_button": [{
            "type": "view",
            "name": "搜索",
            "url": "http://www.soso.com/"
        },
        // {
        //     "type": "miniprogram",
        //     "name": "wxa",
        //     "url": "http://mp.weixin.qq.com",
        //     "appid": config.wechat.appId,
        //     "pagepath": "pages/lunar/index"
        // },
        {
            "name": "发送位置",
            "type": "location_select",
            "key": "location"
        },
        {
            "type": "click",
            "name": "赞一下我们",
            "key": "zan"
        }]
    },{
        "name": "发图扫码",
        "sub_button": [{
            "type": "pic_sysphoto",
            "name": "系统拍照发图",
            "key": "photo1",
          
        },{
            "type": "pic_photo_or_album",
            "name": "拍照或者相册发图",
            "key": "photo2",
        },{
            "type": "pic_weixin",
            "name": "微信相册发图",
            "key": "photo3",
        }, {
            "type": "scancode_waitmsg",
            "name": "扫码带提示",
            "key": "scan1",
        }, {
            "type": "scancode_push",
            "name": "扫码推事件",
            "key": "scan2",
        }]
    },
    ]
}