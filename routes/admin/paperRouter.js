var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("examRouter");

var examModel = require('../../models/examModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/paper/list');
});


//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    examModel.queryExamTotalCount(name, function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        examModel.queryExams(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找试卷出错", err);
                res.json({
                    success: false,
                    msg: "查找试卷出错"
                });
            } else {
                res.json({
                    success: true,
                    msg: "查找试卷成功",
                    data: {
                        totalCount: totalCount,
                        totalPage: totalPage,
                        currentPage: pageNo,
                        list: result
                    }
                });
            }
        });
    });
});

router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        examModel.getExamById(id, function (err, result) {
            if (!err && result) {
                var exam = result;
                questionModel.queryQuestionsByIds(exam.qids, function(err, result){
                    if(err){
                        res.json({
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }else{
                        exam.questions = result;
                        res.json({
                            success: true,
                            exam : exam
                        });
                    }
                });
            } else {
                 res.json({
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});



//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        examModel.getExamById(id, function (err, result) {
            if (!err && result) {
                var exam = result;
                exam.isAdmin = isAdmin;
                res.render('admin/paper/detail', exam);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});

//创建试卷
router.post('/save', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var qids = req.body.qids;//明文
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        examModel.insertExam(name, description, qids, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "创建成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        logger.info("管理员修改试卷信息", id);
        examModel.updateExam(id, name, description, qids, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改试卷信息成功"
                });
            } else {
                logger.error("修改试卷个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改试卷个人信息失败"
                });
            }
        });
    }
});

router.post('/del', function (req, res) {
    var id = req.body.id;
    var admin = req.session.admin;
    console.log(admin);
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "删除失败"
        });
    }else{
        logger.info("管理员删除试卷信息", id);
        examModel.delExam(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除试卷信息成功"
                });
            } else {
                logger.error("删除试卷发生错误", err);
                res.json({
                    success: false,
                    msg: "删除试卷失败"
                });
            }
        });
    }
});


var officegen = require('officegen');
var fs = require('fs');
var path = require('path');
var docx = officegen ( 'docx' );
var async = require('async');
var qTypeMap = {
    1 : '填空题',
    2 : '选择题',
    3 : '多项选择题',
    4 : '判断题'
};
var _word = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
var getOption = function(index){
    if(index > 0){
        index = index - 1;
    }
    return _word[index];
};
var getQType = function(qtype){
    var typeName = qTypeMap[qtype];
    if(!typeName){
        typeName = '其它';
    }
    return typeName;
};
router.get('/doc/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(!isAdmin){
        return res.render('error', {
            success: false,
            msg: "没有权限"
        });  
    }
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        examModel.getExamById(id, function (err, result) {
            if (!err && result) {
                var exam = result;
                questionModel.queryQuestionsByIds(exam.qids, function(err, result){
                    if(err){
                        res.json({
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }else{
                        var answerArr = [];
                        var pObj = null;
                        for(var index in result){
                            var question = result[index];
                            var findex = parseInt(index) + 1;
                            pObj = docx.createP();
                            pObj.addText(findex + '.' + question.qbody + '（' + getQType(question.qtype) + '）');
                            var answerArr = question.qanswer.split(',');
                            for(var i in answerArr){
                                var aindex = parseInt(i) + 1;
                                var word = getOption(aindex);
                                pObj = docx.createP();
                                pObj.addText(word + '.' + answerArr[i]);
                            }
                        }
                        var out = fs.createWriteStream ( 'out.docx' );// 文件写入
                        out.on ( 'error', function ( err ) {
                            console.log ( err );
                        });
                        var result = docx.generate (out);// 服务端生成word
                        res.writeHead ( 200, {
                            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                            'Content-disposition': 'attachment; filename=' + exam.name + '.docx'
                        });
                        docx.generate (res);// 客户端导出word
                    }
                });
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});



module.exports = router;

