(function(P){
	var _this = null;
	_this = P.resource.list = {
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
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
				
			});
			/** 初始化知识点树 */
			$('.opAll').on('click',function(){
				var zTree = _this.getCurrTree();
				zTree.cancelSelectedNode();
				zTree.checkAllNodes(false);
				_this.data.searchData.pageNo=1;
				if(_this.theme == 0){
					_this.data.searchData.topicId='';
				}else{
					_this.data.searchData.seriesid='';
				}
				_this.searchResource();
			});
			
			$('.treeOper .unfold').click(function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(true);
			});
				
			$('.treeOper .shrink').click(function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(false);
			});
		},
		
		initTopic : function(subjectId) {
			$.ajax({
				type : "post",
				cache : false,
				url : '/menu/tree',
				dataType : 'json',
				beforeSend : function() {
					$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="/img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
				},
				success : _this.handleTopic 
			});
		},
		handleTopic : function(data) {
			_this.topicNodes = [];
			var list = data.data.list;
			for(var index in list){
				var menu = list[index];
				menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}
			_this.initTree();
		},
		searchResource : function() {
			var url = '/article/queryArticleByMenu';
			var data = _this.data.searchData;
			$.ajax({
				type : "post",
				url : url,
				data : data,
				beforeSend : function() {
					$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="/img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageResource 
			});
		},
		initPageResource : function(data) {
			if (!data.success) {
				util.dialog.messageDialog('查询出错');
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
							_this.searchResource();
						}
					});
				});
			}
		},
		setting : {
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",// id 自定义
					pIdKey : "pId",// 父节点id 自定义
					rootPId : ""
				}
			},
			check : {
				enable : true
			},
			callback : {
				beforeClick : function(treeId, treeNode) {
					var zTree = _this.getCurrTree();
					_this.currNode = treeNode;
					if (treeNode.isParent) {
						zTree.expandNode(treeNode);
						return true;
					} else {
						return true;
					}
				},
				onClick: function(event,treeId, treeNode) {
					var zTree = _this.getCurrTree();
					// if (!treeNode.isParent) {
						var nodes = zTree.getCheckedNodes(true);
						// console.log(treeNode);
						_this.data.searchData.mid = treeNode.id;
						_this.data.searchData.pageNo = 1;
						_this.searchResource();
						return true;
					// }
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
		showAddMenuDlg : function(){
			
			util.dialog.confirmDialog(
				_this.data.editMenuDlgTpl,
				_this.addMenu,
				function(){},
				'确认添加菜单'
			);
		},
		addMenu : function(){
			var parent_id = _this.data.searchData.mid;
			var level = 1;
			if(!parent_id){
				parent_id = 0;
			}else{
				var pmenu = _this.currNode;
				level = pmenu.level;
				parent_id = pmenu.parent_id;
			}

			var name = $('menu_name').val();
			if(!name){
				return;
			}

			$.ajax({
				type : "post",
				cache : false,
				url : '/menu/add',
				data : {
					level : level,
					parent_id : parent_id,
					name : name
				},
				success : function(){
					console.log('reload');
				}
			});
		}
	};
}(moka));