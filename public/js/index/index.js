(function(P){
	var _this = null;
	_this = P.index = {
		infoSearchUrl : 'resource/list',
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
			_this.loadNews();
			_this.loadInfos();
			_this.loadList1();
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
			$.ajax({
				type : 'post',
				url : 'index/news',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						var list = data.list;
						var length = list.length;
						var tpl = juicer($('#news_list_tpl').html());
						$panel.html(tpl.render(data));
						$('.pic-panel').slick({
							autoplay : true,
							dots : true,
							dotsClass : 'slick-dots'
						});
							
					}
				}
			});
		},
		loadInfos : function(){
			var infoDict = {
				info1 : '战争 日本',
				info2 : '法规',
				info3 : '外国',
				info4 : '武器 装备',
				info5 : '形势',
				info6 : '学术 成果'
			};

			
			for(var key in infoDict){
				var keyValue = infoDict[key];
				_this.loadInfo(key, keyValue);
			}
		},
		loadInfo : function(key, keyValue){
			var tpl = _this.tpl.articleListTpl;
			var $panel = $('#' + key);
			var sendData = {
				keyword : keyValue,
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
		loadList1 : function(){
			var $panel = $('#gfjy');
			var sendData = _this.queryData;
				sendData.mid = 9;
			var tpl = _this.tpl.articleListTpl;
			var searchUrl = 'index/gfjy';
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