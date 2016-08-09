(function(P){
	var _this = null;
	_this = P.user.jsjn.index = {
		tpl : {},
		init : function(){
			_this['xxrj'].init();
			_this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.initEvent();
			_this.initMenu();
		},
		initEvent : function(){
			$('body').on('click', '#menu_bar.res-menu li', _this.onSelMenu);
			$('body').on('click', '#menu_content .main-menu-list li', _this.onSelMenuList);
		},
		initMenu : function(){
			var menuList = nc.menu;
			var html = _this.tpl.menuTpl.render({list: menuList});
			$('#menu_bar').html(html);
		},
		onSelMenu : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var menu = nc.menu[menuIndex];
			var html = _this.tpl.menuContentTpl.render(menu.content);
			$('#menu_content').html(html);
		},
		onSelMenuList : function(){
			var $this = $(this);
			var sysType = $this.attr('data-type');
			console.log(sysType);
			var subIndex = $this.attr('data-index');
			_this[sysType].show(subIndex);
		},
		getImgStyle : function(defaultImg){
			console.log(defaultImg);
			var tail = defaultImg.split('[')[1];
			var size = tail.split('x');
			var width = size[0];
			var height = size[1];
			return 'height:' + height + ';width:'+ width +';';
		}

	};
	juicer.register('getImgStyle', _this.getImgStyle);
})(moka);

(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj = {
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.menu = nc.xxrj.menu;
			_this.initEvent();
			_this.detail.init();
		},
		initEvent : function(){
			$('body').on('click', '#sub_sys .res-menu li', _this.onSelMenu);
			$('body').on('click', '#sub_menu_content .main-menu-list li', _this.onSelMenuList);
		},
		show : function(mindex){
			_this.initMenu();
			$('#sub_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			var html = _this.tpl.menuTpl.render({list: menuList});
			$('#sub_menu_bar').html(html);
		},
		onSelMenu : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var menu = _this.menu[menuIndex];
			var html = _this.tpl.menuContentTpl.render(menu.content);
			$('#sub_menu_content').html(html);
		},
		onSelMenuList : function(){
			var $this = $(this);
			var sysType = $this.attr('data-type');
			var subIndex = $this.attr('data-index');
			_this.detail.show(subIndex);
		}
	};
})(moka);

(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj.detail = {
		tpl : {},
		init : function(){
			// _this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuTpl = juicer($('#detail-menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('body').on('click', '#detail_sys .res-menu li', _this.onSelMenu);
		},
		show : function(index){
			var cindex = 'c' + (index + 1);
			_this.menu = nc.xxrj[cindex].menu;
			_this.initMenu();
			$('#detail_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			var html = _this.tpl.menuTpl.render( _this.menu);
			$('#detail_menu_bar').html(html);
		},
		onSelMenu : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var jie = _this.menu.jie[menuIndex];
			console.log(jie);
			var html = _this.tpl.menuContentTpl.render(jie);
			$('#detail_menu_content').html(html);
		}
	};
})(moka);

moka.user.jsjn.index.xxrj.detail.init();
moka.user.jsjn.index.xxrj.detail.show(0);
