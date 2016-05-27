var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("infoModel");
var commonUtils = require("../lib/utils.js");


exports.queryInfos = function (callback) {
    var sql = 'select * from info; ';
    var params = [];
    db.query(sql, params, callback);
};


exports.queryInfoById = function (id, callback) {
    var sql = 'select * from info where id = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};