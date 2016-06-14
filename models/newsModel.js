var db = require('../lib/db.js');

var logger = require("../lib/log.js").logger("newsModel");
var commonUtils = require("../lib/utils.js");


exports.queryNewsList = function (callback) {
    var sql = 'select * from news order by news.index limit 0,5';
    var params = [];
    db.query(sql, params, callback);
};


exports.insertNews = function (title,link,pic_url,index,callback) {
    var sql = 'insert into news (title,link,pic_url,`index`) values(?,?,?,?);';
    db.query(sql,[title,link,pic_url,index],
        function (err, result) {
            callback(err, result);
        }
    );
};


//编辑、修改专家个人信息
exports.delAllNews = function (callback) {
    var sql = 'delete from news';
    var params = [];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("删除出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};