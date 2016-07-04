(function(P){
	var _this = null;
	_this = P.user.vote.detail = {
		init : function(){
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			// _this.showChart();
			_this.initQuestions();
		},
		initData : function(){
			_this.pid = $('#pid').val();
			console.log(_this.pid);

		},
		initEvent : function(){
			$('body').on('click', '.qanswer-panel .qanswer', _this.commit);
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
		commit : function(){
			var $this = $(this);
			var $panel = $this.parent('.qanswer-panel');
			var $list = $this.parent('.qanswer-panel').parent('.question-list');
			var questionId = $panel.attr('data-id');
			var question = _this.questionsMap[questionId];
			var answer = $this.attr('data-answer');
			$.ajax({
				url : 'vote/commit',
				type : 'post',
				data : {
					pid : _this.pid,
					id : questionId,
					answer : answer,
					rtanswer: question.rtanswer
				},
				success : function(data){
					if(data.success){
						var $next = $list.next('.question-list');
						if($next.length == 0){
							_this.showChart();
						}else{
							$next.addClass('active').siblings().removeClass('active');	
						}
					}else{
						alert(data.msg);
					}
				}
			});
		},
	 	// showChart : function(){
	 	// 	$.ajax({
			// 	url : 'vote/history/' + _this.pid,
			// 	type : 'post',
			// 	success : function(data){
			// 		if(data.success){
			// 			var questions = data.vote.questions;
			// 			var historys = data.vote.historys;
						
			// 			var ctx = document.getElementById("myChart").getContext("2d");
			// 			console.log(ctx);
			// 			console.log(Chart);
			// 			var data = {
			// 				labels : ["January"],
			// 				datasets : [
			// 					{
			// 						// fillColor : "rgba(220,220,220,0.5)",
			// 						// strokeColor : "rgba(220,220,220,1)",
			// 						data : [65]
			// 					},
			// 					{
			// 						// fillColor : "rgba(220,220,220,0.5)",
			// 						// strokeColor : "rgba(220,220,220,1)",
			// 						data : [65]
			// 					}
			// 				]
			// 			};
			// 			var options = {};
			// 			new Chart(ctx).Bar(data,options);
			// 		}else{
			// 			alert(data.msg);
			// 		}
			// 	}
			// });
	 	// },

	 	showChart : function(){
	 		$('#main_panel').hide();
	 		$('#chart').show();
			//var colors = ['#AF0202', '#EC7A00', '#FCD200', '#81C714'];
			var myChart = new JSChart('chart', 'bar');
			myChart.setTitleColor('#8E8E8E');
			myChart.setAxisNameX('');
			
			myChart.setAxisColor('#C4C4C4');
			myChart.setAxisNameFontSize(16);
			myChart.setAxisNameColor('#999');
			myChart.setAxisValuesColor('#7E7E7E');
			myChart.setBarValuesColor('#7E7E7E');
			myChart.setAxisPaddingTop(60);
			myChart.setAxisPaddingRight(140);
			myChart.setAxisPaddingLeft(150);
			myChart.setAxisPaddingBottom(40);
			myChart.setTextPaddingLeft(105);
			myChart.setTitleFontSize(11);
			myChart.setBarBorderWidth(1);
			myChart.setBarBorderColor('#C4C4C4');
			myChart.setBarSpacingRatio(50);
			myChart.setGrid(false);
			myChart.setSize(616, 321);
	 		$.ajax({
				url : 'vote/history/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						var questions = data.vote.questions;
						var historys = data.vote.historys;
						var myData = [];
							var question = questions[0];
							var allanswer = question.qanswer;
							var allanswerArr = allanswer.split(',');
							for(var index in allanswerArr){
								var data = [];
								var word = util.getOption(parseInt(index)+1);
								data.push(word);
								var count = 0;
								for(var hindex in historys){
									var history = historys[hindex];
									
									if(history.qid == question.id){
										console.log(history.answer+' ' + word);
										if(history.answer == word){
											count = history.count;
										}
										
									}
								}
								data.push(count);
								myData.push(data);		
							}
							
						myChart.setAxisNameY('%');
						myChart.setTitle('Year-to-year growth in home broadband penetration in U.S.');
						myChart.setDataArray(myData);
						myChart.draw();
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
				html += '<div class="qanswer " data-answer="'+ word +'"><span class="qtext btn btn-success">' + answerArr[i] + '</span></div>';
			}
			return html;
		}
	};
}(moka));
juicer.register('formatAnswer', moka.user.vote.detail.formatAnswer );