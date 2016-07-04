(function(P){
	var _this = null;
	_this = P.admin.index = {
		searchUrl : 'article/queryArticleByMenu',
		pid : 10,//系统根目录编号
		tpl : {
			articleListTpl : null
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
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			_this.initEditor();
			_this.loadNews();
			_this.initTopic();
		},
		initEvent : function(){
			$('#btn_commit').click(_this.commit);
			$('#btn_modify').click(_this.commitInfo);
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});
			
			$('.tree-opr').on('click', '.unfold',function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(true);
				$(this).removeClass('unfold').addClass('shrink').text('收缩');
			});
				
			$('.tree-opr').on('click', '.shrink',function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(false);
				$(this).removeClass('shrink').addClass('unfold').text('展开');
			});

			$('.resource-opr').on('click', '.add', _this.showAddArticle);
			$('#resource_list').on('click', '.edit', _this.showEditArticle);
			$('body').on('click', '.oper .del',_this.showDelArticle);
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
				console.log(news);
				console.log((news.title && news.link && news.pic_url) );
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
		initTopic : function() {
			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/tree/' + _this.pid,
				dataType : 'json',
				beforeSend : function() {
					$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
				},
				success : _this.handleTopic 
			});
		},
		handleTopic : function(data) {
			_this.topicNodes = [];
			var list = data.data.list;
			for(var index in list){
				var menu = list[index];
				// menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}
			_this.initTree();
		},
		searchResource : function() {
			
			if(!_this.data.searchData.mid){
				_this.data.searchData.mid = _this.pid;
			}

			var infoDict = {
				'100401' : '历史',
				'100402' : '法规',
				'100403' : '外国',
				'100404' : '武器 装备',
				'100405' : '形势',
				'100406' : '历史'
			};
			if(infoDict[_this.data.searchData.mid]){
				_this.data.searchData.keyword = infoDict[_this.data.searchData.mid];
				_this.searchUrl = 'article/queryArticleByTitle';
			}else{
				_this.searchUrl = 'article/queryArticleByMenu';
				_this.data.searchData.keyword = '';
			}
			var data = _this.data.searchData;
			$.ajax({
				type : "post",
				url : _this.searchUrl,
				data : data,
				beforeSend : function() {
					$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageResource
			});
		},
		initPageResource : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
	
			_this.data.resourceList = {};
			for ( var index in data.list) {
				var resource = data.list[index];
				_this.data.resourceList[resource.id] = resource;
			}
			data = data.data;
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.data.resourceTpl.render(data);
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
			}
			$('#resource_list').html(html);
			
			if (totalPage <= 1) {
				$("#pagebar").html('');
			}
			if (totalPage >= 2) {
				$(function() {
					$.fn.jpagebar({
						renderTo : $("#pagebar"),
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
									$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
									if (!data.success) {
										util.dialog.infoDialog('查询出错');
										return;
									}
							
									_this.data.resourceList = {};
									for ( var index in data.list) {
										var resource = data.list[index];
										_this.data.resourceList[resource.id] = resource;
									}
									data = data.data;
									var totalPage = data.totalPage;
									var totalcount = data.totalCount;
									var html = _this.data.resourceTpl.render(data);
									if(totalcount == 0){
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									$('#resource_list').html(html);
								}
							});
						}
					});
				});
			}
		},
		setting : {
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false,
				showIcon : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",// id 自定义
					pIdKey : "parent_id",// 父节点id 自定义
					rootPId : 14
				}
			},
			check : {
				enable : false
			},
			callback : {
				beforeClick : function(treeId, treeNode) {
					var zTree = _this.getCurrTree();
					if (treeNode.isParent) {
						zTree.expandNode(treeNode);
						return true;
					} else {
						return true;
					}
				},
				onClick: function(event,treeId, treeNode) {
					var zTree = _this.getCurrTree();
					var nodes = zTree.getCheckedNodes(true);
					if(_this.currNode && _this.currNode.id == treeNode.id){
						zTree.cancelSelectedNode(treeNode);
						_this.currNode = null;
						return false;
					}
					_this.currNode = treeNode;
					_this.clickNode(_this.currNode);
					// _this.data.searchData.mid = treeNode.id;
					// _this.data.searchData.pageNo = 1;
					// _this.searchResource();
					return true;
				}
			}
		},
		initTree : function() {// 初始化树功能，折叠展开点击事件
			var topicTree = $("#topic_tree");
			topicTree = $.fn.zTree.init(topicTree, _this.setting, _this.topicNodes);
			_this.topicTree = $.fn.zTree.getZTreeObj("topic_tree");
		},
		getCurrTree : function(){
			return _this.topicTree;
		},
		getMenuPath : function(node){
			var menuArr = [];
			var level = 0;
			if(node == null){
				return '';
			}else{
				level = node.level;
			}
			for(var i=0;i<=level;i++){
				menuArr.push(node.id);
				node = node.getParentNode();
			}
			menuArr.push(_this.pid);
			return menuArr.join(',');
		},
		showAddArticle : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit?menuPath=' + menuPath);
		},
		showEditArticle : function(){
			var id = $(this).attr('data-id');
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit/' + id + '?menuPath=' + menuPath);
		},
		showDelArticle : function(){
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
			'1001'   : {type:1,smid:100101},
			'100101' : {type:1},
			'100102' : {type:1},
			'100103' : {type:1},
			'1002'   : {type:1},
			'1005'   : {type:1},
			'1003'   : {type:2,smid:100301}
		},
		clickNode : function(node){
			var mid = node.id;
			var data = _this.midMap[mid];
			
			if(data && data.type == 1){
				if(data.smid){
					mid = data.smid;
				}
				$.ajax({
					type : "post",
					url : 'index/info/view/' + mid,
					// beforeSend : function() {
					// 	$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
					// },
					success : function(data){
						if(data.success){
							$('#list_box').hide();
							_this.editor.setValue(data.data.content);
							$('#editor_box').show();	
						}else{
							alert(data.msg);
						}
					}
				});
			}else{
				$('#list_box').show();
				$('#editor_box').hide();
				_this.data.searchData.mid = mid;
				_this.data.searchData.pageNo = 1;
				_this.searchResource();
			}
			
		},
		commitInfo : function() {
			var node = _this.currNode;
			var mid = node.id;
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
		}
	};
}(moka));
