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
		},
		initEvent : function(){
			$('body').on('click', '#sub_sys .res-menu li', _this.onSelMenu);
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
		}
	};
})(moka);