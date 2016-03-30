var JPush = require("jpush-sdk");
var config = require("../config");
var logger = require('../lib/log.js').logger('jpushUtils');

var client = JPush.buildClient(config.jpush.AppKey, config.jpush.MasterSecret);

//推送系统福利
exports.pushAlbum = function (albumId, callback) {
    var rand = randomNumber();
    logger.info("推送系统福利开始，请求编号：", rand);
    if (!albumId) {
        logger.error("要推送的消息为空");
        return;
    }

    var msg = {
        albumId: albumId
    };

    client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.tag(config.jpush.systemAlbum))
        .setNotification('Hi, 新福利到！', JPush.ios(' ', 'happy', 1), JPush.android(' ', null, 1))
        .setMessage(JSON.stringify(msg))
        .send(function (err, res) {
            if (err) {
                logger.error("推送福利错误，请求编号:", rand, err);
            } else {
                logger.info("推送福利成功，请求编号:", rand, 'Sendno: ', res.sendno);
                logger.info("推送福利成功，请求编号:", rand, 'Msg_id: ', res.msg_id);
            }
            logger.info("推送系统福利结束，请求编号：", rand);
            callback && callback(err, res);
        });
};


function randomNumber(size) {
    size = size || 6;
    var code_string = '0123456789';
    var max_num = code_string.length + 1;
    var new_num = '';
    while (size > 0) {
        new_num += code_string.charAt(Math.floor(Math.random() * max_num));
        size--;
    }
    return new_num;
}

//exports.pushAlbum(1);