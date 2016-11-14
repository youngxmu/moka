var express = require('express');
var config = require('../config');
var path = require('path');
var logger =  require('../lib/log.js').logger('viewRouter');
var router = express.Router();
var ppt2png = require('ppt2png');

router.post('/ppt', function(req, res) {
	var path = req.body.path;
	var index = path.lastIndexOf('.');
	var imgPath = path.substr(0,index) + '/img';
	path = config.uploadDir + '' + path;
	imgPath = config.uploadDir + '' + imgPath;
	console.log(path);console.log(imgPath);
	ppt2png(path, imgPath, function(err,result){
	    if(err) {
	    	console.log(err);
	        return res.json({
	        	success : false
	        });
	    } else {
	        console.log('convert successful.');
	        console.log(result);
	        return res.json({
	        	success : true,
	        	data : result
	        });
	    }
	}); 
});

module.exports = router;


