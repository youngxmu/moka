(function(P){
	var _this = null;
	_this = P.article.edit = {
		articleId : null,
		editor : null,
		data : {
			
		},
		init : function() {
			var $span = $('.u-select-p').find('span');
			if($span.length == 0){
				_this.mid = 0;
			}else{
				_this.mid = $span.last().attr('data-id');
			}
			
			_this.initEvent();
			_this.initEditor();
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);
		},
		initEditor : function(){
			_this.editor = new Simditor({
			  	textarea: $('#editor'),
			  	upload : {
			    	url: '/upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
		},
		commit : function() {
			var content = _this.editor.getValue();
			var title = $('#title').val();
			var author = $('#author').val();
			var url = '/article/save';
			
			var postData = {
				title : title,
				author : author,
				content : content,
				mid : _this.mid
			};

			if(_this.articleId != null){
				postData.id = _this.articleId;
			}

			$.ajax({
				url : url,
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.confirmDialog('继续提交',
						function(){

						},
						function(){
							window.location.href = '/article/detail/' + data.id;
						},
						'提交成功'
					);
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		}
	};
}(moka));