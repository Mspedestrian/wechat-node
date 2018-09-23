
var fs = require('fs');
var Promise = require("bluebird");
module.exports.readFileAsync = function (filename, encoding){
    
    return new Promise(function(resolve,reject){
        fs.readFile(filename,'utf-8',function(err,content){
            if(err){
                reject(err);
            }
            else {
                resolve(content)
            }
            
        })
    })
}
module.exports.saveFileAsync = function (filename, data,encoding) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, data,encoding, function (err, content) {
            if (err) {
                reject(err);
            }
            else {
                resolve()
            }

        })
    })
}