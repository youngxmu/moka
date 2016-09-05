(function(P){
	var _this = null;
	_this = P.user.paper = {
		init : function(){
			$('#nav_llks').addClass('aHover');
		},
		initEvent : function(){
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
	juicer.register('formatAnswer', _this.formatAnswer );
})(moka);

moka.user.paper.init();