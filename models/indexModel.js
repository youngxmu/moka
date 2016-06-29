var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("indexModel");
var commonUtils = require("../lib/utils.js");

exports.queryInfoById = function (mid, callback) {
    var sql = 'select * from index_info where index_mid = ?; ';
    var params = [mid];
    db.query(sql, params, callback);
};

exports.updateInfo = function (mid, content, callback) {
    db.query("update index_info set content = ? where index_mid = ?;",
        [content, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.queryUpById = function (mid, callback) {
    var sql = 'select * from resource where id in (select aid from index_data where mid = ?); ';
    var params = [mid];
    db.query(sql, params, callback);
};

exports.updateUp = function (mid, aid, callback) {
    db.query("update index_data set aid = ? where index_mid = ?;",
        [content, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};
