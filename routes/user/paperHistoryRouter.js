var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("paperRouter");

var paperModel = require('../../models/paperModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('user/paperhistory/list');
});


//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/list', function (req, res, next) {
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



    paperModel.queryPaperHistoryTotalCount(uid, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        paperModel.queryPaperHistorys(uid, start, pageSize, function (err, result) {
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
      paperModel.getPaperHistoryById(id, function (err, result) {
          if (!err && result) {
              var history = result;
              paperModel.getPaperById(history.pid, function (err, result) {
                if (!err && result) {
                    var paper = result;
                    questionModel.queryQuestionsByIds(paper.qids, function(err, result){
                        if(err){
                            res.json({
                                success: false,
                                msg: "根据id查询试卷出错"
                            });
                        }else{
                            paper.questions = result;
                            console.log(history);
                            var uAnswerArr = history.answer.split(',');

                            for(var index in paper.questions){
                              paper.questions[index].uanswer = uAnswerArr[index];
                            }
                            res.json({
                                success: true,
                                paper : paper
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



//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;

        console.log(id);
        paperModel.getPaperHistoryById(id, function (err, result) {
            if (!err && result) {
                var paper = result;
                res.render('user/paperhistory/detail', paper);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
});

module.exports = router;

