(function(P){
	var _this = null;
	_this = P.admin.index = {
		tpl : {
			articleListTpl : null
		},
		data : {
			userMap : {}
		},
		queryData : {
			pageSize : 5,
			pageNo : 1
		},
		init : function() {
			_this.tpl.newsTpl = juicer($('#news-tpl').html());
			_this.initEvent();
			_this.loadNews();
		},
		initEvent : function(){
			$('#btn_commit').click(_this.commit);
		},
		loadNews : function(){
			var $panel = $('#news_panel');
			$.ajax({
				type : 'post',
				url : 'admin/news',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						var list = data.list;
						var length = list.length;
						while(length < 5){
							length++;
							list.push({
								title : '',
								link : '',
								pic_url : '',
								index : length
							});
						}
						$panel.html(_this.tpl.newsTpl.render(data));	
					}
				}
			});
		},
		commit : function(){
			var $infos = $('.news-edit');
			var newsList = [];
			$infos.each(function(i){
				var index = i+1;
				var $this = $(this);
				var news = {
					title : $this.find('.newstitle').val(),
					link : $this.find('.link').val(),
					pic_url : $this.find('.pic_url').val(),
					index : index
				}
				console.log(news);
				console.log((news.title && news.link && news.pic_url) );
				if(news.title && news.link && news.pic_url ){
					newsList.push(news);	
				}
				
			});
			var $btn = $('#btn_commit');
			$.ajax({
				type : 'post',
				url : 'admin/setnews',
				data : {newsStr: JSON.stringify(newsList)},
				beforeSend : function(){
					$btn.val('正在提交');
				},
				success : function(data){
					if(data.success){
						alert('修改成功');
					}else{
						alert('修改失败');
					}
				},
				complete : function(){
					$btn.val('提交');
				}
			});
		}
	};
}(moka));
