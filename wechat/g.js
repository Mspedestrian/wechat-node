var sha1 = require('sha1');
var getRawBody = require('raw-body')
var Wechat = require('./wechat')
var util  = require('./util')
module.exports = function (config, handler){
    var wechat = new Wechat(config)
    return async function(ctx,next){
    
        var { signature, timestamp, nonce, echostr } = ctx.query;
        var token = config.token;
        var str = [token, timestamp, nonce].sort().join('');
     
        if (ctx.req.method == 'GET') {
            if (sha1(str) == signature) {
                ctx.response.body = echostr + ''
            }
            else {
                console.log('error')
            }
        }
        if (ctx.req.method == 'POST'){
            if (sha1(str) !== signature) {
                return false;
            }
            var data = await getRawBody(ctx.req,{
                length:ctx.length,
                limit:'1mb',
                encoding :ctx.charset
            })
            var content = await util.xmlToJson(data);
            var message = await util.formatJson(content.xml);
            ctx.weixin = message;
            await handler.apply(ctx, next);
            wechat.reply.call(ctx)
            
            return;
            
        }
    }
} 
