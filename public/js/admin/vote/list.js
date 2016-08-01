(function(P){
	var _this = null;
	_this = P.admin.vote.list = {
		searchUrl : 'admin/vote/list',
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.tpl.paperListTpl = juicer($('#paper-list-tpl').html());
			_this.tpl.dlgEditPaperTpl = juicer($('#dlg-edit-paper-tpl').html());
			_this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.search();
			component.chart.init();
			P.admin.question.import.init();
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
			
			$('body').on('click', '.oper .view', _this.onView);
			$('body').on('click', '.oper .edit', _this.onEdit);

			$('body').on('click', '.oper .start', _this.onStart);
			$('body').on('click', '.oper .stop', _this.onStop);
			
			$('body').on('click', '.oper .del', _this.onDel);

			$('body').on('click', '.paper-questions .btn-edit-questions', _this.onEditQuestions);
		},
		onAdd : function(){
			var d = dialog({
			    title: '新建测评',
			    content: _this.tpl.dlgEditPaperTpl.render(),
			    okValue : '确定',
			    ok : function(){
					var paper = {};
					paper.name = $('#paper_name').val();
					paper.description = $('#paper_desc').val();
					var $questions = $('#paper_questions').find('.question-list');
					var qidArr = [];
					$questions.each(function(){
						qidArr.push($(this).attr('data-id'));
					});
					paper.qids = qidArr.join(',');
                    $.ajax({
						type : 'post',
						url : 'admin/vote/save',
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
			console.log(paper);
			if(!paper.questions){
			 	$.ajax({
					type : 'post',
					async : false,
					url : 'admin/vote/detail/' + id,
					success : function(result){
						if(!result.success){
							return false;
						}else{
							paper = result.vote;
							_this.data.paperMap[id] = paper;
						}
					}
				});
			}
			paper.questionListTpl = $('#question-list-tpl').html();
			paper.questionListData = {list: paper.questions};
			var d = dialog({
			    title: '编辑测评',
			    content: _this.tpl.dlgEditPaperTpl.render(paper),
		     	onshow: function(){
		     		
			    },
			    okValue : '确定',
			    ok : function(){
			    	var paper = {};
			    	paper.id = id;
					paper.name = $('#paper_name').val();
					paper.description = $('#paper_desc').val();
					var $questions = $('#paper_questions').find('.question-list');
					var qidArr = [];
					$questions.each(function(){
						qidArr.push($(this).attr('data-id'));
					});
					paper.qids = qidArr.join(',');
                    $.ajax({
						type : 'post',
						url : 'admin/vote/save',
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
			    title: '删除测评',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/vote/del',
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
		onStart : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var status = 1;
			var d = dialog({
			    title: '修改状态',
			    content: '确认修改',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/vote/status',
						data : {id : id, status : status},
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
		onStop : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var status = 0;
			var d = dialog({
			    title: '修改状态',
			    content: '确认修改',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/vote/status',
						data : {id : id, status : status},
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
		onView : function(){
			var paperId = $(this).attr('data-id');
			var options = {
				paperId : paperId,
				chartId : 'canvas'
			}
			component.chart.show(options);
		},

		onEditQuestions : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var paper = _this.data.paperMap[id];
			var options = {
				paper : paper,
				callback : function(qids, questions){
					var html = _this.tpl.questionListTpl.render({list: questions});
					$('#paper_questions').find('dd').html(html);
				}
			};
			P.admin.question.import.show(options);
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
				var paper = paperList[index];
				_this.data.paperMap[paper.id] = paper;
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
											var paper = paperList[index];
											_this.data.paperMap[paper.id] = paper;
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

juicer.register('formatAnswer', moka.admin.vote.list.formatAnswer );