(function(P){
	var _this = null;
	_this = P.user.jsjn.list = {
		pid : 14,//系统根目录编号
		searchUrl : 'article/queryArticleByMenu',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		data : {
			image : 'jpg,png,gif,jpeg,bmp',
			initData : null,
			initCallback : null,
			searchData : {
				pageNo : 1,
				pageSize : 15
			}
		},
		init : function() {
			$('#hd_menu_resource').addClass('current');
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.initEvent();
			_this.initTopic();
			_this.searchResource();
		},
		initEvent : function(){
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
			$('body').on('keydown','#keyword',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		          	_this.data.searchData.keyword = $('#keyword').val();
					_this.searchResource();
		        }
		    });
			$('#btn_search').click(function(){
				_this.data.searchData.keyword = $('#keyword').val();
				_this.searchResource();
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
			var data = _this.data.searchData;
			if(_this.data.searchData.keyword){
				_this.searchUrl = 'article/queryArticleByTitle';
			}else{
				_this.searchUrl = 'article/queryArticleByMenu';
			}

			if(!_this.data.searchData.mid){
				_this.data.searchData.mid = _this.pid;
			}
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
						currentPage : data.pageNo,
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
					_this.data.searchData.mid = treeNode.id;
					_this.data.searchData.pageNo = 1;
					_this.searchResource();
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
			return menuArr.join(',');
		},
		showAddArticle : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('article/edit?menuPath=' + menuPath);
		}
	};
}(moka));