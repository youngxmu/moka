var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var indexModel = require('../../models/indexModel.js');
var router = express.Router();

router.get('/desc', function (req, res, next) {
    var data =  {
        link : 'index/info/desc',
        title : '中心简介',
        mid : 100101
    };
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});

router.get('/org', function (req, res, next) {
    var data =  {
        link : 'index/info/org',
        title : '研究队伍',
        mid : 100102
    };
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});

module.exports = router;

