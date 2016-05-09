(function(P){
	var _this = null;
	_this = P.admin.question.import = {
		searchUrl : '/admin/question/list',
		tpl : {
			dlgTpl : '',
			questionListTpl : '{@each list as obj, index}<div class="question-list"><div class="qtype">${index|formatIndex}.&nbsp;${obj.qtype|getQType}<div class="question-oper"><span data-id="${obj.id}" class="check">选择</span></div></div><div class="qbody">${obj.qbody}</div>{@if obj.qtype == 2}<div class="qanswer">$${obj.qanswer|formatAnswer}</div>{@/if}<div class="rtanswer">正确答案：${obj.rtanswer}</div></div>{@/each}',
			resultListTpl : '{@each list as obj, index}<li data-id="${obj.id}" title="${obj.qbody}">${index|formatIndex}.&nbsp;${obj.qtype|getQType}-${obj.qbody}<em class="del" data-id="${obj.id}">×</em></li>{@/each}'
		},
		data : {
			selectedQestionMap : {},
			questionMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function(options) {
			_this.tpl.questionListTpl = juicer(_this.tpl.questionListTpl);
			_this.tpl.resultListTpl = juicer(_this.tpl.resultListTpl);
			_this.initEvent();
			_this.search();
		},
		initEvent : function(){

			$('#btn_commit').on('click', _this.commit);

			$('body').on('change', '#question_type', function(){
				var $this = $(this);
				console.log($this.val());
				if($this.val() == 2 || $this.val() == 3){
					$('.question-option').show();
				}else{
					$('.question-option').hide();
				}
			});

			$('body').on('click', '.im-question-dlg .check', function(){
				var $this = $(this);
				var qid = $this.attr('data-id');
				if(!_this.data.selectedQestionMap[qid]){
					_this.data.selectedQestionMap[qid] = _this.data.questionMap[qid];
					_this.showSelected();
				}else{
					alert('题目已选择');
				}
			});

			$('body').on('click', '.im-question-dlg .del', function(){
				var $this = $(this);
				var qid = $this.attr('data-id');
				if(_this.data.selectedQestionMap[qid]){
					delete _this.data.selectedQestionMap[qid];
					_this.showSelected();
				}
			});
		},
		showSelected : function(){
			var list = [];
			for(var key in _this.data.selectedQestionMap){
				list.push(_this.data.selectedQestionMap[key]);
			}
			$('#selected_list').html(_this.tpl.resultListTpl.render({list : list}));
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
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#question_list').html(_this.tpl.questionListTpl.render(data));

			var questionList = data.list;
			for(var index in questionList){
				var user = questionList[index];
				_this.data.questionMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#question_list').html(P.building);
				return;
			}

		    if (totalPage <= 1) {
		        $("#question_pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#question_pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_questions == null)
		                    	_this.instance_questions = this;
	
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
										var questionList = data.list;
										for(var index in questionList){
											var user = questionList[index];
											_this.data.questionMap[user.id] = user;
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

juicer.register('formatAnswer', moka.admin.question.import.formatAnswer );