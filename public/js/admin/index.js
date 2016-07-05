(function(P){
	var _this = null;
	_this = P.admin.index = {
		searchUrl : 'index/list/res',
		pid : 10,//系统根目录编号
		tpl : {
			articleTpl : null,
			resourceTpl : null
		},
		data : {
			userMap : {},
			searchData : {
				pageSize : 15,
				pageNo : 1	
			}
		},
		queryData : {
			pageSize : 5,
			pageNo : 1
		},
		init : function() {
			_this.tpl.newsTpl = juicer($('#news-tpl').html());
			_this.tpl.articleTpl  = juicer($('#article-tpl').html());
			_this.tpl.topListTpl = juicer($('#top-resource-tpl').html());
			_this.tpl.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEditor();
			_this.initEvent();
			_this.showEditor(100101);
		},
		initEvent : function(){
			$('#btn_commit').click(_this.commit);
			$('#btn_modify').click(_this.commitInfo);

			$('.resource-opr').on('click', '.add', _this.showAddRes);
			$('#resource_list').on('click', '.edit', _this.showEditRes);
			$('body').on('click', '.oper .del',_this.showDelRes);
			$('body').on('click', '.nav-tabs li', _this.changeType);

			$('body').on('click', '.res-menu button', function(){
				var $this = $(this);
				$('.res-menu li').removeClass('active');
				$this.addClass('active');
				_this.data.searchData.mid = $this.attr('data-id');
				_this.$topPanel = $('#top_list');
				_this.$panel = $('#resource_list');
				_this.$pagebar = $('#pagebar');
				_this.loadTop();
				_this.loadRes();
				$('#tree_panel').show();
			});

			$('body').on('click', '.btnup', _this.up);
			$('body').on('click', '.btndown', _this.down);
		},
		changeType : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var type = $this.attr('data-type');
			var mid = $this.attr('data-mid');
			_this.data.searchData.mid = mid;
			$('#editor_panel').hide();
			$('#list_panel').hide();
			$('#tree_panel').hide();
			$('#pic_panel').hide();
			if(type == 1 || type == 2 || type == 3 || type == 6){
				_this.showEditor(mid);
				$('#editor_panel').show();
			}
			if(type == 4){
				_this.$topPanel = $('#s_top_list');
				_this.$panel = $('#s_resource_list');
				_this.$pagebar = $('#s_pagebar');
				_this.loadTop();
				_this.loadRes();
				$('#list_panel').show();	
			}
			if(type == 5){
				_this.$topPanel = $('#top_list');
				_this.$panel = $('#resource_list');
				_this.$pagebar = $('#pagebar');
				_this.loadTop();
				_this.loadRes();
				$('#tree_panel').show();
			}
			if(type == 7){
				_this.loadNews();
				$('#pic_panel').show();
			}

		},
		loadNews : function(){
			var $panel = $('#news_panel');
			$.ajax({
				type : 'post',
				url : 'admin/news',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						var list = data.list;
						var length = list.length;
						while(length < 5){
							length++;
							list.push({
								title : '',
								link : '',
								pic_url : '',
								index : length
							});
						}
						$panel.html(_this.tpl.newsTpl.render(data));	
					}
				}
			});
		},
		commit : function(){
			var $infos = $('.news-edit');
			var newsList = [];
			$infos.each(function(i){
				var index = i+1;
				var $this = $(this);
				var news = {
					title : $this.find('.newstitle').val(),
					link : $this.find('.link').val(),
					pic_url : $this.find('.pic_url').val(),
					index : index
				}
				if(news.title && news.link && news.pic_url ){
					newsList.push(news);	
				}
			});
			var $btn = $('#btn_commit');
			$.ajax({
				type : 'post',
				url : 'admin/setnews',
				data : {newsStr: JSON.stringify(newsList)},
				beforeSend : function(){
					$btn.val('正在提交');
				},
				success : function(data){
					if(data.success){
						alert('修改成功');
					}else{
						alert('修改失败');
					}
				},
				complete : function(){
					$btn.val('提交');
				}
			});
		},
		loadTop : function(){
			$.ajax({
				type : 'post',
				url : 'index/list/up',
				async : false,
				data : {mid:_this.data.searchData.mid},
				beforeSend : function(){
					_this.$topPanel.html(util.loadingPanel);
				},
				success : function(result){
					var data = result.data;
					_this.topMap = {};
					for(var index in data.list){
						var top = data.list[index];
						_this.topMap[top.id] = top;
					}
				    _this.$topPanel.html(_this.tpl.topListTpl.render(data));
				}
			});
		},
		loadRes : function() {
			$.ajax({
				type : "post",
				url : 'index/list/res',
				data : _this.data.searchData,
				beforeSend : function() {
					_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageRes
			});
		},
		initPageRes : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
			data = data.data;
			var list = [];
			for ( var index in data.list) {
				var resource = data.list[index];
				if(!_this.topMap[resource.id]){
					list.push(resource);
				}
			}
			
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.tpl.resourceTpl.render({list:list});
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
			}
			_this.$panel.html(html);
			
			if (totalPage <= 1) {
				_this.$pagebar.html('');
			}
			if (totalPage >= 2) {
				$(function() {
					$.fn.jpagebar({
						renderTo : _this.$pagebar,
						totalpage : totalPage,
						totalcount : totalcount,
						pagebarCssName : 'pagination2',
						currentPage : data.currentPage,
						onClickPage : function(pageNo) {
							$.fn.setCurrentPage(this, pageNo);
							_this.data.searchData.pageNo = pageNo;
							if (_this.instance_resource == null)
								_this.instance_resource = this;
							var data = _this.data.searchData;
							$.ajax({
								type : "post",
								url : _this.searchUrl,
								data : data,
								beforeSend : function() {
									_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
									if (!data.success) {
										util.dialog.infoDialog('查询出错');
										return;
									}
									data = data.data;
								
									var list = [];
									for ( var index in data.list) {
										var resource = data.list[index];
										if(!_this.topMap[resource.id]){
											list.push(resource);
										}
									}
									var totalPage = data.totalPage;
									var totalcount = data.totalCount;
									var html = _this.tpl.resourceTpl.render({list:list});
									if(totalcount == 0){
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									_this.$panel.html(html);
								}
							});
						}
					});
				});
			}
		},
		showAddRes : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit?menuPath=' + menuPath);
		},
		showEditRes : function(){
			var id = $(this).attr('data-id');
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit/' + id + '?menuPath=' + menuPath);
		},
		showDelRes : function(){
			var id = $(this).attr('data-id');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/article/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								_this.searchResource();
							}else{
								alert(result.msg);
							}
							
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		initEditor : function(){
			_this.editor = new Simditor({
			  	textarea: $('#editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
		},
		midMap : {
			'100101' : {type:1},
			'100102' : {type:1},
			'1002'   : {type:1},
			'1005'   : {type:1},
			'1003'   : {type:2,smid:100301}
		},
		showEditor : function(mid){
			var data = _this.midMap[mid];
			_this.mid = mid;
			if(data && data.type == 1){
				$.ajax({
					type : "post",
					url : 'index/info/view/' + mid,
					success : function(data){
						if(data.success){
							_this.editor.setValue(data.data.content);
						}else{
							alert(data.msg);
						}
					}
				});
			}
		},
		commitInfo : function() {
			var mid = _this.data.searchData.mid;
			var data = _this.midMap[mid];
			
			if(data.type == 1 && data.smid){
				mid = data.smid;
			}
			var content = _this.editor.getValue();
			
			var postData = {
				content : content,
				mid : mid
			};
			$.ajax({
				url : 'index/info/save',
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.infoDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},
		up : function(){
			var $this = $(this);
			var mid = _this.data.searchData.mid;
			var res_id = $this.attr('data-id');
			$.ajax({
				type : "post",
				url : 'index/setup',
				data : {
					mid : mid,
					res_id : res_id
				},
				success : function(data){
					if(data.success){
						alert('置顶成功');
						_this.loadTop();
						_this.loadRes();
					}else{
						alert(data.msg);
					}
				}
			});
		},
		down : function(){
			var $this = $(this);
			var mid = _this.data.searchData.mid;
			var res_id = $this.attr('data-id');
			$.ajax({
				type : "post",
				url : 'index/setdown',
				data : {
					mid : mid,
					res_id : res_id
				},
				success : function(data){
					if(data.success){
						alert('取消成功');
						_this.loadTop();
						_this.loadRes();
					}else{
						alert(data.msg);
					}
				}
			});
		}
	};
}(moka));
