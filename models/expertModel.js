var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("expertModel");
var commonUtils = require("../lib/utils.js");


exports.queryExperts = function (name, start, pageSize, callback) {
    var sql = 'select * from expert where status = 1 ';
    var params = [];
    if (name && name != '') {
        sql += ' and name like \'%' + name + '%\' ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找专家总数
exports.queryExpertTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from expert where status = 1 ';
    var params = [];
     if (name && name != '') {
        sql += ' and name like \'%' + name + '%\' ';
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找专家总数出错", err);
            callback(0);
        }
    });
};


//根据id获取专家
exports.getExpertById = function (expertId, callback) {
    db.query("select * from expert where id = ?;", [expertId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.insertExpert = function (name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type,callback) {
    var sql = 'insert into expert ( ';
    sql += 'name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type,create_time) ';
    sql += 'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    db.query(sql,
        [name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改专家个人信息
exports.updateExpert = function (id, name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type, callback) {
    var sql = 'update expert set update_time = ?';
    var params = [];
    params.push(new Date());
    if(name){
    	sql += ', name = ? ';
    	params.push(name);
    }
    if(gender){
    	sql += ', gender = ? ';
    	params.push(gender);
    }
    if(birthday){
    	sql += ', birthday = ? ';
    	params.push(birthday);
    }
    if(title){
    	sql += ', title = ? ';
    	params.push(title);
    }
     if(unit){
        sql += ', unit = ? ';
        params.push(unit);
    }
    if(address){
        sql += ', address = ? ';
        params.push(address);
    }
    if(tel){
        sql += ', tel = ? ';
        params.push(tel);
    }

    if(avatar){
        sql += ', avatar = ? ';
        params.push(avatar);
    }
    if(description){
        sql += ', description = ? ';
        params.push(description);
    }
    if(topic){
    	sql += ', topic = ? ';
    	params.push(topic);
    }
    if(video){
        sql += ', video = ? ';
        params.push(video);
    }
    if(poster){
        sql += ', poster = ? ';
        params.push(poster);
    }
    if(job_type){
        sql += ', job_type = ? ';
        params.push(job_type);
    }
   
    
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改专家出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


//编辑、修改专家个人信息
exports.delExpert = function (id, callback) {
    var sql = 'update expert set status = 0';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改专家出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


