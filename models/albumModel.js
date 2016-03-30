var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("albumModel");

//查找未发送的系统福利
exports.querySystemBenifit = function(start, pageSize, callback){
	db.query("select * from link_album_system where status = 0 order by create_time desc limit ?,?;", [start, pageSize], callback);
};

//查找未发送的系统福利总数
exports.querySystemBenifitCount = function (callback) {
    var sql = 'select count(id) as count from link_album_system where status = 0 ';
    
    db.query(sql, [], function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找未发送的系统福利总数出错", err);
            callback(0);
        }
    });
};

//发送系统福利
exports.sendSystemBenifit = function(benifitId, callback){
    db.query("update link_album_system set status = 1 where id = ?", [benifitId], callback);
};

//查找模特写真分页数据
exports.getModelAlbumPageList = function (modelId, start, pageSize, callback) {
    var sql = 'select a.* from album a ';
    sql += 'where a.model_id = ? order by create_time desc limit ?,? ';
    db.query(sql, [modelId, start, pageSize], callback);
};

//查找模特写真总数
exports.getModelAlbumTotalCount = function (modelId, callback) {
    db.query("select count(id) as count from album where model_id=?", [modelId], function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找模特写真总数出错", err);
            callback(0);
        }
    });
};


/** 导入相关 */
//查找未发送的系统福利
exports.queryImportSystemBenifit = function(start, pageSize, callback){
    db.query("select * from album_temp where status = 0 order by create_time desc limit ?,?;", [start, pageSize], callback);
};

//查找未发送的系统福利总数
exports.queryImportSystemBenifitCount = function (callback) {
    var sql = 'select count(id) as count from album_temp where status = 0 ';
    
    db.query(sql, [], function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找未发送的系统福利总数出错", err);
            callback(0);
        }
    });
};

//发送系统福利
exports.sendImportSystemBenifit = function(benifitId, callback){
    db.query("update album_temp set status = 1 where id = ?", [benifitId], callback);
};

//del model album
exports.delModelAlbum = function(modelId, albumId, callback){
    db.query("delete from album where model_id = ? and id = ?;", [modelId, albumId], callback);
};