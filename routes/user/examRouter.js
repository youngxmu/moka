var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var redisUtils = require("../../lib/redisUtils.js");
var logger = require("../../lib/log.js").logger("examRouter");

var examModel = require('../../models/examModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/exam/index');
});


router.get('login', function (req, res, next) {
    res.render('user/exam/login');
});

router.get('/index', function (req, res, next) {
    res.render('user/exam/index');
});

router.get('/list', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/index');
    }
    res.render('user/exam/list');
});

//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/index');
    }
    var user = req.session.user;
    var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        examModel.getExamById(id, function (err, result) {
            if (!err && result) {
                var exam = result;
                examModel.queryUserExam(user.id, id, function(err, userexams){
                    if(err){
                        return res.render('error', {
                            success: false,
                            msg: "网络异常，刷新重试"
                        });
                    }
                    if(userexams.length == 0 ){
                        examModel.insertUserExam(user.id, id, function(err){
                            if(err){
                                return res.render('error', {
                                    success: false,
                                    msg: "网络异常，刷新重试"
                                });
                            }else{
                                exam.limit = 60 * 60;        
                                return res.render('user/exam/detail', exam);
                            }
                        });
                    }else{
                        var userexam = userexams[0];
                        var startTime = userexam.start_time;
                        var limit = 60 * 60 - (new Date().getTime() - startTime.getTime()) / 1000;
                        exam.limit = limit;
                        console.log(userexam.status);
                        if(limit <= 0 || userexam.status == 2){
                            exam.isover = true;
                            examModel.updateUserExamStatus(user.id, id, function(err, result){
                                if(err){
                                    return res.render('error', {
                                        success: false,
                                        msg: "网络异常"
                                    });
                                }else{
                                    return res.redirect(config.redirectPath + 'exam/history/list');
                                }
                            });
                        }else{
                            return res.render('user/exam/detail', exam);    
                        }
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

router.post('/list', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.json({success:false,msg:'未登录'});
    }
    var user = req.session.user;
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    examModel.queryUserExams(user.id, function(err, uexams){
        if (err) {
            return res.json({
                success: false,
                msg: "查找试卷出错"
            });
        }
        var uexamMap = {};
        for(var index in uexams){
            var uexam = uexams[index];
            uexamMap[uexam.id] = uexam;
        }

        examModel.queryExamTotalCount(name, function (totalCount) {
            var totalPage = 0;
            if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
            else totalPage = totalCount / pageSize + 1;
            totalPage = parseInt(totalPage, 10);
            var start = pageSize * (pageNo - 1);
            examModel.queryExams(name, start, pageSize, function (err, result) {
                if (err || !result || !commonUtils.isArray(result)) {
                    res.json({
                        success: false,
                        msg: "查找试卷出错"
                    });
                } else {
                    for(var i in result){
                        var examId = result[i].id;
                        var status = 0;//用户试卷关系0:未参加，1:正在进行,2:已交卷
                        if(uexamMap[examId]){
                            status = uexamMap[examId].status;
                        }
                        result[i].uestatus = status;
                    }
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
});

router.post('/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.json({success:false,msg:'未登录'});
    }
    var id = req.params.id;
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
                        var answerArr = [];
                        for(var index in result){
                            var question = result[index];
                            answerArr.push(question.rtanswer+'_'+question.type);
                            delete result[index].rtanswer;
                        }
                        req.session.user.rtAnswers = answerArr.join(',');
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


//创建试卷
router.post('/commit', function (req, res) {
    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }

    var id = req.body.id;
    var answer = req.body.answer;
    var uid = user.id;
    
    if(id == null || id == undefined){
        return res.json({
            success: false,
            msg: "异常参数"
        });
    }
    examModel.queryUserExam(user.id, id, function(err, userexams){
        if(err || userexams.length == 0){
            return res.render('error', {
                success: false,
                msg: "异常，请刷新页面重试"
            });
        }
        
        var userexam = userexams[0];
        var startTime = userexam.start_time;
        var limit = 60 * 60 - (new Date().getTime() - startTime.getTime()) / 1000;
        if(userexam.status == 2){
            return res.json({
                success: false,
                msg: "考试已结束"
            });
        }
        var answerArr = req.session.user.rtAnswers.split(',');
        var userAnswer = answer.split(',');
        var score = 0;
        for(var index in answerArr){
            var strs = answerArr[index].split('_');
            if(strs[0] == userAnswer[index]){
                if(strs[1] == 2){
                    score+=1;
                }else{
                    score+=2;
                }
            }
        }
        examModel.insertExamHistory(uid, id, answer, score, function (err, data) {
            if (!err) {
                logger.error('insertExamHistory', err);
                examModel.updateUserExamStatus(user.id, id, function(err, result){
                    if(err){
                        return res.json({
                            success: false,
                            msg: "提交失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "提交成功",
                        data : data
                    });
                });
                
            } else {
                res.json({
                    success: false,
                    msg: "提交失败"
                });
            }
        });
    });
});


router.get('/history/list', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/index');
    }
    res.render('user/exam/history-list');
});


router.get('/uhistory/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/index');
    }
    var user = req.session.user;
    var id = req.params.id;
    examModel.getExamHistoryByUidEid(user.id, id, function (err, result) {
        if (!err && result) {
            var exam = result;
            res.render('user/exam/history-detail', exam);
        }else {
            logger.error('getExamHistoryByUidEid', err);
            res.render('error', {
                success: false,
                msg: "根据id查询试卷出错"
            });
        }
    });
});

//根据试卷id查询
router.get('/history/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/index');
    }
    var id = req.params.id;
    examModel.getExamHistoryById(id, function (err, result) {
        logger.error('getExamHistoryById', err);
        if (!err && result) {
            var exam = result;
            res.render('user/exam/history-detail', exam);
        }else {
            logger.error('getExamHistoryById', err);
            res.render('error', {
                success: false,
                msg: "根据id查询试卷出错"
            });
        }
    });
});

//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/history/list', function (req, res, next) {
    var user = req.session.user;
    var uid = user.id;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }

    var title = parseInt(req.body.keyword);
    if(!title || title == 'undefined'){
        title = '';
    }
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);



    examModel.queryExamHistoryTotalCount(uid, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        examModel.queryExamHistorys(uid, start, pageSize, function (err, result) {
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

router.post('/history/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }

     var id = req.params.id;
    examModel.getExamHistoryById(id, function (err, result) {
          if (!err && result) {
              var history = result;
              examModel.getExamById(history.pid, function (err, result) {
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
                            console.log(history);
                            var uAnswerArr = history.answer.split(',');

                            for(var index in exam.questions){
                              exam.questions[index].uanswer = uAnswerArr[index];
                            }
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

          } else {
              res.json({
                  success: false,
                  msg: "根据id查询试卷出错"
              });
          }
      });
});



module.exports = router;

