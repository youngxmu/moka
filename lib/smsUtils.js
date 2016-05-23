//短信发送utils

var request = require("request");
var config = require("../config");
var logger = require('../lib/log.js').logger('smsUtils');

var apiKey = config.sms.apikey;
var url = "http://yunpian.com/v1/sms/send.json";


/**
 * {
 *       "code": 0,
 *       "msg": "OK",
 *       "result": {
 *           "count": 1,   //成功发送的短信个数
 *           "fee": 1,     //扣费条数，70个字一条，超出70个字时按每67字一条计
 *           "sid": 1097   //短信id；群发时以该id+手机号尾号后8位作为短信id
 *       }
 *  }
 * @param mobile
 * @param text
 * @param callback
 */
exports.sendSMS = function sendSMS(mobile, text, callback){
    var formData={
        apikey:apiKey,
        mobile:mobile,
        text:"【微模APP】审核结果提醒："+text
    };
    request.post({url:url, form:formData}, function (error, response, body) {
        logger.info("sms send:", mobile, text, error, body);
        if(!error){
            body = JSON.parse(body);
            if(body && body.code==0){
                logger.info("sms send success");
                callback && callback(true);
            }else{
                logger.error("sms send failed");
                callback && callback(false);
            }
        }
    });
};


exports.randomCode = function (){
    var result = parseInt(Math.random()*1000000);
    if(result<100000)
        result = 100000+result;
    return result;
}

//console.log(exports.randomCode());


//exports.sendSMS("13693320901", "123456", function(result){
//    console.log(result);
//});