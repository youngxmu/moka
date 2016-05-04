(function(P){
	var _this = null;
	_this = P.admin.question.list = {
		searchUrl : '/question/list',
		tpl : {
			questionListTpl : null
		},
		data : {
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function() {
			_this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			_this.tpl.dlgEditQuestionTpl = juicer($('#dlg-edit-question-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('.nav').on('click', 'span', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var mid = $this.attr('data-id');
				_this.initView(mid);
				// _this.queryData.mid = $this.attr('data-id');

				// _this.search();
			});
			$('#main_list').on('click', '.twop-nav span', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var mid = $this.attr('data-id');
				_this.queryData.mid = $this.attr('data-id');
				_this.search();
			});

			$('#btn_commit').on('click', _this.commit);
			$('#btn_add').on('click', _this.onAdd);

			$('body').on('click', '.btn-op.add', function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}
				var $dd = $(this).siblings('.option-panel');
				var length = $dd.find('p').length;
				var index = length + 1;
				var word = util.getOption(index);
				var html = '<p><em>' + word + '</em>:<input></p>';
				$dd.append(html);
				if(index > 2){
					$(this).siblings('.del').removeClass('disabled');
				}
				if(index > 9){
					$(this).addClass('disabled');
				}
			});
			
			$('body').on('click', '.btn-op.del', function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}
				var $dd = $(this).siblings('.option-panel');
				var length = $dd.find('p').length;
				if(length > 2){
					$dd.find('p').last().remove();
				}

				if(length == 3){
					$(this).addClass('disabled');
				}
				if(length == 9){
					$(this).siblings('.add').removeClass('disabled');
				}
			});
		},
		onAdd : function(){
			var d = dialog({
			    title: '新建题目',
			    content: _this.tpl.dlgEditQuestionTpl.render(),
			    okValue : '确定',
			    onshow: function(){
			    },
			    ok : function(){
					var user = {};
                    $('#edit_user_panel').find('input').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		user[$this.attr('name')] = $this.val();
                    		console.log($this.val());
                    	}
                    });
                    $('#edit_user_panel').find('select').each(function(){
                    	var $this = $(this);
                    	if($this.val()){
                    		user[$this.attr('name')] = $this.val();
                    		console.log($this.val());
                    	}
                    });
            		user.week = _this.queryData.week;
                    $.ajax({
						type : 'post',
						url : '/gsw/admin/uedit',
						data : user,
						success : function(result){
							_this.search();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		addQuestion : function(){

		},
		editQuestion : function(){

		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#question_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			var data = result.data;
		    $('#question_list').html(_this.tpl.questionListTpl.render(data));

			var userList = data.list;
			for(var index in userList){
				var user = userList[index];
				_this.data.userMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#question_list').html(P.building);
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
		                    if (_this.instance_papers == null)
		                    	_this.instance_papers = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#question_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#question_list').html(_this.tpl.questionListTpl.render(data));
										var userList = data.list;
										for(var index in userList){
											var user = userList[index];
											_this.data.userMap[user.id] = user;
										}
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
		}
	};
}(moka));