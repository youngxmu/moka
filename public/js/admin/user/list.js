(function(P){
	var _this = null;
	_this = P.admin.user.list = {
		searchUrl : 'admin/user/queryList',
		tpl : {
			userListTpl : null//模特列表模板
		},
		data : {
			editUserId : null,
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function(){
			_this.tpl.userListTpl = juicer($('#user_list_tpl').html());
			_this.initEvent();
			_this.search();
		},
		initEvent : function(){
			$('#btn_search').click(function(){
				_this.queryData = {
					pageNo : 1,
					pageSize : 10
				};

				if($('#user_id').val()){
					_this.queryData.userId = $('#user_id').val();
					_this.searchUrl = 'admin/user/queryUserById';
				}else if($('#user_name').val()){
					_this.queryData.name = $('#user_name').val();
					_this.searchUrl = 'admin/user/queryUserByName';
				}else if($('#user_tel').val()){
					_this.queryData.tel = $('#user_tel').val();
					_this.searchUrl = 'admin/user/queryUserByTel';
				}else if($('#user_email').val()){
					_this.queryData.email = $('#user_email').val();
					_this.searchUrl = 'admin/user/queryUserByEmail';
				}else{
					_this.searchUrl = 'admin/user/queryList';
				}
				_this.search();
			});
			$('#user_list').on('click', '.info', _this.showUserInfoDlg);
			$('#user_list').on('click', '.edit', _this.showEditUserDlg);
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#user_list').html('<tr><td colspan=8>' + util.loadingPanel + '</td></tr>');
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			var data = result.data;
		    $('#user_list').html(_this.tpl.userListTpl.render(data));

			var userList = data.list;
			for(var index in userList){
				var user = userList[index];
				_this.data.userMap[user.id] = user;
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
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#user_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#user_list').html(_this.tpl.userListTpl.render(data));
										var userList = data.list;
										for(var index in userList){
											var user = userList[index];
											_this.data.userMap[user.id] = user;
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