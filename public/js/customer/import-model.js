(function(P){
	var _this = null;
	_this = moka.customer.model = {
		searchUrl : '/model/queryList',
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
			_this.tpl.modelListTpl = juicer($('#model_list_tpl').html());
			_this.tpl.dlgAddModel = juicer($('#dlg_add_model').html());
			_this.tpl.dlgAddModels = juicer($('#dlg_add_models').html());
			_this.tpl.dlgEditModel = juicer($('#dlg_edit_model').html());
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
			$('#btn_add_model').click(_this.showAddModelDlg);
			$('#btn_add_models').click(_this.showAddModelsDlg);
			$('#model_list').on('click', '.view-info', _this.showViewModelDlg);
			$('#model_list').on('click', '.view-img', _this.viewModelAlbum);
			$('#model_list').on('click', '.edit', _this.showEditModelDlg);
			


			$('#btn_search').click(function(){
				_this.queryData = {
					pageNo : 1,
					pageSize : 15
				};
				if ($('#create_from').val() && $('#create_from').val() != -2 ) {
					_this.queryData.createFrom = $('#create_from').val();
				}

				if ($('#is_virtual').val() && $('#is_virtual').val() != -2 ) {
					_this.queryData.isVirtual = $('#is_virtual').val();
				}


				if($('#user_id').val()){
					_this.queryData.modelId = $('#user_id').val();
					_this.searchUrl = '/model/queryModelById';
				}else if($('#user_name').val()){
					_this.queryData.name = $('#user_name').val();
					_this.searchUrl = '/model/queryModelByName';
				}else if($('#user_tel').val()){
					_this.queryData.tel = $('#user_tel').val();
					_this.searchUrl = '/model/queryModelByTel';
				}else{
					_this.searchUrl = '/model/queryList';
				}
				_this.search();
			});

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
		showAddModelsDlg : function(){
			var d = dialog({
			    title: '批量增加模特',
			    content: _this.tpl.dlgAddModels.render(),
			    okValue : '确定',
			    ok : function(){
			    	var models = {};
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		showEditModelDlg : function(){
			_this.data.profile = '';
			var modelId = $(this).attr('data-id');
			var model = _this.data.modelMap[modelId];

			var bwh = model.bwh;
			var strs = bwh.split(' ');
			if(strs.length == 3){
				model.b = strs[0];
				model.w = strs[1];
				model.h = strs[2];
			}

			model.host = _this.data.host;
			var d = dialog({
			    title: '编辑模特信息',
			    content: _this.tpl.dlgEditModel.render(model),
			    onshow : function(){
					_this.initUploader();
			    },
			    onclose : function(){

			    },
			    okValue : '确定',
			    ok : function(){
			    	model.id = modelId;
			    	$('#edit_model_panel').find('input').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		model[$this.attr('name')] = $this.val();
                    	}
                    });
                    $('#edit_model_panel').find('select').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		model[$this.attr('name')] = $this.val();
                    	}
                    });

                    model['bwh'] = '';
                    if (model.b) {
                    	model['bwh'] += model.b;
                    }
                    if (model.w) {
                    	model['bwh'] += model.w;
                    }
                    if (model.h) {
                    	model['bwh'] += model.h;
                    }
                   

                    model.password = model.passwd;//停止修改密码

                    model.profile = _this.data.profile;
                    $.ajax({
						type : 'post',
						url : '/model/modify',
						data : model,
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
		showViewModelDlg : function(){
			var modelId = $(this).attr('data-id');
			var model = _this.data.modelMap[modelId];
			model.host = _this.data.host;
			var d = dialog({
			    title: '编辑模特信息',
			    content: _this.tpl.dlgEditModel.render(model),
			    okValue : '确定',
			    ok : function(){
			    	
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
		},
		initUploader : function (){
		    //文件上传控件参数配置
		    var avatar_uploader = new plupload.Uploader({
		        runtimes : 'html5,flash',
		        browse_button : 'dlg_btn_upload', //选择文件按钮ID 
		        max_file_size : '5mb',  //文件上传最大值
		        multipart : true,
		        chunks : false,//不分块上传
		        unique_names : true,  // 上传的文件名是否唯一,只有在未进行分块上传时文件名唯一才有效
		        url: '/upload/img', //提交到后台的url地址
		        flash_swf_url: '/js/lib/plupload/plupload.flash.swf',//plupload.flash.swf文件所在路径
		        multi_selection : false,
		        filters: [
		              {title: "document", extensions: "jpg,png"}
		        ],
		        init : {
		            FileUploaded : function(up, file, info) {
		            	console.log(arguments);
		                avatar_uploader.disableBrowse(false);
		                //$('#btn_upload_paper').html('<span class="paper-upload-btn">本地上传</span>');
		                var data = eval('('+info.response+')');
		                if (data.success == false) {
		                	util.dialog.errorDialog('上传失败');
		                    //messageDialog(errorCode[data.resultCode]);
		                    return;
		                }else{
		                	_this.data.profile = data.data.name;
		                	$('.dlg-avator').find('img').attr('src', _this.data.host + _this.data.profile );
		                }
		                
		            },
		            FilesAdded : function(up, files){
		                avatar_uploader.start();
		            },
		            BeforeUpload : function(up, file){
		                avatar_uploader.disableBrowse(true);
		            },
		            UploadProgress : function(up, file) { 
		                $('.paper-upload-btn').text('已上传'+file.percent+'%');
		                if(file.percent === 100){
		                	$('.paper-upload-btn').text('文件处理中...');
		                }
		            },
		            Error : function(up, err) {
		                avatar_uploader.disableBrowse(false);
		                up.refresh(); // Reposition Flash/Silverlight
		            }
		        }
		    });
			avatar_uploader.init();
		}
	};
}(moka));