var util = require('./libs/util')
var path = require('path')
var wechat_file = path.join(__dirname, './config/wechat_file.txt')
var wechat_ticket_file = path.join(__dirname, './config/wechat_ticket_file.txt')
const config = {
    wechat: {
        token: '***',
        appId: '***',
        appsecret: '******',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken: function (data) {
            var data = JSON.stringify(data);
            return util.saveFileAsync(wechat_file, data);
        },
        getTicket: function () {
            return util.readFileAsync(wechat_ticket_file)
        },
        saveTicket: function (data) {
            var data = JSON.stringify(data);
            return util.saveFileAsync(wechat_ticket_file, data);
        },

    }
}
module.exports =  config;