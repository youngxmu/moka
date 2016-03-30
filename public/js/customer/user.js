(function(P){
	var _this = null;
	_this = moka.customer.user = {
		searchUrl : '/user/queryList',
		tpl : {
			userListTpl : null//模特列表模板
		},
		data : {
			editUserId : null,
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function(){
			_this.tpl.userListTpl = juicer($('#user_list_tpl').html());

			_this.tpl.dlgAddUser = juicer($('#dlg_add_user').html());
			_this.tpl.dlgUserInfo = juicer($('#dlg_user_info').html());

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
			$('#btn_add_user').click(_this.showAddUserDlg);

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
					_this.queryData.userId = $('#user_id').val();
					_this.searchUrl = '/user/queryUserById';
				}else if($('#user_name').val()){
					_this.queryData.name = $('#user_name').val();
					_this.searchUrl = '/user/queryUserByName';
				}else if($('#user_tel').val()){
					_this.queryData.tel = $('#user_tel').val();
					_this.searchUrl = '/user/queryUserByTel';
				}else{
					_this.searchUrl = '/user/queryList';
				}
				_this.search();
			});

			$('#user_list').on('click', '.info', _this.showUserInfoDlg);


			$('#user_list').on('click', '.edit', _this.showEditUserDlg);
		},
		showAddUserDlg : function(){
			var d = dialog({
			    title: '增加宅男',
			    content: _this.tpl.dlgAddUser.render(),
			    okValue : '确定',
			    ok : function(){
					var user = {};
                    $('#add_user_panel').find('input').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		user[$this.attr('name')] = $this.val();
                    	}
                    });
                    $('#add_user_panel').find('select').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		user[$this.attr('name')] = $this.val();
                    	}
                    });

            
                    $.ajax({
						type : 'post',
						url : '/user/create',
						data : user,
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
		showUserInfoDlg : function(){
			var $this = $(this);
			var userId = $this.attr('data-id');
			var user = _this.data.userMap[userId];
			
			console.log(userId);
			user.host = _this.data.host;
			var d = dialog({
			    title: '宅男信息',
			    content: _this.tpl.dlgUserInfo.render(user),
			    okValue : '确定',
			    ok : function(){
					
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#user_list').html(util.loadingPanel);
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