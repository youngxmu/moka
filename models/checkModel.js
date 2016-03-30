/**
 * 模特审核管理
 */
var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("modelModel");
var commonUtils = require("../lib/utils.js");
var easemobUtils = require("../lib/easemobUtils.js");


/**
 * 审核模特：更改model表status字段，在审核记录表check_history中添加一条审核记录
 *
 * @param adminId 管理员id
 * @param modelId 审核的模特id
 * @param status 审核记录：-1：禁用，0：未审核，1：已审核通过，2：审核拒绝
 * @param description 本次审核的文字描述，比如拒绝理由
 * @param callback
 */
exports.checkModel = function (adminId, modelId, status, description, callback) {
    logger.info("审核模特", adminId, modelId, status, description);
    db.query("update model set status = ? where id=?", [status, modelId], function (err, result) {
        logger.info("审核模特时更新模特状态结果",err, result);
        if (!err && result && result.affectedRows && result.affectedRows>=1) {//修改模特状态成功
            db.query("insert into check_history(admin_id,model_id,status,description, create_time) values(?,?,?,?,?)",
                [adminId, modelId, status, description, new Date()], function (err, result) {
                    callback && callback(err, result);
                });
        } else {
            callback && callback(err, result);
        }
    });
};

/**
 * 查询模特审核历史
 * @param modelId
 * @param callback
 */
exports.history = function (modelId, callback) {
    logger.info("查询模特审核历史", modelId);
    db.query("select * from check_history where model_id=?", [ modelId], callback);
};
