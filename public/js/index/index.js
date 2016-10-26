(function(P){
	var _this = null;
	_this = P.index = {
		infoSearchUrl : 'index/res/list',
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
			_this.tpl.msgListTpl = juicer($('#msg_list_tpl').html());

			_this.tpl.newsListTpl = juicer($('#news_list_tpl').html());
			_this.tpl.picListTpl = juicer($('#pic_list_tpl').html());

			_this.initEvent();
			_this.loadNews();
			_this.loadMsg();
			_this.loadInfos();
		},
		initEvent : function(){
			$('body').on('keydown','#keyword',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		          	var keyword = $('#keyword').val();
					window.location.href = 'resource/list?keyword=' + keyword;
		        }
		    });
			$('#btn_search').click(function(){
				var keyword = $('#keyword').val();
				window.location.href = 'resource/list?keyword=' + keyword;
			});
		},
		loadNews : function(){
			var $panel = $('#pic');
			var $gfjydt = $('#gfjydt');
			$.ajax({
				type : 'post',
				url : 'index/news',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
					$gfjydt.html(util.loadingPanel);
				},
				success : function(result){
					if(result.success){
						var data = result.data;
						$panel.html(_this.tpl.picListTpl.render(data));
						$gfjydt.html(_this.tpl.newsListTpl.render(data));
						$('.pic-panel').slick({
							autoplay : true,
							dots : true,
							dotsClass : 'slick-dots'
						});
							
					}
				}
			});
		},
		/* 加载通知 */
		loadMsg : function(){
			var $panel = $('#gfjy');
			var sendData = _this.queryData;
				sendData.mid = 9;
			var tpl = _this.tpl.msgListTpl;
			// var searchUrl = 'index/gfjy';
			var searchUrl = 'index/msgs';
			$.ajax({
				type : 'post',
				url : searchUrl,
				data : sendData,
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(result){
					var data = result.data;
				    $panel.html(tpl.render(data));
				}
			});
		},
		loadInfos : function(){
			for(var i = 1;i<=6;i++){
				_this.loadInfo(i);
			}
		},
		loadInfo : function(key){
			var tpl = _this.tpl.articleListTpl;
			var $panel = $('#info' + key);
			var sendData = {
				moduleId : key,
				pageSize : 7,
				pageNo : 1
			}
			$.ajax({
				type : 'post',
				url : _this.infoSearchUrl,
				data : sendData,
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(result){
					var data = result.data;
				    $panel.html(tpl.render(data));
					var totalCount = data.list.length;
					if(totalCount == 0){
						$panel.html(P.building);
						return;
					}
				}
			});
		},
		getMD : function(dateStr){
			if(!dateStr){
				return '';
			}
			var sa1 = dateStr.split(' ')[0];
			var sa2 = sa1.split('-');
			return sa1;
		},
		getMDH : function(dateStr){
			if(!dateStr){
				return '';
			}
			var sa1 = dateStr.split('T')[0];
			var sa2 = sa1.split('-');
			return sa1;
		}
	};
}(moka));
juicer.register('getMD', moka.index.getMD);
juicer.register('getMDH', moka.index.getMDH);