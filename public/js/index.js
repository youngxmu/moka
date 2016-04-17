(function(P){
	var _this = null;
	_this = P.index = {
		searchUrl : '/article/queryArticleByMenu',
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
			_this.tpl.articleListTpl = juicer($('#article_list_tpl').html());
			_this.initEvent();
			_this.loadList();
		},
		initEvent : function(){
		},
		loadList : function(){
			var $thps = $('.thp');
			$thps.each(function(){
				var $this = $(this);
				var id = $this.attr('data-id');
				var $panel = $this.find('.thp-list');
				var sendData = _this.queryData;
				sendData.mid = id;
				$.ajax({
					type : 'post',
					url : _this.searchUrl,
					data : sendData,
					beforeSend : function(){
						$panel.html(util.loadingPanel);
					},
					success : function(result){
						var data = result.data;
					    $panel.html(_this.tpl.articleListTpl.render(data));
						var totalCount = data.totalCount;
						if(totalCount == 0){
							$panel.html(P.building);
							return;
						}
					}
				});
			});
		},
		getMD : function(dateStr){
			var sa1 = dateStr.split(' ')[0];
			var sa2 = sa1.split('-');
			return sa2[1] + '-' + sa2[2];
		}
	};
}(moka));
juicer.register('getMD', moka.index.getMD);