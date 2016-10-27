var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("jsllModel");
var commonUtils = require("../lib/utils.js");


exports.queryIndexInfos = function (callback) {
    var sql = 'select * from jsllxx where content != 0 limit 10; ';
    var params = [];
    db.query(sql, params, callback);
};



exports.queryInfoById = function (id, callback) {
    var sql = 'select * from jsllxx where id = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};

exports.queryInfos = function (callback) {
    var sql = 'select id,title from jsllxx; ';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryInfosByType = function (type, callback) {
    var sql = 'select * from jsllxx where type = ?; ';
    var params = [type];
    db.query(sql, params, callback);
};



exports.addInfo = function (name, content, parent_id, mlevel, callback) {
    if (!parent_id) {
        parent_id = 0;
    }

    if (!mlevel) {
        mlevel = 0;
    }

    db.query("insert into jsllxx (title, content) values(?,?);",
        [title, content],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.updateInfo = function (id, title, content, callback) {
    //title = ?, 
    console.log('updatejsllxx'+ id);
    db.query("update jsllxx set content = ? where id = ?;",
        [ content, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.delInfo = function (id, callback) {
    db.query("delete from jsllxx where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};