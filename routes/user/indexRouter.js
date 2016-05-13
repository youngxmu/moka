var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var menuUtils = require("../../lib/menuUtils.js");

var router = express.Router();

router.get('', function (req, res, next) {
    var menuMap = menuUtils.getMenuMap();
    var menuList = [];

    for(var mid in menuMap){
    	var menu = menuMap[mid];
    	if(menu.mlevel == 1){
    		menuList.push(menu);
    	}
    }
    res.render('user/index', {
    	menuList : menuList
    });
});

module.exports = router;

