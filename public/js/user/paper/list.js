(function(P){
	var _this = null;
	_this = P.user.paper.list = {
		// searchUrl : 'paper/list',
		searchUrl : 'jsll/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			// _this.tpl.paperListTpl = juicer($('#paper-list-tpl').html());
			// _this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			
			_this.initEvent();
			_this.data.type = '理论';
			_this.search();
			// _this.search();
		},
		initEvent : function(){
			$('.nav-ul').on('click', 'li', _this.changeType);
			$('#menu_panel').on('click', 'li', _this.showContent);

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
		},
		changeType : function(){
			var $this = $(this);
			$this.addClass('active').siblings().removeClass('active');
			_this.data.type = $this.attr('data-type');
			if(_this.data.type == ''){
				return;
			}
			if(_this.data.type == '资料'){
				_this.initTopic();
			}else{
				$('#menu_panel').show();
				$('#topic_tree').hide();
				_this.search();
			}
		},
		search : function(){
			$.ajax({
				url : 'jsll/list/' + _this.data.type,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('#menu_panel').html(html);
						_this.listMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.listMap[item.id] = item;
							if(index == 0){
								$('#content_title').html(item.title);
								$('#content').html(item.content);
							}
						}
					}else{
						$('#menu_panel').html('');
						$('#content').html('');			
					}
				}
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			
			var item = _this.listMap[id];

			$('#content_title').html(item.title);
			$('#content').html(item.content);
		},


		initTopic : function() {
			$('#menu_panel').hide();
			$('#topic_tree').show();
			
			
			$.ajax({
				type : "post",
				cache : false,
				url : _this.searchUrl,
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
				if(menu.parent_id != 10){
					_this.topicNodes.push(menu);	
				}

				
			}
			_this.initTree();
		},
		setting : {
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false,
				showIcon : true
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",// id 自定义
					pIdKey : "parent_id",// 父节点id 自定义
					rootPId : 100
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
					console.log(_this.currNode);
					$('#content_title').html(_this.currNode.name);
					if(_this.currNode.content){
						$('#content').html(_this.currNode.content);		
					}else{
						$.ajax({
							url : 'jsll/info/' + _this.currNode.id,
							type : 'get',
							async : false,
							success : function(data){
								if(data.success){

									$('#content').html(data.data.content);
									_this.currNode.content = data.data.content;

								}else{
									$('#content').html('');			
								}
							}
						});
					}
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
		}
	};
}(moka));

juicer.register('formatAnswer', moka.user.paper.list.formatAnswer );