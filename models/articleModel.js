var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("articleArticle");
var commonUtils = require("../lib/utils.js");


exports.queryArticles = function (status, menu_id, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
    
   

    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找文章总数
exports.queryArticleTotalCount = function (status, menu_id, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};


exports.getArticleList = function (status, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
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

//根据“是否虚拟”“创建来源”查找文章总数
exports.getArticleTotalCount = function (status, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};


//根据id获取文章
exports.getArticleById = function (articleId, callback) {
    db.query("select * from article where id = ?;", [articleId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


//根据id查询文章
exports.queryArticleById = function (articleId, callback) {
    db.query("select * from article where id = ? and status = 1;", [articleId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


//根据文章标题模糊查询文章
exports.queryArticleByTitle = function (name, callback) {
    db.query('select * from article where name like "%' + name + '%" order by create_time desc',
        [], callback);
};


exports.insertArticle = function (title, author, content, menu_id, author_id, file_name, type, callback) {
    var sql = 'insert into article ( ';
        sql += 'title, author, content, status, create_time, update_time, menu_id, author_id, file_name, type) ';
        sql += 'values(?,?,?,?,?,?,?,?,?,?);';
    db.query(sql,
        [title, author, content, 0 , new Date(), new Date(), menu_id, author_id, file_name, type],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改文章个人信息
exports.updateArticle = function (id, title, author, content, status, menu_id, file_name, type, callback) {
    var sql = 'update article set title=?,author=?,content=?';
    var params = [];
    params.push(title);
    params.push(author);
    params.push(content);
    if (status != -1) {
        sql += ',status = ? ';
        params.push(status);
    }
    sql += ',update_time = ? ';
    params.push(new Date());
    sql += ',menu_id = ? ';
    params.push(menu_id);
    sql += ',file_name = ? ';
    params.push(file_name);
    sql += ',type = ? ';
    params.push(type);
    sql += ' where id = ?;';
    params.push(id);


    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(err);
        }
    });
};


exports.getArticleByMenu = function (menu_id, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
    var params = [];
    sql += ' and status = 1 ';
    sql += ' and menu_id in ('+ menu_id +') ';
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.getArticleByMenuTotalCount = function (menu_id, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    sql += ' and status = 1 ';
    sql += ' and menu_id in ('+ menu_id +') ;';
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};

