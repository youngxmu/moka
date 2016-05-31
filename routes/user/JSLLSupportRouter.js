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
                //  for(var index in result){
                //     // console.log(result[index].content.length);
                    
                //     if(!result[index].content){
                //         continue;
                //     }

                //     var length = result[index].content.length;
                //     console.log(length);
                //     var buf = new Buffer(length);
                //     for(var i = 0; i < length; i++) {
                //         buf[i] = result[index].content[i];
                //     }
                //     // // var buffer = new Buffer( result[index].content, 'binary' );
                //     var bufferBase64 = buf.toString('base64');
                //     result[index].content = bufferBase64;
                //     if(index == 0){
                //         console.log(bufferBase64);
                //     }
                // }
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

var textract = require('textract');
var unrtf = require('unrtf');
router.get('/info', function (req, res, next) {
    var id = req.query.id;
     infoModel.queryInfoById(id, function (err, result) {
        if (!err && result) {
            var index = 0;
            var file = result[index].content;  
               // var reader = new FileReader();  
               // reader.onload = function()  
               // {  
               //     document.getElementById("filecontent").innerHTML = this.result;  
               // };  
               // reader.readAsText(file);  


            // var length = result[index].content.length;
            // console.log(result[index]);
            // console.log(length)
            textract.fromBufferWithMime('RTF', result[index].content, function( error, text ) {
                console.log(error);
                res.json({
                    success: false,
                    info : text
                });
            });



            
            unrtf(
              file,
              function(error, result) {
                console.log(error);
              }
            );


            // console.log(result);
            // console.log(length);
            // console.log(encodeURIComponent_GBK(result[index].content));
            // // var buf = new Buffer(length);
            // // for(var i = 0; i < length; i++) {
            // //     buf[i] = result[index].content[i];
            // // }
            // // var buf = new Buffer( result[index].content, 'binary' );
            // // var bufferBase64 = buf.toString('utf-8');
            // // result[index].content = bufferBase64;
            // // console.log(bufferBase64);
            // var str = result[index].content.toString('base64',0 , length);
            // console.log(str);
            // result[index].content = str;
            // res.json({
            //     success: false,
            //     info : result[0]
            // });
        } else {


            res.json({
                success: false,
                msg: "根据id查询文章出错"
            });
        }
    });
});

module.exports = router;

