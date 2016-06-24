var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("resourceModel");
var commonUtils = require("../lib/utils.js");

//user & common
exports.queryResources = function (status, start, pageSize, callback) {
    var sql = 'select * from resource where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryResourceTotalCount = function (status, callback) {
    var sql = 'select count(id) as count from resource where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            callback(0);
        }
    });
};

exports.queryResourceById = function (resourceId, callback) {
    db.query("select * from resource where id = ? and status = 1;", [resourceId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

exports.queryResourceByTitle = function (title, start, pageSize, callback) {
    var sql = 'select * from resource where 1 = 1 ';
    if(title){
        sql += 'and title like "%' + title + '%" ';
    }
    sql += 'order by create_time desc limit ?,?;';
    var params = [];
    params.push(start);
    params.push(pageSize);
    db.query(sql, [start, pageSize], callback);
};

exports.queryResourceByTitleTotalCount = function (title, callback) {
    var sql = 'select count(id) as count from resource where 1 = 1 ';
    if(title){
        sql += 'and title like "%' + title + '%" ';
    }
    sql += ';';
    var params = [];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};

//admin
//根据id获取文章
exports.getResourceById = function (resourceId, callback) {
    db.query("select * from resource where id = ?;", [resourceId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};
exports.insertResource = function (res_id,sys_type,title,content_type, callback) {
    var sql = 'insert into resource (res_id,sys_type,title,content_type, create_time) ';
        sql += 'values(?,?,?,?,?);';
    db.query(sql, [res_id,sys_type,title,content_type, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改文章个人信息

exports.updateResource = function (id, res_id,sys_type,title,content_type , callback) {
    var sql = 'update resource set res_id=?, sys_type=?, title=?, content_type=?, create_time = ? ';
    var params = [];
    params.push(res_id);
    params.push(sys_type);
    params.push(title);
    params.push(content_type);
    params.push(new Date());
    sql += ' where id = ?;';
    params.push(id);
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("修改文章出错", err);
            callback(err);
        }
    });
};

exports.delResource = function (id, callback) {
    var sql = 'delete from resource ';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);
    db.query(sql, params, function (err, result) {
        if (!err) {
            callback(null);
        } else {
            logger.error("删除文章出错", err);
            callback(err);
        }
    });
};