(function(P){
	var _this = null;
	_this = P.resource.list = {
		topicTree : null,
		topicNodes : null,
		topicData : [],
		data : {
			resourceTpl : null,
			favDialogTpl : null,
			searchData : {
				stageid : '1',
				subjectid : '1',
				src : '-1',// 来源
				format : '-1',// 格式
				order : 'ref',// 排序
				topicId : '',
				keyword : '',
				seriesid : '',
				pageNo : '1',
				relation : 1,
				desc : true
			},
			resourceList : {},
			resourceListTpl : null,
			topics:'',
			series:'',
			totalPage : null,
			currPage : null,
			prefix :  null,//路径前缀(不包括文件名)
			suffix : null,//原文件后缀
			orgFileName : null,//原文件名,不包含后缀
			fileName : null,//转换后文件名,不包含后缀
			playType : null,//转换后文件后缀
			image : 'jpg,png,gif,jpeg,bmp',
			initData : null,
			initCallback : null
		},
		defaultCategory:'',
		http : '',
		rms : '', 
		init : function() {
			//_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			_this.initSrc();
			_this.sort(true);
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
				if(data.src==0&&data.createdBy==userId){
					 data.mine=true;
					 options.isPreview = true;
				 }
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
		initSrc : function() {
			$.ajax({
				type : "get",
				cache : false,
				async:false,
				contentType : "application/json",
				url : ctx + "/teacher/resource/initSearchClip",
				data:{
					"topics":-1,
					"series":-1
				},
				dataType : 'json',
				success : _this.handleInit 
			});
		},
		handleInit : function(data) {
			var result = data;
			_this.http=result.http;
			_this.rms = result.rms;
			_this.defaultCategory = _this.rms[0].id;
			//_this.initTopic(_this.data.searchData.subjectid);
		},
		initTopic : function(subjectId) {
			$.ajax({
				type : "get",
				cache : false,
				contentType : "application/json",
				url : ctx + "/teacher/resource/loadTopic/" + subjectId,
				dataType : 'json',
				beforeSend : function() {
					$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="'+ static_ctx + '/static/img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
				},
				success : _this.handleTopic 
			});
		},
		handleTopic : function(topicData) {
			_this.topicNodes = [];
			_this.seriesNodes = [];
			var modules =  JSON.parse(JSON.stringify(topicData)); 
			var moduleTopic = modules.moduleTopic;
			if(moduleTopic!=null){
				for ( var i = 0; i < moduleTopic.length; i++) {
					var module = moduleTopic[i];
					var units = module.units;
					module["pId"] = 0;
					module["open"] = false;
					module['nocheck'] = true;
					delete module.units;
					delete module.series;
					_this.topicNodes.push(module);
					for ( var j = 0; j < units.length; j++) {
						var unit = units[j];
						var topics = unit.topics;
						unit["pId"] = module.id;
						unit['nocheck'] = true;
						unit.id = module.id + '-' + unit.id;
						delete unit.topics;
						_this.topicNodes.push(unit);
						for ( var k = 0; k < topics.length; k++) {
							var topic = topics[k];
							topic["pId"] = unit.id;
							topic.id = unit.id + '-' + topic.id;
							_this.topicNodes.push(topic);
						}
					}
				}
			}
			var moduleSeries = modules.moduleSeries;
			if(moduleSeries!=null){
				for ( var i = 0; i < moduleSeries.length; i++) {
					var module = moduleSeries[i];
					var series = module.series;
					module["pId"] = 0;
					module["open"] = false;
					module['nocheck'] = true;
					delete module.units;
					delete module.series;
					_this.seriesNodes.push(module);
					for ( var j = 0; j < series.length; j++) {
						var s = series[j];
						s["pId"] = module.id;
						s.id = module.id + '-' + s.id;
						delete s.topics;
						_this.seriesNodes.push(s);
					}
				}
			}
			_this.initTree();
		},
		searchResource : function() {
			var url = ctx + "/teacher/clip/retrieve";
			var data = _this.data.searchData;
			data.relation = $('input[name=topicScope]:checked').val();
			if(data.relation != 2)
				data.relation = 1;
			$.ajax({
				type : "get",
				cache : false,
				url : url,
				dataType : 'json',
				data : data,
				beforeSend : function() {
					$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="'+ static_ctx + '/static/img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
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
			
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			data['ctx'] = ctx;// 上下文,模板中有超链接时需要使用
			data['static_ctx'] = static_ctx;// 静态内容上下文
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
					if (treeNode.isParent) {
						zTree.expandNode(treeNode);
						return false;
					} else {
						return true;
					}
				},
				onCheck: function(event,treeId, treeNode) {
					var zTree = _this.getCurrTree();
					if (_this.theme == 0) {
						_this.data.searchData.topicId = '';
					}else{
						_this.data.searchData.seriesid = '';
					}
					if (!treeNode.isParent) {
						var nodes = zTree.getCheckedNodes(true);
						for(var index in nodes){
							var topicId = nodes[index].id;
							if (topicId.indexOf("-") >= 0) {
								if (_this.theme == 0) {
									_this.data.searchData.topicId += topicId.substr(topicId.lastIndexOf("-") + 1) +',';
									if(zTree.getCheckedNodes(true).length>10){
										util.dialog.infoDialog("主题数量不能超过10个!");
										treeNode.checked=false;
									}
									if((_this.topicTree.getCheckedNodes(true).length + _this.seriesTree.getCheckedNodes(true).length)>10){
										util.dialog.infoDialog("主题数和专题数之和不能超过10!");
										treeNode.checked=false;	
									}
								}else{
									_this.data.searchData.seriesid += topicId.substr(topicId.lastIndexOf("-") + 1) +',';
									if(zTree.getCheckedNodes(true).length>10){
										util.dialog.infoDialog("专题数量不能超过10个!");
										treeNode.checked=false;
										$("#"+treeNode.id).remove();
									}
									if((_this.topicTree.getCheckedNodes(true).length + _this.seriesTree.getCheckedNodes(true).length)>10){
										util.dialog.infoDialog("主题数和专题数之和不能超过10!");
										treeNode.checked=false;
									}
								}
							}
						}
						_this.data.searchData.pageNo = 1;
						_this.searchResource();
						return true;
					}
				}
			}
		},
		initTree : function() {// 初始化树功能，折叠展开点击事件
			var topicTree = $("#topic_tree");
			topicTree = $.fn.zTree.init(topicTree, _this.setting, _this.topicNodes);
			_this.topicTree = $.fn.zTree.getZTreeObj("topic_tree");
			
			var seriesTree = $("#series_tree");
			seriesTree = $.fn.zTree.init(seriesTree, _this.setting, _this.seriesNodes);
			_this.seriesTree = $.fn.zTree.getZTreeObj("series_tree");
		},
		getCurrTree : function(){
			var zTree;
			if (_this.theme == 0) {
				zTree = _this.topicTree;
			}else{
				zTree = _this.seriesTree;
			}
			return zTree;
		}
	};
}(moka));