var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("menuModel");


exports.queryAllMenu = function (callback) {
    var sql = 'select * from menu where status = 1;';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryAllMenuByIds = function (pid, callback) {
    var sql = 'select * from menu where status = 1 and parent_id in ('+ pid +');';
    var params = [];
    db.query(sql, params, callback);
};


exports.addMenu = function (name, parent_id, mlevel, callback) {
    if (!parent_id) {
        parent_id = 0;
    }

    if (!mlevel) {
        mlevel = 0;
    }

    db.query("insert into menu (name, parent_id, mlevel) values(?,?,?);",
        [name, parent_id, mlevel],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.updateMenu = function (id, name, callback) {
    db.query("update menu set name = ? where id = ?;",
        [name, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.delMenu = function (id, callback) {
    db.query("update menu set status = 0 where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};



