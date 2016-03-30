var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("modelModel");
var commonUtils = require("../lib/utils.js");
var easemobUtils = require("../lib/easemobUtils.js");

//根据“是否虚拟”“创建来源”查找宅男列表
exports.queryUserList = function (isVirtual, createFrom, start, pageSize, callback) {
    db.query("select * from user where is_virtual=? and create_from=? order by create_time desc limit ?,?;",
        [isVirtual, createFrom, start, pageSize], callback);
};

//根据“是否虚拟”“创建来源”查找宅男总数
exports.getUserTotalCount = function (isVirtual, createFrom, callback) {
    db.query("select count(id) as count from user where is_virtual=? and create_from=?",
        [isVirtual, createFrom],
        function (err, result) {
            if (!err && result && result[0]) {
                callback(result[0].count);
            } else {
                logger.error("查找宅男总数出错", err);
                callback(0);
            }
        });
};

//根据id查询宅男
exports.queryUserById = function (userId, callback) {
    db.query("select * from user where id=? limit 1", [userId], callback);
};


//根据昵称模糊查询宅男
exports.queryUserByName = function (nickname, callback) {
    db.query('select * from user where nickname like "%' + nickname + '%" order by create_time desc',
        [], callback);
};

//根据宅男手机精确查询宅男
exports.queryUserByTel = function (tel, callback) {
    db.query("select * from user where tel =?", [tel], callback);
};


//新建宅男，注意这里的参数password应该与手机端的加密方式一样，目前是md5("真实密码","-weimo")
exports.insertUser = function (tel, nickname, password, inviteId, beanCount, isVirtual, profile, callback) {
    if (!inviteId) {
        inviteId = 0;
    }

    var imUser = "u_" + tel;
    //模特以"m_"为环信用户前缀
    var imPasswd = "default_passwd";
    try {
        imPasswd = commonUtils.md5(password, "easemob_salt");//与moka_mobile项目统一这个salt
    } catch (e) {
    }

    db.query("insert into user (tel, nickname, passwd, invite_id, bean_count, is_virtual, create_from, profile, im_user, im_passwd," +
        "create_time) values(?,?,?,?,?,?,?,?,?,?,?);",
        [tel, nickname, password, inviteId, beanCount, isVirtual, 1, profile, imUser, imPasswd, new Date()],
        function (err, result) {
            if (!err) {
                //在环信上注册一个对应用户 start
                easemobUtils.registerUser(imUser, imPasswd);
                //在环信上注册一个对应用户 stop
            }
            callback(err, result);
        });
};

//编辑、修改宅男个人信息
exports.updateUser = function (userId, tel, nickname, password,beanCount, isVirtual, profile, callback) {
    db.query("update user set tel=?,nickname=?,passwd=?,bean_count=?,is_virtual=?, profile=?, update_time=? where id=?",
        [tel, nickname, password, beanCount,isVirtual,profile, new Date(), userId], callback);
}