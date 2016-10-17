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

exports.queryUpByIds = function (ids, callback) {
    var sql = 'select * from resource where id in (' + ids + '); ';
    var params = [];
    db.query(sql, params, callback);
};

// exports.getUp = function (mid, callback) {
//     db.query("select * from index_data where mid = ?;",
//         [mid],
//         function (err, result) {
//             callback(err, result);
//         }
//     );
// };

exports.getUp = function (moduleId, callback) {
    db.query("select * from index_module where id = ?;", [moduleId], function (err, result) {
            callback(err, result);
        }
    );
};

exports.updateUp = function (mid, aid, callback) {
    db.query("update index_data set aid = ? where mid = ?;",
        [aid, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.queryModules = function (callback) {
    var sql = 'select * from index_module;';
    var params = [];
    db.query(sql, params, callback);
};

exports.updateModule = function (id, keywords, callback) {
    db.query("update index_module set keywords = ? where id = ?;",
        [keywords, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

