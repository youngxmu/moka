(function(P){
	var _this = null;
	_this = P.admin.jsll.list = {
		searchUrl : 'jsll/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {},
		data : {
		},
		init : function() {
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.type = 1;
			_this.initEvent();

			
			_this.editor = $('#content');
			_this.txt_editor = $('#txt_editor');
			_this.data.key = '政策';
			// _this.search();
			_this.changeType({init: true});
		},
		initEvent : function(){
			$('.nav-tabs').on('click', 'li', _this.changeType);
			$('#menu_list').on('click', 'li', _this.showContent);

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
			$('#btn_commit').on('click', function(){
				if(_this.data.type == '3'){
					_this.commitInfo();
				}else{
					_this.commitxx();
				}
			});

			$('#btn_txt').on('click', function(){
				if(_this.data.type == '3'){
					_this.commitInfo();
				}else{
					_this.commitxx();
				}
			});
			

			$('.type-panel').on('click', 'li',function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				_this.type = $this.attr('data-type');
				_this.initTopic();
			});
		},
		changeType : function(options){
			var $this = $(this);
			if(options && options.init){
				$this = $('.nav-tabs li').first();
			}

			$this.addClass('active').siblings().removeClass('active');
			_this.data.type = $this.attr('data-type');
			_this.data.key = $this.attr('data-key');
			if(_this.data.key == '资料'){
				$('#menu_panel').hide();
				$('#tree_panel').show();
				_this.initTopic();
			}else{
				$('#menu_panel').show();
				$('#tree_panel').hide();
				$.ajax({
					url : 'jsll/list/' + _this.data.key,
					type : 'post',
					success : function(result){
						if(result.success){
							var html = _this.tpl.menuTpl.render(result.data);
							$('#menu_list').html(html);
							_this.listMap = {};
							for(var index in result.data.list){
								var item = result.data.list[index];
								_this.listMap[item.id] = item;
								if(index == 0){
									$('#content').val(item.content);
									_this.currItem = item;
								}
							}
						}else{
							$('#menu_list').html('');
							$('#content').val('');			
						}
					}
				});
			}
		},
		// search : function(){
		// 	$.ajax({
		// 		url : 'jsll/list/' + _this.data.key,
		// 		type : 'post',
		// 		success : function(result){
		// 			if(result.success){
		// 				var html = _this.tpl.menuTpl.render(result.data);
		// 				$('#menu_list').html(html);
		// 				_this.listMap = {};
		// 				for(var index in result.data.list){
		// 					var item = result.data.list[index];
		// 					_this.listMap[item.id] = item;
		// 					if(index == 0){
		// 						$('#content').val(item.content);
		// 						_this.currItem = item;
		// 					}
		// 				}
		// 			}else{
		// 				$('#menu_list').html('');
		// 				$('#content').val('');			
		// 			}
		// 		}
		// 	});
		// },
		search : function(){
			$.ajax({
				type : 'post',
				url : 'article/queryArticleByMenu',
				data : _this.queryData,
				beforeSend : function(){
					$('#resource_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var item = _this.listMap[id];
			_this.currItem = item;
			_this.id = id;
			$('#content').val(item.content);
		},
		commitInfo : function() {
			var currNode = _this.currNode;
			var postData = {
				content : $('#content').val(),
				name : currNode.name,
				id : currNode.id
			};
			$.ajax({
				url : 'admin/jsll/updateinfo',
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
		initTopic : function() {
			var searchUrl = 'jsll/info/list';
			if(_this.type == 2){
				searchUrl =  'menu/tree/1403';
			}
			if(_this.type == 3){
				searchUrl =  'menu/tree/1402';
			}
			if(_this.type == 4){
				searchUrl =  'menu/tree/1401';
			}
			console.log(_this.type);
			if(_this.type == 1){
				$('#txt_panel').show();
				$('#resource_panel').hide();
			}else{
				$('#txt_panel').hide();
				$('#resource_panel').show();
			}
			
			$.ajax({
				type : "post",
				cache : false,
				url : searchUrl,
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
				if(menu.title && !menu.name){
					menu.name = menu.title;	
				}
				// menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}

			_this.initTree();
		},
		initPage : function(result) {
			var data = result.data;
		    $('#resource_list').html(_this.data.resourceTpl.render(data));

			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#resource_list').html(P.building);
				return;
			}

		    if (totalPage <= 1) {
		        $("#pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_papers == null)
		                    	_this.instance_papers = this;
		                    _this.queryData.pageNo = parseInt(pageNo),
		                    $.ajax({
		                    	url : 'article/queryArticleByMenu',
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#resource_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#resource_list').html(_this.data.resourceTpl.render(data));
		                		    }
		                		    else {
		                		        util.dialog.infoDialog("查询信息失败，请重试。");
		                		    }
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
					$('#content_title').html(_this.currNode.name);
					_this.id = _this.currNode.id;
					if(_this.type == 1){
						if(_this.currNode.content){
							if(_this.currNode.content == 'null'){
								_this.currNode.content == '';
							}
							// $('#content').html('<pre>' + _this.currNode.content + '</pre>');		
							_this.txt_editor.html(_this.currNode.content);	
						}else{
							$.ajax({
								url : 'jsll/info/detail/' + _this.currNode.id,
								type : 'get',
								async : false,
								success : function(data){
									if(data.success){
										if(data.data.content == 'null'){
											data.data.content == '';
										}
										// $('#content').html('<pre>' + data.data.content + '</pre>');	
										_this.currNode.content = data.data.content;
										_this.txt_editor.html(_this.currNode.content);	
									}else{
										$('#content').html('');			
									}
								}
							});
						}
					}else{
						_this.queryData = {
							pageNo : 1,
							pageSize : 10
						};
						_this.queryData.mid = _this.currNode.id;
						_this.search();
					}

					// if(_this.type == 2){
					// 	if( _this.currNode.file_name){
					// 		$('#content').html(_this.data.picTpl.render(_this.currNode));
					// 	}else{
					// 		$('#content').html('');			
					// 	}
						
					// }

					// if(_this.type == 3 ){
					// 	if( _this.currNode.file_name){
					// 		$('#content').html(_this.data.videoTpl.render(_this.currNode));
					// 	}else{
					// 		$('#content').html('');			
					// 	}
					// }

					// if(_this.type == 4 ){
					// 	if( _this.currNode.file_name){
					// 		$('#content').html(_this.data.pptTpl.render(_this.currNode));
					// 	}else{
					// 		$('#content').html('');			
					// 	}
					// }
					
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
			var menuArr = [_this.pid];
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
			window.open('admin/article/upload?menuPath=' + menuPath);
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
		commitInfo : function() {
			var mid = _this.id;
			var content = _this.txt_editor.val();
			
			var postData = {
				content : content,
				id : mid
			};
			$.ajax({
				url : 'admin/jsll/updateinfo',
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
		commitxx : function() {
			var mid = _this.id;
			var content = _this.editor.val();
			
			var postData = {
				content : content,
				id : mid
			};
			$.ajax({
				url : 'admin/jsll/updatexx',
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