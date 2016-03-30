(function(P){
	var _this = null;
	_this = moka.customer.tagmodel = {
		searchUrl : '/model/modelsByTag',
		tpl : {
			modelListTpl : null,//模特列表模板
			dlgAddModels : null
		},
		data : {
			model : {},
			modelMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function(){
			_this.data.tagId = $('#tag_id').val();
			_this.queryData.tagId = _this.data.tagId;

			_this.tpl.withTagTpl = juicer($('#model_withtag_tpl').html());
			_this.tpl.withoutTagTpl = juicer($('#model_withouttag_tpl').html());

			_this.tpl.modelListTpl = _this.tpl.withTagTpl;


			_this.tpl.dlgAddModel = juicer($('#dlg_add_model').html());
			_this.tpl.dlgViewAlbum = juicer($('#dlg_view_album').html());
			
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
						_this.data.host = 'http://' + result.host + '/';
					}
					
				}
			});
		},
		initEvent : function(){
			// $('#btn_add_model').click(_this.showAddModelDlg);

			$('#tab-panel').on('click', '.simp-tab', function(){
				var $this = $(this);
				var val = $this.attr('data-val');
				$this.addClass('current').siblings('.simp-tab').removeClass('current');

				if(val == 1){
					_this.searchUrl = '/model/modelsByTag';
					_this.tpl.modelListTpl = _this.tpl.withTagTpl;
				}else{
					_this.searchUrl = '/model/modelsWithoutTag';
					_this.tpl.modelListTpl = _this.tpl.withoutTagTpl;
				}

				_this.search();
			});


			$('#model_list').on('click', '.view-info', _this.viewModelAlbum);
			$('#model_list').on('click', '.del', _this.delModelTag);
			$('#model_list').on('click', '.add', _this.addModelTag);


			$('body').on('click', '#album_list .album-box', function(){
				var $this = $(this);
				var options = {
					imgList : _this.data.imgList,
					currIndex : parseInt($this.attr('data-index'), 10) + 1,
					renderCallback : function(currIndex){
						var index = parseInt(currIndex, 10) - 1;
						var $benifit = $($('#album_list').find('.album-box')[index]);
						var albumId = $benifit.attr('data-id');
						_this.data.currBenifitId = albumId;
					}
				};
				
				component.imgFSPlayer.init(options);
			});
		},
		showAddModelDlg : function(){
			_this.data.model = {};
			var d = dialog({
			    title: '增加模特',
			    content: _this.tpl.dlgAddModel.render(),
			    onshow : function(){
					_this.initUploader();
			    },
			    onclose : function(){

			    },
			    okValue : '确定',
			    ok : function(){
                    $('#add_model_panel').find('input').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		_this.data.model[$this.attr('name')] = $this.val();
                    	}
                    });
                    $('#add_model_panel').find('select').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		_this.data.model[$this.attr('name')] = $this.val();
                    	}
                    });

                    _this.data.model['bwh'] = '';
                    if (_this.data.model.b) {
                    	_this.data.model['bwh'] += _this.data.model.b;
                    }
                    if (_this.data.model.w) {
                    	_this.data.model['bwh'] += _this.data.model.w;
                    }
                    if (_this.data.model.h) {
                    	_this.data.model['bwh'] += _this.data.model.h;
                    }

                    model.profile = _this.data.profile;
                    $.ajax({
						type : 'post',
						url : '/model/create',
						data : _this.data.model,
						success : function(result){
							_this.queryData = {
								pageNo : 1,
								pageSize : 15
							};
							_this.search();
						}
					});
                 
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		viewModelAlbum : function(){
			var modelId = $(this).attr('data-id');
			
			$.ajax({
            	//url: '/album/benifit',
            	url: '/album/queryByModelId',
                type: 'POST',
                data: {modelId : modelId, pageNo : 1, pageSize : 15},
                success : function(result){
                	if (result != null && result.success) {
						if(!result.data.list || result.data.list.length == 0){
							util.dialog.infoDialog('该模特暂未上传写真');
							return;
						}

						var albumList = result.data.list;
						_this.data.imgList = [];
						for(var index in albumList){
							var album = albumList[index];
							_this.data.imgList.push(_this.data.host + album.pic);
						}


                		var data = {list: result.data.list, host : _this.data.host};
                		
                		var d = dialog({
						    title: '查看模特写真',
						    content: _this.tpl.dlgViewAlbum.render(data),
						    okValue : '确定',
						    width: 680,
						    ok : function(){
						    	var models = {};
						    }
						});
						d.showModal();
        		    }
        		    else {
        		        util.dialog.infoDialog("查询试卷信息失败，请重试。");
        		    }
                }
            });
		},
		delModelTag : function(){
			var modelId = $(this).attr('data-id');
			var d = dialog({
			    title: '信息',
			    content: '确认删除模特标签',
			    width: 200,
			    okValue : '确定',
			    ok : function(){
					$.ajax({
		            	url: '/tag/removeTagOfModel',
		                type: 'POST',
		                data: {modelId : modelId, tagId : _this.data.tagId},
		                success : function(result){
		                	if (result != null && result.success) {
								util.dialog.infoDialog("删除模特标签成功。", _this.search);
		        		    }
		        		    else {
		        		        util.dialog.infoDialog("删除模特标签失败，请重试。");
		        		    }
		                }
		            });
			    },
			    cancelValue : '取消',
			    cancel : function(){

			    }
			});
			d.showModal();	
		},
		addModelTag : function(){
			var modelId = $(this).attr('data-id');
			var d = dialog({
			    title: '信息',
			    content: '确认添加模特标签',
			    width: 200,
			    okValue : '确定',
			    ok : function(){
					$.ajax({
		            	url: '/tag/addTagOfModel',
		                type: 'POST',
		                data: {modelId : modelId, tagId : _this.data.tagId},
		                success : function(result){
		                	if (result != null && result.success) {
								util.dialog.infoDialog("添加模特标签成功。", _this.search);
		        		    }
		        		    else {
		        		        util.dialog.infoDialog("添加模特标签失败，请重试。");
		        		    }
		                }
		            });
			    },
			    cancelValue : '取消',
			    cancel : function(){

			    }
			});
			d.showModal();	
		},

		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
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