var xml2js = require('xml2js');
var tpl = require('./tpl')
// xml转json
module.exports.xmlToJson = function(data){
    return new Promise(function(resolve,reject){
        xml2js.parseString(data, { trim: true }, function (err, result) {
            if(err){
                reject(err);
            }
            else {
                resolve(result)
            }
        });
    })
    
}

exports.jsonToXml = (obj) => {
    const builder = new xml2js.Builder()
    return builder.buildObject(obj)
}
module.exports.formatJson = formatJson;
function formatJson(data){
    var message = {};
    if(typeof data =='object') {
        var keys = Object.keys(data);
        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            var item = data[key]
            if(!item||item.length ==0){
                message[key] = '';
                continue;
            }
            else if(item.length == 1){
                if (typeof item[0] !='object'){
                    message[key] = item[0]
                }
                else {
                    message[key] = formatJson(item[0])
                }
            }
            else {
                for(var j=0;j<item.length;j++){
                    message[key] = formatJson(item[k])
                }
            }
        }
        return message;
    }
}


module.exports.tpl = function(content,message){
    var info = {},
        fromUserName = message.FromUserName,
        toUserName = message.ToUserName,
        notime = Date.now(),
        msgType = 'text';
    if(Array.isArray(content)){
        msgType = 'news'
    }
    msgType = content.msgType || msgType;
    info.FromUserName = toUserName,
    info.ToUserName = fromUserName,
    info.CreateTime = notime,
    info.MsgType = msgType,
    info.content = content;

    
    
    return tpl.compiled(info)
};