var express = require('express');
var router = express.Router();
var config = require('../config');
var logger =  require('../lib/log.js').logger('uploadRouter');

//var imgPrefix = "http://115.28.47.35:3000/uploads";
//var imgPrefix = "http://localhost:3000/uploads";

//uri: upload/img
router.get('/img', function(req, res) {
	res.render('upload', {});
});

//uri: upload/img
router.post('/img', function(req, res, next) {
	// the uploaded file can be found as `req.files.image` and the
	// title field as `req.body.title` 
	// 

	
	var files = req.files.upload_file;
	console.dir(files);

	//res.send(req.fields.name);
	
	var file = files[0];//?req.files.file[0]:req.files.profile[0];
	res.json({
		success:true,
		msg: "error message", 
		file_path: file.path.replace(config.uploadDir, config.imgHost + '/uploads')
	});
});

// router.post('/img', function(req, res, next) {
// 	if(req.session && req.session.admin){
// 		console.log(req.files);
// 		if(req.files && req.files.file &&req.files.file[0] ){
// 			var file = req.files.file[0];
// 			qiniu.upload(file.path,function(err, result){
// 				if(err){
// 					logger.error("上传到七牛出错",err);
// 					res.json({
// 						success: false,
// 						msg: '上传到图片库失败'
// 					});
// 				}else {

// 					var from_id=0;
// 					try{
// 						from_id=parseInt(req.session.admin.id);
// 					}catch(e){
// 						logger.error("上传文件时parse session里的用户id出错",req.session,e);
// 					}

// 					var params ={
// 						hash:result.hash||"",
// 						key:result.key||"",
// 						url:result.url||"",
// 						from_id:from_id,
// 						filepath:file.path||"",
// 						origin_file_name:file.originalFilename||"",
// 						origin_file_size:(file.size||"0")+""
// 					};
// 					uploadFileModel.createUploadFile(params,function(err,reply){});

// 					res.json({
// 						success:true,
// 						msg:'上传成功',
// 						data:{
// 							oriName:file.originalFilename,
// 							size:file.size/1024+"k",
// 							//path: file.path,
// 							//url: imgPrefix+file.path.replace(config.uploadDir,'')
// 							url:result.url,
// 							name: result.key
// 						}
// 					});

// 				}
// 			});
// 		}
// 		else {
// 			res.json({
// 				success: false,
// 				msg: '上传失败'
// 			});
// 		}
// 	}else{
// 		res.json({
// 			success: false,
// 			msg: '未登录，不允许上传'
// 		});
// 	}
// });

module.exports = router;