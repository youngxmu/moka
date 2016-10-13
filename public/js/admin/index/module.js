(function(P){
	var _this = null;
	_this = P.admin.indexm = {
		searchUrl : 'index/list/res',
		tpl : {
			moduleTpl : null
		},
		data : {
			moduleMap : {}
		},
		init : function() {
			_this.tpl.moduleTpl = juicer($('#module-tpl').html());
			_this.initEvent();
			_this.loadModules();
		},
		initEvent : function(){
			$('#resource_list').on('click', '.edit', _this.showEditRes);
			$('body').on('click', '.res-menu button', function(){
			});
		},
		loadModules : function(){
			var $panel = $('.module-container');
			$.ajax({
				type : 'post',
				url : 'admin/index/modules',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						var list = data.list;
						for(var index in list){
							var module = list[index];
							module.keys = module.keywords.split(',');
						}
						$panel.html(_this.tpl.moduleTpl.render({list:list}));	
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
						util.dialog.infoDialog('修改成功');
					}else{
						util.dialog.infoDialog('修改失败');
					}
				},
				complete : function(){
					$btn.val('提交');
				}
			});
		},
		showAddRes : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit?menuPath=' + menuPath);
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
								util.dialog.infoDialog(result.msg);
							}
							
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		saveMsg : function(){
			var data = {
				title : $('#msg_title').val(),
				content : _this.msgEditor.getValue()
			};
			if(_this.data.msgId){
				data.id = _this.data.msgId;
			}
			$.ajax({
				type : "post",
				url : 'admin/message/save',
				data : data,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						_this.loadMsg();
						util.dialog.toastDialog('保存成功');
					}
				}
			});
		}
	};
}(moka));
