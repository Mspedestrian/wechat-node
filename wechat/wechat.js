
var Promise = require("bluebird");
var fs = require('fs')
var _ = require('lodash')
var util = require('./util')
var request = Promise.promisify(require('request'));
var prefix = 'https://api.weixin.qq.com/cgi-bin'
var api = {
    accessTokenUrl: `${prefix}/token?grant_type=client_credential`,
    ticketUrl: `${prefix}/ticket/getticket`,
    //临时
    temporary:{
        upload: `${prefix}/media/upload`,
        fetch: `${prefix}/media/get`,
    },
    //永久
    permanent:{
        upload: `${prefix}/material/add_material`,
        fetch: `${prefix}/material/get_material`,
        uploadNews: `${prefix}/material/add_news`,
        uploadNewsPic: `${prefix}/media/uploadimg`,
        del: `${prefix}/material/del_material`,
    },
    // 用户分组标签相关信息
    tags:{
        create: prefix+'/tags/create',
        get: prefix +'/tags/get',
        update: prefix +'/tags/update',
        delete: prefix +'/tags/delete',
        getuser: prefix +'/user/tag/get',
        batchtagging: prefix+'/tags/members/batchtagging',
        batchuntagging: prefix+'/tags/members/batchuntagging',
        getidlist: prefix+'/tags/getidlist'
    },
    menu:{
        create: prefix+'/menu/create'
    }
}
function Wechat(config) {
    var _self = this;
    this.token = config.token;
    this.appId = config.appId;
    this.appsecret = config.appsecret;
    this.getAccessToken = config.getAccessToken;
    this.saveAccessToken = config.saveAccessToken;
    this.getTicket = config.getTicket;
    this.saveTicket = config.saveTicket;
    this.fetchAccessToken();
    
}
Wechat.prototype.fetchAccessToken = function(){
    var _self = this;
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
        return Promise.resolve(this)
    }
    return this.getAccessToken()
    .then(function (data) {

        try {
            data = JSON.parse(data);
        }
        catch (e) {

            return _self.updateAccessToken();
        }

        if (_self.isValidAccessToken(data)) {

            return Promise.resolve(data);
        }
        else {
            return _self.updateAccessToken();
        }
    })
    .then(function (data) {
        _self.access_token = data.access_token;
        _self.expires_in = data.expires_in;
        _self.saveAccessToken(data);
        return Promise.resolve(data)
    })
}
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        
        return false;
    }
    let notime = new Date().getTime();
    if (data.expires_in > notime) {
        return true;
    }
    else {
        return false;
    }
}
Wechat.prototype.updateAccessToken = function () {
    var url = `${api.accessTokenUrl}&appid=${this.appId}&secret=${this.appsecret}`
    return new Promise(function (resolve, reject) {
        request({ url: url, json: true })
            .then(function (res) {
                console.log('请求accesstokec')
                var data = res.body;
                var nowtime = new Date().getTime();
                var expires_in = nowtime + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data)
            })
    })

}

Wechat.prototype.fetchTicket = function (access_token) {
    var _self = this;
    return this.getTicket()
        .then(function (data) {

            try {
                data = JSON.parse(data);
            }
            catch (e) {

                return _self.updateTicket(access_token);
            }

            if (_self.isValidTicket(data)) {

                return Promise.resolve(data);
            }
            else {
                return _self.updateTicket(access_token);
            }
        })
        .then(function (data) {
            _self.saveTicket(data);
            return Promise.resolve(data)
        })
}
Wechat.prototype.isValidTicket = function (data) {
    if (!data || !data.ticket || !data.expires_in) {

        return false;
    }
    let notime = new Date().getTime();
    if (data.expires_in > notime) {
        return true;
    }
    else {
        return false;
    }
}
Wechat.prototype.updateTicket = function (access_token) {
    var url = `${api.ticketUrl}?access_token=${access_token}&type=jsapi`
    return new Promise(function (resolve, reject) {
        request({ url: url, json: true })
            .then(function (res) {
                console.log('请求ticket')
                console.log(res.body)
                var data = res.body;
                var nowtime = new Date().getTime();
                var expires_in = nowtime + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data)
            })
    })

}




Wechat.prototype.reply = function () {
    var content = this.content,
    message = this.weixin;
    var xml = util.tpl(content,message);
    this.status = 200;
    this.type = 'application/xml';
  
    this.body = xml

}
Wechat.prototype.updateMaterial = function (type,material,permanent) {
    var form = {};
    var uploadUrl = api.temporary.upload;
    if (permanent) {
        _.extend(form, permanent)
    }
    if(type == 'pic') {
        uploadUrl = api.permanent.uploadNewsPic;
    }
    if (type == 'news') {
        uploadUrl = api.permanent.uploadNews;
        form = material
    }
    else {
        form.media = fs.createReadStream(material)
    }
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
        .then(function(data){
            var url = `${uploadUrl}?access_token=${data.access_token}`
            if (!permanent) {
                url+='?type='+type
            }
            else {
                form.access_token = data.access_token
            }
            var options = {
                method: 'POST',
                url: url,
                json: true,
            }
            if(type == 'news') {
                options.body = form
            }
            else {
                options.formData = form
            }
            
            request(options)
            .then(function (res) {
                resolve(res.body)
            })
            
        })
    })
}



Wechat.prototype.fetchMaterial = function (mediaId,permanent,type) {
    var form = {};
    var fetchUrl = api.temporary.fetch;
    if (permanent) {
        fetchUrl = api.permanent.fetch;
    }
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                // 临时素材是屁接口需改为http
                var url = `${fetchUrl}?access_token=${data.access_token}&media_id=${mediaId}`
                
                var options = {
                    method: 'POST',
                    url: url,
                    json: true,
                }
                request(options)
                    .then(function (res) {
                        resolve(res.body)
                    })

            })
    })
}

Wechat.prototype.deleteMaterial = function (mediaId) {
    var delUrl = api.permanent.del;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${delUrl}?access_token=${data.access_token}&media_id=${mediaId}`
                var options = {
                    method: 'POST',
                    url: url,
                    json: true,
                }
                request(options)
                .then(function (res) {
                    resolve(res.body)
                })
            })
    })
}
Wechat.prototype.createTags = function (tagName) {
    var baseUrl = api.tags.create;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
        .then(function (data) {
            var url = `${baseUrl}?access_token=${data.access_token}`
            var options = {
                access_token: data.access_token,
                "tag": {
                    "name": 'hahahha'
                }
            }
            request({ method: 'POST', url: url, body: options, json: true})
            .then(function (res) {
                console.log(res.body)
                resolve(res.body)
            })
        })
    })
}
Wechat.prototype.getTags = function (tagName) {
    var baseUrl = api.tags.get;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${baseUrl}?access_token=${data.access_token}`
                var options = {
                    access_token: data.access_token,
                    name: tagName,
                }
                request({method: 'GET', url: url, json: true})
                    .then(function (res) {
                        console.log(res.body)
                        resolve(res.body)
                    })
            })
    })
}
Wechat.prototype.updateTags = function (id,name) {
    var baseUrl = api.tags.update;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${baseUrl}?access_token=${data.access_token}`
                var options = {
                    access_token: data.access_token,
                    "tag": {
                        "id": id, "name": name
                    }
                }
                request({ method: 'POST', url: url, json: true, body: options})
                    .then(function (res) {
                        console.log(res.body)
                        resolve(res.body)
                    })
            })
    })
}
Wechat.prototype.deleteTags = function (id) {
    var baseUrl = api.tags.delete;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${baseUrl}?access_token=${data.access_token}`
                var options = {
                    access_token: data.access_token,
                    "tag": { "id": id }
                }
                request({ method: 'POST', url: url, json: true, body: options })
                    .then(function (res) {
                        console.log(res.body)
                        resolve(res.body)
                    })
            })
    })
}
Wechat.prototype.getUserTags = function (id,nextId) {
    var baseUrl = api.tags.getuser;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${baseUrl}?access_token=${data.access_token}`
                var options = {
                    access_token: data.access_token,
                    "tagid": 134, 
                    "next_openid": nextId
                }
                request({ method: 'POST', url: url, json: true, body: options })
                    .then(function (res) {
                        console.log(res.body)
                        resolve(res.body)
                    })
            })
    })
}
Wechat.prototype.createMenu = function (menuObj) {
    var baseUrl = api.menu.create;
    var _self = this;
    return new Promise(function (resolve, reject) {
        _self.fetchAccessToken()
            .then(function (data) {
                var url = `${baseUrl}?access_token=${data.access_token}`
                var options = {
                    access_token: data.access_token,
                    button: menuObj.button,
                }
                request({ method: 'POST', url: url, json: true, body: options })
                    .then(function (res) {
                        console.log(res.body+'创建菜单')
                        resolve(res.body)
                    })
            })
    })
}
module.exports = Wechat;