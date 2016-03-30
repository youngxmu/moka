var commonUtils = require("../lib/utils.js");
var config = require("../config");

var originPasswd = "123456";//用户输入的原始密码
var receivePasswd = commonUtils.md5(originPasswd,"-weimo");
var dbPasswd = commonUtils.md5(receivePasswd, config.md5Salt);
var imPasswd = commonUtils.md5(dbPasswd,"easemob_salt");

console.log("原始密码：", originPasswd);
console.log("由手机端加密后传来的密码",receivePasswd );
console.log("入库的密码",dbPasswd);
console.log("环信密码", imPasswd);


console.log("管理员库密码",commonUtils.md5(originPasswd,config.md5Salt));