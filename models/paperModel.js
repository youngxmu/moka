var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("paperPaper");
var commonUtils = require("../lib/utils.js");


exports.queryPapers = function (name, start, pageSize, callback) {
    var sql = 'select * from paper where status = 1 ';
    var params = [];
    if (name || name == 0) {
        sql += ' and name like %' + name + '% ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryPaperTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from paper where status = 1 ';
    var params = [];
    if (name || name == 0) {
        sql += ' and name like %' + name + '% ';
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找试卷总数出错", err);
            callback(0);
        }
    });
};


//根据id获取试卷
exports.getPaperById = function (paperId, callback) {
    db.query("select * from paper where id = ?;", [paperId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.insertPaper = function (qbody, qtype, qanswer, rtanswer, callback) {
    var sql = 'insert into paper ( ';
    sql += 'qbody, qtype, qanswer, rtanswer, create_time) ';
    sql += 'values(?,?,?,?,?);';
    db.query(sql,
        [qbody, qtype, qanswer, rtanswer, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改试卷个人信息
exports.updatePaper = function (id, qbody, qtype, qanswer, rtanswer, callback) {
    var sql = 'update paper set qbody = ?, qtype =?, qanswer = ?, rtanswer = ?';
    var params = [];
    params.push(qbody);
    params.push(qtype);
    params.push(qanswer);
    params.push(rtanswer);
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改试卷出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


//编辑、修改试卷个人信息
exports.delPaper = function (id, callback) {
    var sql = 'update paper set status = 0';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改试卷出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


