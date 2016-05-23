var db = require('../lib/db.js');

//查找管理员
exports.query=function(username, passwd, callback){
	db.query("select * from admin where name = ? and password = ?;", [username, passwd], callback);
};
