(function(P){
	var _this = null;
	_this = moka.customer.verify = {
		tpl : {
			modelListTpl : null//模特列表模板
		},
		data : {
			tags : [],
			modelMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 20,
			status : 0
		},
		init : function(){
			_this.tpl.modelListTpl = juicer($('#model_list_tpl').html());
			_this.tpl.dlgModelDetail = juicer($('#dlg_model_detail').html());
			_this.initParams();
			_this.initEvent();
			_this.search();
		},
		initParams : function(){
			$.ajax({
				type : 'post',
				async : false,
				url : '/customer/getHost',
				success : function(result){
					if(result && result.success){
						_this.data.host = result.host;					
					}
					
				}
			});

			$.ajax({
				type : 'post',
				async : false,
				url : '/tag/queryTags',
				success : function(result){
					if(result && result.success){
						_this.data.tags = result.data.list;
					}
					
				}
			});
		},
		initEvent : function(){
			$('#model_list').on('click', '.detail', _this.showViewModelDlg);

			$('body').on('click', '.d-right span', function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
				}else{
					$this.addClass('selected');
				}
			});

			$('#btn_check_all').click(function(){
				var $this = $(this);

				if($this.is(':checked')){
					$('#model_list').find('input').prop('checked',  true);
				}else{
					$('#model_list').find('input').prop('checked',  false);
				}

			});


			$('#btn_pass').click(function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}
				var d = dialog({
				    title: '确认',
				    content: '确认批量通过',
				    okValue : '确定',
				    width : 240,
				    ok : function(){
				    	var modelIds = [];

				    	var $checkboxs = $('#model_list').find('input:checked');
				    	$checkboxs.each(function(){
				    		var $this = $(this);
				    		var modelId = $this.val();
				    		modelIds.push(modelId);
				    	});

				    	$.ajax({
							type : 'post',
							url : '/check/models',
							data : {modelIds : modelIds, status : 1, description : '批量审核通过'},
							success : function(result){
								if(result.success){
									var dd = dialog({
									    title: '确认',
									    content: '审核完成',
									    okValue : '确定',
									    width : 240,
									    ok : function(){
									    	window.location.href = window.location.href;
									    }
									});
									dd.showModal();
								}
							}
						});
				    },
				    cancelValue : '取消',
				    cancel : function(){}
				});
				d.showModal();
			});


			$('#btn_reject').click(function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}

				var d = dialog({
				    title: '确认',
				    content: '<div>确认批量拒绝</div><div><textarea id="description" style="width:200px;height:100px;" ></textarea></div>',
				    okValue : '确定',
				    width : 240,
				    ok : function(){
				    	var modelIds = [];

				    	var $checkboxs = $('#model_list').find('input:checked');
				    	$checkboxs.each(function(){
				    		var $this = $(this);
				    		var modelId = $this.val();
				    		modelIds.push(modelId);

				    	});

				    	var description = $('#description').val();
				    	$.ajax({
							type : 'post',
							url : '/check/models',
							data : {modelIds : modelIds, status : 2, description : description},
							success : function(result){
								if(result.success){
									var dd = dialog({
									    title: '确认',
									    content: '审核完成',
									    okValue : '确定',
									    width : 240,
									    ok : function(){
									    	window.location.href = window.location.href;
									    }
									});
									dd.showModal();
								}
							}
						});
				    },
				    cancelValue : '取消',
				    cancel : function(){}
				});
				d.showModal();
			});

			$('body').on('click', '.img-list-panel span', function(){
				var options = {
					imgList : []
				};
				for(var index in _this.data.currModel.pics){
					options.imgList.push(_this.data.currModel.host + _this.data.currModel.pics[index]);
				}
				component.imgFSPlayer.init(options);
				// var $this = $(this);
				// var img = $this.find('img');
				// var d = dialog({
				//     title: '确认',
				//     content: '<div style="display:table-cell;" ><img src="' + img.attr('src') + '" style="max-width:600px;" /></div>',
				//     okValue : '确定',
				//     ok : function(){
				//     }
				// });
				// d.showModal();
			});
		},
		showViewModelDlg : function(){
			var modelId = $(this).attr('data-id');
			var model = _this.data.modelMap[modelId];
			var real_pics = model.real_pics;
			var pics = real_pics.split(',');
			if(!pics || pics.length == 0){
				pics = [];
			}


			model.host = 'http://' + _this.data.host + '/';
			model.pics = pics;

			_this.data.currModel = model;

			
			var modelTagMap = {};
			$.ajax({
				type : 'post',
				async : false,
				url : '/tag/queryTagsOfModel',
				data : {modelId : modelId},
				success : function(result){
					if(result.success){
						var modelTags = [];
						modelTags = result.data.list;
						for(var index in modelTags){
							var tag = modelTags[index];
							modelTagMap[tag.tag_id] = tag;
						}
					}
				}
			});
			
			
			var tags = $.extend(true,[],_this.data.tags);;
			
			for(var index in tags){
				var tag = tags[index];
				if(modelTagMap[tag.id]){
					tag['selected'] = true;
				}				
			}

			model.tags = tags;

			var d = dialog({
			    title: '查看详情',
			    content: _this.tpl.dlgModelDetail.render(model),
			    button: [
			        {
			            value: '不通过',
			            callback: function () {
			               $.ajax({
								type : 'post',
								url : '/check/model',
								data : {modelId : modelId, status : 2, description : '审核未通过', mobile : model.tel},
								success : function(result){
									if(result.success){
										var dd = dialog({
										    title: '确认',
										    content: '审核完成',
										    okValue : '确定',
										    width : 240,
										    ok : function(){
										    	window.location.href = window.location.href;
										    }
										});
										dd.showModal();
									}
								}
							});
			            }
			        },
			        {
			            value: '通过',
			            callback: function () {
			               var tagIds = [];
					
							$('#model_detail_panel').find('.d-right span.selected').each(function(){
								tagIds.push($(this).attr('data-id'));
							});


					    	$.ajax({
								type : 'post',
								url : '/check/model',
								data : {modelId : modelId, status : 1, description : '审核通过', mobile : model.tel},
								success : function(result){
									if(result.success){

										$.ajax({
											type : 'post',
											url : '/tag/updateTagsOfModel',
											data : {modelId : modelId, tagIds : tagIds},
											success : function(result){
												if(result.success){
													var dd = dialog({
													    title: '确认',
													    content: '审核完成',
													    okValue : '确定',
													    width : 240,
													    ok : function(){
													    	window.location.href = window.location.href;
													    }
													});
													dd.showModal();
												}
											}
										});
									}
								}
							});
			            },
			            autofocus: true
			        }
			    ]
			   
			});
			d.showModal();
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : '/model/queryList',
				data : _this.queryData,
				beforeSend : function(){
					$('#model_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			var data = result.data;
		    $('#model_list').html(_this.tpl.modelListTpl.render(data));

			var modelList = data.list;
			for(var index in modelList){
				var model = modelList[index];
				_this.data.modelMap[model.id] = model;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;
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
		                    	url: '/model/queryList',
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#model_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#model_list').html(_this.tpl.modelListTpl.render(data));
										var modelList = data.list;
										for(var index in modelList){
											var model = modelList[index];
											_this.data.modelMap[model.id] = model;
										}
		                		    }
		                		    else {
		                		        util.dialog.infoDialog("查询试卷信息失败，请重试。");
		                		    }
		                        }
		                    });
		                }
		            });
		        });
		    }
		}
	};
}(moka));