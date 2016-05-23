//环信支持
var request = require("request");
var config = require("../config");
var logger = require('../lib/log.js').logger('easemobUtils');
var redisUtils = require("./redisUtils.js");//用于保存token

var easemobTokenKey = "ease_mob_token";
var easemobTokenKeyExpireTime = 1 * 24 * 60 * 60;

var orgName = config.easemob.org_name;
var appName = config.easemob.app_name;
var clientId = config.easemob.client_id;
var clientSecret = config.easemob.client_secret;


//获取授权token：先查找redis，没有则重新请求获取后放入redis
exports.getToken = function (callback) {
    redisUtils.get(easemobTokenKey, function (err, reply) {
        logger.info("查找环信token", err, reply);
        if (err || !reply) {
            var options = {
                url: "https://a1.easemob.com/" + orgName + "/" + appName + "/token",
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                form: JSON.stringify({
                    "grant_type": "client_credentials",
                    "client_id": clientId,
                    "client_secret": clientSecret
                })
            };

            request(options, function (error, response, body) {
                logger.info("请求环信token，返回:", error, body);
                try {
                    body = JSON.parse(body);
                    if (!error && body && body["access_token"]) {
                        logger.info("存环信token到redis");
                        redisUtils.setWithExpire(easemobTokenKey, body["access_token"], easemobTokenKeyExpireTime, function (err, reply) {
                            logger.info("存环信token到redis:", easemobTokenKey, body["access_token"], err, reply);
                        });
                    }

                    callback && callback(error, (body && body["access_token"]) ? body["access_token"] : "");
                } catch (e) {
                    callback && callback(e, null);
                }
            });
        } else {
            callback && callback(null, reply);
        }
    });
}


//curl -X POST "https://a1.easemob.com/feton/weimo/token" -d '{"grant_type":"client_credentials","client_id":"YXA69t7vQMSpEeS9U7Hvr0Eqtg","client_secret":"YXA6E2zSoYHRnjE8dj-Rr3peMFwZeeQ"}'


/**
 * 注册用户到环信
 *
 * 环信API返回示例
 *
 *
 {
  "action" : "post",
  "application" : "a2e433a0-ab1a-11e2-a134-85fca932f094",
  "params" : { },
  "path" : "/users",
  "uri" : "https://a1.easemob.com/easemob-demo/chatdemoui/users",
  "entities" : [ {
         "uuid" : "7f90f7ca-bb24-11e2-b2d0-6d8e359945e4",
         "type" : "user",
         "created" : 1368377620796,
         "modified" : 1368377620796,
         "username" : "jliu",
         "activated" : true
     } ],
  "timestamp" : 1368377620793,
  "duration" : 125,
  "organization" : "easemob-demo",
  "applicationName" : "chatdemo"
 }
 */
exports.registerUser = function (username, passwd, nickname) {
    logger.info("尝试注册环信用户", username, passwd, nickname);
    exports.getToken(function (error, token) {
        if (!error) {
            var options = {
                url: "https://a1.easemob.com/" + orgName + "/" + appName + "/users",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                form: JSON.stringify({
                    "username": username,
                    "password": passwd,
                    "nickname": nickname || ''
                })
            };

            request(options, function (error, response, body) {
                logger.info("注册环信用户->", username, " 返回:", error, body);//像名字冲突这种，error也为null
                //注册环信用户，返回: null {"error":"duplicate_unique_property_exists","timestamp":1426327809083,"duration":0,"exception":"org.apache.usergrid.persistence.exceptions.DuplicateUniquePropertyExistsException","error_description":"Application f6deef40-c4a9-11e4-bd53-b1efaf412ab6Entity user requires that property named username be unique, value of 123456 exists"}

                if (error || (body && body.error)) {
                    logger.error("注册环信用户，失败",username);
                }
            });
        } else {
            logger.error("注册环信用户时无法获取环信授权token", error);
        }
    });
};


//exports.registerUser("3434348", "1234545");

