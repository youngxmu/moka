var express = require('express');
var config = require("../config");
var commonUtils = require("../lib/utils");
var emailUtils = require("../lib/emailUtils");
var redisUtils = require("../lib/redisUtils");
var userModel = require("../models/userModel");
var logger = require("../lib/log.js").logger("registerRouter");
var router = express.Router();

router.get('/register', function (req, res, next) {
    res.render('user/register');
});

router.get('/register/valid/:code', function (req, res, next) {
	var code = req.params.code;
	redisUtils.get(code, function(err, reply){
		if(err){
			res.render('error', {
				msg : '验证失效，请重新发送验证邮件'
			});
		}else{
			var email = reply;
			var status = 1;
			userModel.updateUserStatus(email, status, function(err){
				if(err){
					res.render('error', {
						msg : '请不要重复验证'
					});
				}else{
					res.render('user/valid-ok');		
				}
			});
		}
	});
	

});

router.post('/register', function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	password = commonUtils.md5(password);

	var host = 'http://localhost:8200/user/register/valid/';
	var str = commonUtils.randomString(12);
	var url = host + url;
	redisUtils.setWithExpire(str, email, 30 * 60);
	var options = {
	    from: 'name ✔ <251795559@qq.com>', // sender address
	    to: email, // list of receivers
	    subject: 'register valid✔', // Subject line
	    text: '请点击链接完成注册 ✔', // plaintext body
	    html: '<b><a href="' + url + '">验证链接：' +url+ '</b>' // html body
	};

	var tel = req.body.tel ? req.body.tel : 0;
	var name = req.body.name ? req.body.name : '';
	var score = 0;
	var status = 0;
	userModel.insertUser(email, tel, name, password, score, status, function(err, result){
		if(err){
			res.json({
				success : false,
				msg : '注册失败请重试'
			});
		}else{
			// emailUtils.sendMail(options, function(){
				res.json({
					success : true,
					msg : '注册成功，请验证邮箱'
				});
			// });
		}
	});
	// emailUtils.sendMail(options, function(){
		// res.json({
		// 	success : true,
		// 	msg : '发送成功'
		// });
	// });
    
});

module.exports = router;

