var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var infoModel = require("../../models/infoModel.js");
var Buffer = require('buffer').Buffer;
var router = express.Router();

router.get('/list', function (req, res, next) {
    res.render('user/jsll/list');
});

router.post('/list', function (req, res, next) {
	var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    // if(id == null || id == undefined){
    //     res.json({
    //         success: false,
    //         msg: "根据id查询文章出错"
    //     });
    // }else{
        infoModel.queryInfos(function (err, result) {
            if (!err && result) {
                 for(var index in result){
                    // console.log(result[index].content.length);
                    
                    if(!result[index].content){
                        continue;
                    }

                    var length = result[index].content.length;
                    console.log(length);
                    var buf = new Buffer(length);
                    for(var i = 0; i < length; i++) {
                        buf[i] = result[index].content[i];
                    }
                    // // var buffer = new Buffer( result[index].content, 'binary' );
                    var bufferBase64 = buf.toString('base64');
                    result[index].content = bufferBase64;
                    if(index == 0){
                        console.log(bufferBase64);
                    }
                }
                res.json({
                    success: false,
                    data: {
                        list : result
                    }
                });
            } else {


                res.json({
                    success: false,
                    msg: "根据id查询文章出错"
                });
            }
        });
    // }
});


module.exports = router;

