var express = require('express');
var config = require("../../config");
var async = require('async');
var newsModel = require("../../models/newsModel");
var indexModel = require("../../models/indexModel");
var logger = require("../../lib/log.js").logger("indexRouter");

var router = express.Router();

router.get('', function (req, res, next) {
    res.render('admin/index');
});

router.get('/module', function (req, res, next) {
    res.render('admin/index/module');
});

router.post('/news', function (req, res, next) {
    newsModel.queryNewsList(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});

router.post('/setnews', function (req, res, next) {
	var newsStr = req.body.newsStr;
	var newslist = JSON.parse(newsStr);
	newsModel.delAllNews(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		async.each(newslist,
				function(news, callback){
					newsModel.insertNews(news.title, news.link, news.pic_url, news.index, function (err, result) {
	                    callback(err);
	                });
				},
				function(err){
					if (err) {//任何一个err都会停止执行其他
	                    res.json({
	                        success: false,
	                        msg: "更新失败"
	                    });
	                } else {
	                    res.json({
	                        success: true
	                    });
	                }
				}
			);
    	}
    });
});

router.post('/modules', function (req, res, next) {
    indexModel.queryModules(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});

router.post('/updateModule', function (req, res, next) {
	var id = req.body.id;
	var keywords = req.body.keywords;
    indexModel.updateModule(id, keywords, function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});


module.exports = router;

