var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("menuModel");


exports.queryAllMenu = function (callback) {
    var sql = 'select * from menu;';
    var params = [];
    db.query(sql, params, callback);
};


exports.addMenu = function (name, parentId, level, callback) {
    if (!parentId) {
        parentId = 0;
    }

    if (!level) {
        level = 0;
    }

    db.query("insert into menu (name, parentId, level) values(?,?,?);",
        [name, parentId, level],
        function (err, result) {
            callback(err, result);
        }
    );
};


