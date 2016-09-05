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
    res.render('user/exam/list');
});

//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect('user/exam/login');
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
                            msg: "根据id查询试卷出错"
                        });
                    }
                    if(userexams.length == 0 ){
                        examModel.insertUserExam(user.id, id, function(err){
                            if(err){
                                return res.render('error', {
                                    success: false,
                                    msg: "根据id查询试卷出错"
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
                        if(limit <= 0){
                            exam.isover = true;
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


router.get('/exam/:id', function (req, res, next) {
    var id = req.params.id;
    var startTime = new Date().getTime();
    var rid = 'exam' +'_'+ req.session.user.id + '_' + id;
    redisUtils.get(rid, function(err,reply){
        if(err){
            res.render('error',{
                success: false,
                msg: "根据id查询试卷出错"
            });
        }else{
            if(reply){
                startTime = reply;
                var currTime = new Date().getTime();
                var time = 45 * 60 * 1000;
                var offset = time - (currTime - startTime);
                
                if(time < 0){
                    return res.render('msg',{
                        success: false,
                        msg: "已经参加过考试啦"
                    });
                }
                
                console.log(offset);
                req.session.user.startTime = startTime;
                req.session.user.examid = id;
                examModel.getExamById(id, function (err, result) {
                    if (!err && result) {
                        var exam = result;
                        questionModel.queryQuestionsByIds(exam.qids, function(err, result){
                            if(err){
                                res.render('error',{
                                    success: false,
                                    msg: "根据id查询试卷出错"
                                });
                            }else{
                                exam.questions = result;
                                exam.offset = offset;
                                res.render('user/exam/exam',exam);
                            }
                        });
                    } else {
                        res.render('error',{
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }
                });
            }else{
                var currTime = new Date().getTime();
                var time = 45 * 60 * 1000;
                var offset = time - (currTime - startTime);
                
                if(time < 0){
                    return res.render('msg',{
                        success: false,
                        msg: "已经参加过考试啦"
                    });
                }
                console.log(offset);
                redisUtils.set(rid, startTime, function(){
                    req.session.user.startTime = startTime;
                    req.session.user.examid = id;
                    examModel.getExamById(id, function (err, result) {
                        if (!err && result) {
                            var exam = result;
                            questionModel.queryQuestionsByIds(exam.qids, function(err, result){
                                if(err){
                                    res.render('error',{
                                        success: false,
                                        msg: "根据id查询试卷出错"
                                    });
                                }else{
                                    exam.questions = result;
                                    exam.offset = offset;
                                    res.render('user/exam/exam',exam);
                                }
                            });
                        } else {
                            res.render('error',{
                                success: false,
                                msg: "根据id查询试卷出错"
                            });
                        }
                    });
                });
            }
        }

    });
});

router.get('/history/list', function (req, res, next) {
    res.render('user/exam/history-list');
});

//根据试卷id查询
router.get('/history/detail/:id', function (req, res, next) {
    var id = req.params.id;
    examModel.getExamHistoryById(id, function (err, result) {
        if (!err && result) {
            var exam = result;
            res.render('user/exam/history-detail', exam);
        } else {
            res.render('error', {
                success: false,
                msg: "根据id查询试卷出错"
            });
        }
    });
});


router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    examModel.queryExamTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
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
    var isAdmin = req.session.user ? true : false;
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


//创建试卷
router.post('/commit', function (req, res) {
    var pid = req.body.id;
    var answer = req.body.answer;
    var user = req.session.user;
    console.log(user);
    var uid = user.id;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(pid == null || pid == undefined){
        res.json({
            success: false,
            msg: "答题失败"
        });
    }else{
        if(req.session && req.session.user && req.session.user.examid){
            var examid = req.session.user.examid;
            var startTime = req.session.user.startTime;
            var currTime = new Date().getTime();
            var offset = currTime - startTime;
            var time = 45 * 60 * 1000;
            if(examid == pid && offset > time){
                return res.json({
                    success: false,
                    msg: "考试已结束"
                });
            }
        }
        examModel.insertExamHistory(uid, pid, answer, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "提交成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "提交失败"
                });
            }
        });
        
    }
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

