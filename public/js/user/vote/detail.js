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
	 	showChart : function(){
	 		$.ajax({
				url : 'vote/history/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						var questions = data.vote.questions;
						var historys = data.vote.historys;
						

						var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

				        var randomScalingFactor = function() {
				            return 1;
				        };
				        var randomColorFactor = function() {
				            return Math.round(Math.random() * 255);
				        };
				        var randomColor = function() {
				            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
				        };
						var ctx = document.getElementById("canvas").getContext("2d");
						var data = {
				            labels: ["A", "B", "C", "D"],
				            datasets: [{
				                label: 'a',
				                backgroundColor: [randomColor(),randomColor(),randomColor(),randomColor(),randomColor()],
				                data: [3,2,3,3,0]
				            }]
				        };
        
						var options = {};
						var myBar = new Chart(ctx, {
			                type: 'bar',
			                data: data,
			                width : '400px',
			                options: {
			                    // Elements options apply to all of the options unless overridden in a dataset
			                    // In this case, we are setting the border of each bar to be 2px wide and green
			                    barPercentage : 0.2,
			                    elements: {
			                    	 barPercentage : 0.2,
			                        rectangle: {
			                            borderWidth: 2,
			                            borderColor: 'rgb(0, 255, 0)',
			                            borderSkipped: 'bottom'
			                        }
			                    },
			                    responsive: true,
			                    legend: {
			                        position: 'top',
			                    },
			                    title: {
			                        display: false,
			                        text: 'Chart.js Bar Chart'
			                    }
			                }
			            });

						setTimeout(function(){
							myBar.data.datasets = [{
						                label: 'b',
						                backgroundColor: [randomColor(),randomColor(),randomColor(),randomColor(),randomColor()],
						                data: [1,2,3,4,0]
						            }
						          ];
						          console.log(123);
						          myBar.update();
						}, 2000);	
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