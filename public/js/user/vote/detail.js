(function(P){
	var _this = null;
	_this = P.user.vote.detail = {
		init : function(){
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.initQuestions();
		},
		initData : function(){
			_this.pid = $('#pid').val();
			console.log(_this.pid);
		},
		initEvent : function(){
			$('body').on('click', '.qanswer-panel.m .qanswer', function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
				}else{
					$this.addClass('selected');
				}
			});

			$('body').on('click', '.qanswer-panel.s .qanswer', function(){
				var $this = $(this);
				if(!$this.hasClass('selected')){
					$this.addClass('selected').siblings('.qanswer').removeClass('selected');
				}else{
					$this.removeClass('selected');
				}
			});

			$('body').on('click', '#btn_commit', _this.commit);

			$('body').on('click', '#btn_confirm', _this.confirm);
		},
		initQuestions : function(){
			$.ajax({
				url : 'vote/detail/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						_this.questions = data.vote.questions;
						_this.questionsMap = {};
						for(var index in _this.questions){
							var question = _this.questions[index];
							_this.questionsMap[question.id] = question;
						}
						$('#question_panel').html(_this.questionListTpl.render({list:data.vote.questions}));
					}else{
						alert(data.msg);
					}
				}
			});
		},
		confirm : function(){
	    	var answerArr = [];
	    	var $li = $('#question_panel').find('.question-list.active');
	    	var qid = $li.attr('data-id');
	    	var question = _this.questionsMap[qid];
	    	var answers = $li.find('.qanswer.selected');
	    	var answer = '';
    		answers.each(function(){
    			answer += $li.attr('data-answer');
    		});
    		if(answer == ''){
    			alert('还未选择答案');
    			return;
    		}
    		// if(answer == question.rtanswer){
    		// 	alert('答对啦');
    		// }else{
    		// 	alert('答错了');
    		// }
    		var $next = $li.next('.question-list');

    		if($next.length == 1){
    			$next.addClass('active').siblings('.question-list').removeClass('active');
    		}else{
    			_this.commit();
    		}
	    },
	    commit : function(){
	    	var answerArr = [];
	    	var $lis = $('#question_panel').find('.question-list');
	    	$lis.each(function(){
	    		var answer = '';
	    		var answers = $(this).find('.qanswer.selected');
	    		answers.each(function(){
	    			answer += $(this).attr('data-answer');
	    		});
	    		if(answer != ''){
	    			answerArr.push(answer);		
	    		}
	    	});

	    	if(answerArr.length < $lis.length){
    			alert('还有题目未答');
    			return;
    		}
	    	console.log(answerArr);
	    	$.ajax({
				url : 'vote/commit',
				type : 'post',
				data : {
					id : _this.pid,
					answer : answerArr.join(',')
				},
				success : function(data){
					if(data.success){
						var rtCount = 0;
						var wrCount = 0;
						for(var index in answerArr){
							if(answerArr[index] == _this.questions[index].rtanswer){
								rtCount++;
							}else{
								wrCount++;
							}
						}
						alert('答对' + rtCount +'道,答错' + wrCount + '道');
					}else{
						alert(data.msg);
					}
				}
			});
	    },
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				html += '<div class="qanswer" data-answer="'+ word +'"><em class="chk-box"></em><span class="qtext">' + word + '、' + answerArr[i] + '</span></div>';
			}
			return html;
		}
	};
}(moka));
juicer.register('formatAnswer', moka.user.vote.detail.formatAnswer );