var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("infoModel");
var commonUtils = require("../lib/utils.js");


exports.queryInfos = function (callback) {
    var sql = 'select * from info; ';
    var params = [];
    db.query(sql, params, callback);
};