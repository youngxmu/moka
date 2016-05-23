(function(P){
	var _this = null;
	_this = moka.album.benifit = {
		searchUrl : '/album/benifit',
		tpl : {
			albumListTpl : null,
			dlgAlbumSendTpl : null
		},
		data : {
			album : {},
			albumMap : {},
			imgList : {},
			imgMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 21
		},
		init : function(){
			_this.tpl.albumListTpl = juicer($('#album_list_tpl').html());
			_this.tpl.dlgAlbumSendTpl = juicer($('#dlg_album_send_tpl').html());

			
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
			$('#album_list').on('click', '.album-box', function(){
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
				$('.header-player-fs').append('<a id="btn_send_album" class="btn_round_blue30" href="javascript:void(0);">发送福利</a>');
			});

			$('body').on('click', '#btn_send_album', function(){
				var dd = dialog({
				    title: '信息',
				    content: '确认发送系统福利',
				    width : 240,
				    okValue : '确定',
				    zIndex : 11111,
				    ok : function(){
				    	var album = _this.data.albumMap[_this.data.currBenifitId];
				    	var albumId = album.album_id;
				    	

				    	$.ajax({
							type : 'post',
							url : '/album/benifit/send',
							data : {benifitId : _this.data.currBenifitId, albumId : albumId},
							success : function(result){
								if(result.success){

									$('#img_fs_panel').remove();
									_this.queryData = {
										pageNo : 1,
										pageSize : 21
									};
									_this.search();
								}else{
									util.dialog.errorDialog('发送福利出错');
									return false;
								}
							}
						});
				    },
				    cancelValue : '取消',
				    cancel : function(){

				    }
				});
				dd.showModal();
			});


			// $('#album_list').on('click', '.view-img', _this.showAlbum);

			$('#btn_search').click(function(){
				_this.queryData = {
					pageNo : 1,
					pageSize : 21
				};
				_this.search();
			});
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#album_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			var data = result.data;
			data.host = _this.data.host;
		    $('#album_list').html(_this.tpl.albumListTpl.render(data));

			var albumList = data.list;

			_this.data.imgList = [];
			for(var index in albumList){
				var album = albumList[index];
				_this.data.albumMap[album.id] = album;
				_this.data.imgList.push(_this.data.host + album.pic);
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
		                    	url : _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#album_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                        		data.host = _this.data.host;
		                		        $('#album_list').html(_this.tpl.albumListTpl.render(data));
										var albumList = data.list;
										_this.data.imgList = [];
										for(var index in albumList){
											var album = albumList[index];
											_this.data.albumMap[album.id] = album;
											_this.data.imgList.push(_this.data.host + album.pic);
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