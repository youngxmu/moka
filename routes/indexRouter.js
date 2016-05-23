var express = require('express');
var config = require("../config");
var logger = require("../lib/log.js").logger("indexRouter");

var articleModel = require('../models/articleModel.js');
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");

var router = express.Router();

router.get('', function (req, res, next) {
    var menuMap = menuUtils.getMenuMap();
    var menuList = [
        {
            id : 11,
            name : '教育资源',
            url : '/resource/list'
        },
        {
            id : 12,
            name : '教育测评',
            url : '/paper/list'
        },
        {
            id : 13,
            name : '理论教学',
            url : '/jsll/list'
        },
        {
            id : 14,
            name : '技能教学',
            url : '/jsjn/list'
        },
        {
            id : 15,
            name : '理论试题',
            url : '/exam/list'
        },
        {
            id : 16,
            name : '后备力量',
            url : '/store/list'
        }
    ];

    // for(var mid in menuMap){
    // 	var menu = menuMap[mid];
    // 	if(menu.mlevel == 1){
    // 		menuList.push(menu);
    // 	}
    // }
    var islogin = false;
    if(req.session.user && req.session.user){
        islogin = true;
    }
    res.render('index', {
        islogin : islogin,
    	menuList : menuList
    });
});


//根据文章姓名模糊查询
router.post('/queryArticleByMenu', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = 1;
    var pageSize = 5;
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(menu){
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }else{
        mid = '';
    }
    articleModel.getArticleByMenu(mid, 0, 5, function (err, result) {
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
                    list: result
                }
            });
        }
    });
});

module.exports = router;

