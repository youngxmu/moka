(function(P){
	var _this = null;
	_this = P.admin.vote.list = {
		searchUrl : 'admin/vote/list',
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {},
			questionMap : {}
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
			_this.tpl.dlgEditQuestionTpl = juicer($('#dlg-edit-question-tpl').html());
			// component.chart.init();
			// P.admin.question.import.init();
		},
		initEvent : function(){
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

			$('body').on('click', '.btn-add-questions', _this.onAddQuestions);
			$('body').on('click', '.btn-edit-questions', _this.onEditQuestions);

			$('body').on('click', '.nav-tabs li', function(){
				var $this = $(this);
				$this.addClass('active').siblings('li').removeClass('active');
				if($this.attr('data-type') == 1){
					_this.searchUrl = 'admin/vote/list';
				}else{
					_this.searchUrl = 'admin/vote/outlist';
				}
				_this.queryData = {
					pageNo : 1,
					pageSize : 10
				};
				_this.search();
			});
			$('body').on('change', '#question_type', function(){
				var $this = $(this);
				if($this.val() == 2 || $this.val() == 3){
					$('.question-option').show();
				}else{
					$('.question-option').hide();
				}
			});
		},
		onAdd : function(){
			var paper = {
				questionListTpl : $('#question-list-tpl').html(),
				questionListData : {list:[]}
			}
			_this.paper = null;
			var d = dialog({
			    title: '新建测评',
			    content: _this.tpl.dlgEditPaperTpl.render(paper),
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
			_this.data.questionMap = {};
			for(var index in paper.questions){
				var q = paper.questions[index];
				_this.data.questionMap[q.id] = q;
			}
			_this.paper = paper;
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
		onAddQuestions : function(){
			var d = dialog({
			    title: '新建题目',
			    content: _this.tpl.dlgEditQuestionTpl.render(),
			    okValue : '确定',
			    ok : function(){
					var user = {};
					var questionType = $('#question_type').val();
					var questionBody = $('#question_body').val();
					var questionRtanswer = $('#question_rtanswer').val();

					var answer = '';
					if(questionType == 2 || questionType == 3){
						var answerArr = [];
						var $inputs = $('.question-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

    				var question = {
    					qbody : questionBody,
    					qtype : questionType,
    					qanswer : answer,
    					rtanswer : questionRtanswer 
    				};

                    $.ajax({
						type : 'post',
						url : 'admin/question/vote/save',
						data : question,
						success : function(result){
							if(result.success){
								var id = result.data.insertId;
								$.ajax({
									type : 'post',
									url : 'admin/question/detail/' + id,
									data : question,
									success : function(result){
										var questions = [];
										if(result.success){
											if(_this.paper){
												questions = _this.paper.questions;
											}
											questions.push(result.question);
											var html = _this.tpl.questionListTpl.render({list: questions});
											$('#paper_questions').find('dd').html(html);
										}else{
											util.dialog.infoDialog('创建题目出错，请重试');
										}
									}
								});
							}else{
								util.dialog.infoDialog('创建题目出错，请重试');
							}
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		onEditQuestions : function(){
			var $this = $(this);
			var id = $this.attr('data-id');

			var question = _this.data.questionMap[id];
			var d = dialog({
			    title: '编辑题目',
			    content: _this.tpl.dlgEditQuestionTpl.render(question),
		     	onshow: function(){
		     		$('#question_type').val(question.qtype);
		     		if(question.qtype == 2 || question.qtype == 3){
		     			var answerArr = question.qanswer.split(',');
						var html = '';

						for(var i in answerArr){
							var index = parseInt(i) + 1;
							var word = util.getOption(index);
							html += '<p><em>' + word + '</em>:<input value="' + answerArr[i] + '"></p>';
						}
						$('.option-panel').html(html);
		     			$('.question-option').show();
		     		}
		     		
			    },
			    okValue : '确定',
			    ok : function(){
					var questionType = $('#question_type').val();
					var questionBody = $('#question_body').val();
					var questionRtanswer = $('#question_rtanswer').val();

					var answer = '';
					if(questionType == 2 || question.qtype == 3){
						var answerArr = [];
						var $inputs = $('.question-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

					question.qbody = questionBody;
					question.qtype = questionType;
					question.qanswer = answer;
					question.rtanswer = questionRtanswer;

                    $.ajax({
						type : 'post',
						url : 'admin/question/vote/save',
						data : question,
						success : function(result){
							if(result.success){
								$.ajax({
									type : 'post',
									url : 'admin/question/detail/' + id,
									data : question,
									success : function(result){
										var questions = [];
										if(result.success){
											if(_this.paper){
												questions = _this.paper.questions;
											}
											for(var index in questions){
												var q = questions[index];
												if(q.id == id){
													questions[index] = result.question;
													_this.data.questionMap[q.id] = q;
													break;
												}
											}
											_this.paper.questions = questions;
											var html = _this.tpl.questionListTpl.render({list: questions});
											$('#paper_questions').find('dd').html(html);
										}else{
											util.dialog.infoDialog('修改题目出错，请重试');
										}
									}
								});
							}else{
								util.dialog.infoDialog('修改题目出错，请重试');
							}
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