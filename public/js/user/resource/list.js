(function(P){
	var _this = null;
	_this = P.user.resource.list = {
		pid : 11,
		searchUrl : 'resource/list',
		data : {
			searchData : {
				pageNo : 1,
				pageSize : 15
			}
		},
		init : function() {
			var keyword = $('#search_title').val();
			if(keyword){
				_this.data.searchData.keyword = keyword;
				$('#keyword').val(keyword);
			}
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			_this.searchResource();
		},
		initEvent : function(){
			$('body').on('click','.type-panel li',function(){
				var $this = $(this)
				var type = $this.attr('data-type');
				if(type == 1){
					_this.data.searchData.type = '1,6';
				}
				if(type == 2){
					_this.data.searchData.type = '3';	
				}
				if(type == 3){
					_this.data.searchData.type = '4';
				}
				if(type == 4){
					_this.data.searchData.type = '0';
				}

				$this.addClass('active').siblings().removeClass('active');
				_this.searchResource();
			});

			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
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
		searchResource : function() {
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
		}
	};
	
}(moka));