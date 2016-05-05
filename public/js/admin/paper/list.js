(function(P){
	var _this = null;
	_this = P.admin.paper.list = {
		searchUrl : '/admin/paper/list',
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function() {
			_this.tpl.paperListTpl = juicer($('#paper-list-tpl').html());
			_this.initEvent();
			_this.search();
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
			$('#s_q_type').on('change', function(){
				var $this = $(this);
				_this.queryData.qtype = $this.val();
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

			$('body').on('change', '#paper_type', function(){
				var $this = $(this);
				console.log($this.val());
				if($this.val() == 2){
					$('.paper-option').show();
				}else{
					$('.paper-option').hide();
				}
			});

			$('body').on('click', '.paper-oper .edit', _this.onEdit);
			
			$('body').on('click', '.paper-oper .del', _this.onDel);
			
		},
		onAdd : function(){
			var d = dialog({
			    title: '新建题目',
			    content: _this.tpl.dlgEditPaperTpl.render(),
			    okValue : '确定',
			    ok : function(){
					var user = {};
					var paperType = $('#paper_type').val();
					var paperBody = $('#paper_body').val();
					var paperRtanswer = $('#paper_rtanswer').val();

					var answer = '';
					if(paperType == 2){
						var answerArr = [];
						var $inputs = $('.paper-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

    				var paper = {
    					qbody : paperBody,
    					qtype : paperType,
    					qanswer : answer,
    					rtanswer : paperRtanswer 
    				};

                    $.ajax({
						type : 'post',
						url : '/admin/paper/save',
						data : paper,
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
		onEdit : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var paper = _this.data.paperMap[id];
			var d = dialog({
			    title: '编辑题目',
			    content: _this.tpl.dlgEditPaperTpl.render(paper),
		     	onshow: function(){
		     		$('#paper_type').val(paper.qtype);
		     		if(paper.qtype == 2){
		     			var answerArr = paper.qanswer.split(',');
						var html = '';

						for(var i in answerArr){
							var index = parseInt(i) + 1;
							var word = util.getOption(index);
							html += '<p><em>' + word + '</em>:<input value="' + answerArr[i] + '"></p>';
						}
						$('.option-panel').html(html);
		     			$('.paper-option').show();
		     		}
		     		
			    },
			    okValue : '确定',
			    ok : function(){
					var paperType = $('#paper_type').val();
					var paperBody = $('#paper_body').val();
					var paperRtanswer = $('#paper_rtanswer').val();

					var answer = '';
					if(paperType == 2){
						var answerArr = [];
						var $inputs = $('.paper-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

					paper.qbody = paperBody;
					paper.qtype = paperType;
					paper.qanswer = answer;
					paper.rtanswer = paperRtanswer;

                    $.ajax({
						type : 'post',
						url : '/admin/paper/save',
						data : paper,
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
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var d = dialog({
			    title: '删除题目',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : '/admin/paper/del',
						data : {id : id},
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
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#paper_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#paper_list').html(_this.tpl.paperListTpl.render(data));

			var paperList = data.list;
			for(var index in paperList){
				var user = paperList[index];
				_this.data.paperMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#paper_list').html(P.building);
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
									$('#paper_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#paper_list').html(_this.tpl.paperListTpl.render(data));
										var paperList = data.list;
										for(var index in paperList){
											var user = paperList[index];
											_this.data.paperMap[user.id] = user;
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
		},
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				console.log(word + ' ' +answerArr[i]);
				html += '<p>' + word + ':' + answerArr[i] + '</p>';
			}
			return html;
		}
	};
}(moka));

juicer.register('formatAnswer', moka.admin.paper.list.formatAnswer );