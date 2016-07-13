(function(P){
	var _this = null;
	_this = P.admin.expert.edit = {
		searchUrl : 'expert/result',
		expertId : null,
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		tpl : {

		},
		data : {
		},
		init : function() {
			_this.expertId = $('#expertId').val();
			_this.tpl.resultListTpl = juicer($('#result-list-tpl').html());
			_this.initEvent();

			$('#birthday').datetimepicker({
				language : 'zh-CN',
				startView : 'year',
				format : 'yyyy-mm-dd',
				viewSelect : 2,
	    		minView : 2,
	    		autoclose : true
	    	});
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);
			$('body').on('click', '.nav-tabs li', _this.changeType);
			$('body').on('click', '.oper .del',_this.onDel);
		},
		changeType : function(){
			var $this = $(this);
			if(!_this.expertId){
				$('#info_panel').show();
				return;
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var type = $this.attr('data-type');
			$('#info_panel').hide();
			$('#list_panel').hide();
			if(type == 1 ){
				$('#info_panel').show();
			}

			if(type == 2){
				_this.queryData.id = _this.expertId;
				_this.queryData.type = 1;
				_this.loadRes();
				$('#list_panel').show();	
			}
			if(type == 3){
				_this.queryData.id = _this.expertId;
				_this.queryData.type = 2;
				_this.loadRes();
				$('#list_panel').show();
			}
		},
		commit : function() {
			var data = {};
			var $inputs = $('#info_panel').find('input,select,textarea');
			$inputs.each(function(){
				var $this = $(this);
				var key = $this.attr('id');
				var value = $this.val();
				data[key] = value;
			});



			if(_this.expertId != null){
				data.id = _this.expertId;
			}

			$.ajax({
				url : 'admin/expert/save',
				type : 'post',
				data : data,
				success : function(result){
					if(!result.success){
						util.dialog.errorDialog('提交失败请重试');
						return;
					}
					util.dialog.infoDialog('提交成功');
					if(result.data && result.data.insertId){
						window.location.href = 'admin/expert/edit/' + result.data.insertId;
					}
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},
		loadRes : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#resource_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#resource_list').html(_this.tpl.resultListTpl.render(data));
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
		                    if (_this.instance_xs == null)
		                    	_this.instance_xs = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#resource_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#resource_list').html(_this.tpl.resultListTpl.render(data));
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
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var d = dialog({
			    title: '删除测评',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/expert/result/del',
						data : {id : id},
						success : function(result){
							_this.loadRes();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		}
	};
}(moka));