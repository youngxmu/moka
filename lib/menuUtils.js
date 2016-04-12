var menuModel = require('../models/menuModel.js');
var commonUtils = require("../lib/utils.js");

var menuList = null;
var menuMap = '';

var getMenuList = function(){
	if(menuList){
		return menuList;
	}else{
		menuModel.queryAllMenu(function (err, result) {
	        if (err || !result || !commonUtils.isArray(result)) {
	            return [];
	        } else {
	        	menuList = result;
	        	return menuList;
	        }
	    });
	}
};

var getMenuMap = function(){
	if(menuMap){
		return menuMap;
	}else{
		menuMap = {};
		for(var index in menuList){
	    	var menu = menuList[index];
	    	menu['submenu'] = [];
	    	menuMap[menu.id] = menu;
    	}

    	for(var key in menuMap){
	    	var menu = menuMap[key];
	    	if(menu.parent_id != 0){
    			menuMap[menu.parent_id]['submenu'].push(key);
	    	}
    	}
    	return menuMap;
	}
};

var refreshMenu = function(){
	menuList = null;
	menuMap = '';
	getMenuList();
};

module.exports.getMenuList = getMenuList;
module.exports.getMenuMap = getMenuMap;
module.exports.refreshMenu = refreshMenu;
