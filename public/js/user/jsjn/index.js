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
			$('body #main_sys').on('click', '#menu_bar.res-menu li', _this.onSelMenu);
			$('body #main_sys').on('click', '#menu_content .main-menu-list li', _this.onSelMenuList);
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
			// console.log(sysType);
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
			$('body #sub_sys').on('click', ' .res-menu li', _this.onSelMenu);
			$('body #sub_sys').on('click', '#sub_menu_content .main-menu-list li', _this.onSelMenuList);
			$('body #sub_sys').on('click', ' .sub-exit', _this.exit);
			$('body #sub_sys').on('click', ' .sub-back', _this.back);
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
			console.log(menu);
			var html = _this.tpl.menuContentTpl.render(menu.content);
			$('#sub_menu_content').html(html);
		},
		onSelMenuList : function(){
			var $this = $(this);
			var sysType = $this.attr('data-type');
			var subIndex = $this.attr('data-index');
			console.log(sysType);
			_this.detail.show(subIndex);
		},
		back : function(){
			// $('#sub_sys').show().siblings('div').hide();
			$('#main_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);

(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj.detail = {
		page : {
			totalCount : 1,
			pageNo : 1
		},
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#detail-menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#detail-content-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('body #detail_sys').on('click', ' .res-menu li', _this.onSelMenu);
			$('body #detail_sys').on('click', ' .detail-page-pre',  _this.pre);
			$('body #detail_sys').on('click', ' .detail-page-next', _this.next);
			$('body #detail_sys').on('click', ' .detail-page-first',  _this.first);
			$('body #detail_sys').on('click', ' .detail-page-last', _this.last);

			$('body #detail_sys').on('click', ' .detail-exit', _this.exit);
			$('body #detail_sys').on('click', ' .detail-back', _this.back);
		},
		show : function(index){
			var cindex = 'c' + (parseInt(index) + 1);
			console.log(cindex);
			_this.menu = nc.xxrj[cindex].menu;
			_this.initMenu();


			var $this = $('#detail_menu_bar').find('li').first();
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var data = _this.menu;
			var jie = _this.menu.jie[menuIndex];
			data.content =  jie.content;
			_this.page.pageNo = 1;
			_this.page.totalCount = data.content.length;
			var html = _this.tpl.menuContentTpl.render(data);
			$('#detail_menu_content').html(html);


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
			var data = _this.menu;
			var jie = _this.menu.jie[menuIndex];
			data.content =  jie.content;
			_this.page.pageNo = 1;
			_this.page.totalCount = data.content.length;
			var html = _this.tpl.menuContentTpl.render(data);
			$('#detail_menu_content').html(html);
		},
		getCurrPage : function(){
			return $('#detail_menu_content').find('.current');
		},
		goPage : function(index){
			var $page = $('#detail_menu_content .content-list .content').eq(index);
			$('#page_no').val(parseInt(index) + 1);
			$page.addClass('current').siblings('li').removeClass('current');
		},
		first : function(){
			_this.goPage(0);
		},
		last : function(){
			_this.goPage(_this.page.totalCount - 1);
		},
		pre : function(){
			var $pre = _this.getCurrPage().prev('.content');
			var index = $pre.attr('data-index');
			if($pre.length == 1){
				_this.goPage(index);
			}
		},
		next : function(){
			var $next = _this.getCurrPage().next('.content');
			var index = $next.attr('data-index');
			if($next.length == 1){
				_this.goPage(index);
			}
		},
		back : function(){
			$('#sub_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);

moka.user.jsjn.index.xxrj.detail.init();
// moka.user.jsjn.index.xxrj.detail.show(0);
