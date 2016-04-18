var express = require('express');
var articleModel = require('../models/articleModel.js');
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");
var logger = require("../lib/log.js").logger("articleRouter");
var config = require("../config");
var router = express.Router();


var menu = {
    m_1 : {
        name : '中心介绍',
        submenu : {

        }
    },
    m_2 : {
        name : '',
        submenu : {

        }
    },
    m_3 : {
        name : '中心介绍',
        submenu : {

        }
    },
    m_4 : {
        name : '数字资源',
        submenu : {
            m_4_1 : {
                name : '国防理论'
            },
            m_4_2 : {
                name : '国防知识'
            },
            m_4_3 : {
                name : '国防历史'
            },
            m_4_4 : {
                name : '国防法规'
            },
            m_4_5 : {
                name : '国防形势'
            },
            m_4_6 : {
                name : '国防技能'
            },
            m_4_7 : {
                name : '外军知识'
            },
            m_4_8 : {
                name : '武器装备'
            },
            m_4_9 : {
                name : '图片视频'
            }
        }
    },
    m_5 : {
        name : '中心介绍',
        submenu : {

        }
    }
};

router.get('/list', function(req, res, next) {
    var id = req.params.id;
    res.render('article/list');
});


router.get('/list/:mid', function(req, res, next) {
    var mid = req.params.mid;
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    var submenu = menu.submenu;
    var submenuList = [];
    if(submenu && submenu.length > 0){
        for(var index in submenu){
            var sid = submenu[index];
            var midmenu = menuMap[sid];
            submenuList.push(midmenu);
        }
    }
    res.render('article/list2', {
        mid : mid,
        submenuList : submenuList
    });
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    articleModel.getArticleTotalCount(status, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryModelList(isVirtual, createFrom, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].im_passwd;
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
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


//根据文章id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询文章出错"
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                res.render('article/detail', article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询文章出错"
                });
            }
        });
    }
});

//创建文章
router.post('/save', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    var fileName = '';//明文
    var type = 1;//resource

    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    

    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, mid, user.id, fileName, type, function (err, data) {
            if (!err) {
                console.log(data);
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
        logger.info("管理员修改文章信息", id);
        articleModel.updateArticle(id, title, author, content, -1, mid,  user.id, fileName, type, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改文章信息成功"
                });
            } else {
                logger.error("修改文章个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改文章个人信息失败"
                });
            }
        });
    }
    
});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

    var menuList = [];
    if(menuPath != null && menuPath != ''){
        var menuMap = menuUtils.getMenuMap();
        var menuArr = menuPath.split(',');
        var lastIndex = menuArr.length - 1;
        console.log(menuArr);
        for(var i=lastIndex;i>=0;i--){
            var menu = menuMap[menuArr[i]];
            menuList.push(menu);
        }
    }
    if(id == null || id == undefined){
        res.render('article/edit', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.menuList = menuList;
                res.render('article/edit', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询文章出错"
                });
            }
        });
    }
});


//根据文章姓名模糊查询
router.post('/queryArticleByTitle', function (req, res, next) {
    var title = req.body.title;
    articleModel.queryArticleByTitle(title, function (err, result) {
        if (!err) {
            for (var i in result) {
                delete result[i].passwd;
                result[i].create_time = new Date(result[i].create_time).getTime();
            }
            res.json({
                success: true,
                data: {
                    list: result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "根据标题查询文章出错"
            });
        }
    })
});


//根据文章姓名模糊查询
router.post('/queryArticleByMenu', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(!menu){
        return res.json({
            success: false,
            msg: "查找文章出错"
        });
    }

    var mids = [];
    mids.push(mid);
    for(var index in menu.submenu){
        var subId = menu.submenu[index];
        mids.push(subId);
        smenu = menuMap[subId];
        mids = mids.concat(smenu.submenu);
    }
    mid = mids.join(',');
    articleModel.getArticleByMenuTotalCount(mid, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.getArticleByMenu(mid, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                 for (var i in result) {
                    var date = new Date(result[i].create_time);
                    result[i].create_time = commonUtils.formatDate(date);
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
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



router.get('/uneval', function(req, res, next) {
    var id = req.params.id;
    res.render('article/uneval');
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/uneval', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(!menu){
        mid = null;
    }else{
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }
    
    var status = 0;
    articleModel.queryArticleTotalCount(status, mid, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryArticles(status, mid, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time));
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
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

module.exports = router;

