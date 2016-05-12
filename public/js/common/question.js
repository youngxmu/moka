var question = {
	type : {
		1 : '填空题',
		2 : '选择题',
		2 : '多项选择题'
	},
	getQType : function(qtype){
		var typeName = question.type[qtype];
		if(!typeName){
			typeName = '其它';
		}
		return typeName;
	}
};

var util = {
	_word : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
	getOption : function(index){
		if(index > 0){
			index = index - 1;
		}
		return util._word[index];
	}
}
juicer.register('getQType', question.getQType);