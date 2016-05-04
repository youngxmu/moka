var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("questionQuestion");
var commonUtils = require("../lib/utils.js");


exports.queryQuestions = function (type, pageSize, callback) {
    var sql = 'select * from question where 1=1 ';
    var params = [];
    if (type || type == 0) {
        sql += ' and type = ? ';
        params.push(type);
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找题目总数
exports.queryQuestionTotalCount = function (type, menu_id, callback) {
    var sql = 'select count(id) as count from question where 1=1 ';
    var params = [];
    if (type || type == 0) {
        sql += ' and type = ? ';
        params.push(type);
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找题目总数出错", err);
            callback(0);
        }
    });
};


//根据id获取题目
exports.getQuestionById = function (questionId, callback) {
    db.query("select * from question where id = ?;", [questionId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

//根据题目标题模糊查询题目
exports.queryQuestionByBody = function (qbody, callback) {
    db.query('select * from question where qbody like "%' + name + '%" order by create_time desc',
        [], callback);
};


exports.insertQuestion = function (qbody, qtype, qanswer, rtanswer, callback) {
    var sql = 'insert into question ( ';
    sql += 'qbody, qtype, qanswer, rtanswer, create_time) ';
    sql += 'values(?,?,?,?,?);';
    db.query(sql,
        [qbody, qtype, qanswer, rtanswer, 0 , new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改题目个人信息
exports.updateQuestion = function (id, qbody, qtype, qanswer, rtanswer, callback) {
    var sql = 'update question set qbody = ?, qtype =?, qanswer = ?, rtanswer = ?';
    var params = [];
    params.push(qbody);
    params.push(qtype);
    params.push(qanswer);
    params.push(rtanswer);
    sql += ',update_time = ? ';
    params.push(new Date());
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改题目出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

