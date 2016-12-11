var express = require('express');
var config = require('../config');
var path = require('path');
var articleModel = require('../models/articleModel.js');
var logger =  require('../lib/log.js').logger('viewRouter');
var router = express.Router();
var exec = require('child_process').exec;

router.post('/ppt', function(req, res) {
	var path = req.body.path;
	var id = req.body.id;
	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var srcPath = pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	path= path.replace(/\//g,'\\');
	pdfPath= pdfPath.replace(/\//g,'\\');
	
	var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	console.log(cmd);
	exec(cmd, [], function(re){
		articleModel.updateViewName(id, srcPath, function(err){
			if(err){
				logger.error(err, 'update error');
			}
			res.json({
				src : srcPath
			});
		});
	})
});

router.post('/doc', function(req, res) {
	var path = req.body.path;
	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var viewName = pdfPath;
	var srcPath = config.uploadDir + '/' + pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	path= path.replace(/\//g,'\\');
	pdfPath= pdfPath.replace(/\//g,'\\');
	
	var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	console.log(cmd);
	exec(cmd, [], function(re){
		console.log(re);
		res.json({
			src : srcPath
		});
	})
});

module.exports = router;