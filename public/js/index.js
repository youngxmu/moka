(function(P){
	var _this = null;
	_this = P.index = {
		searchUrl : 'index/queryArticleByMenu',
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
			_this.tpl.paperListTpl = juicer($('#paper_list_tpl').html());
			_this.tpl.paperListTpl3 = juicer($('#paper_list_tpl3').html());
			_this.tpl.paperListTpl4 = juicer($('#paper_list_tpl4').html());
			_this.tpl.paperListTpl5 = juicer($('#paper_list_tpl5').html());

			_this.initEvent();
			_this.loadList1();
			_this.loadList3();
			_this.loadList4();
			_this.loadList5();
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
		loadList : function(){
			var $thps = $('.thp');
			$thps.each(function(){
				var $this = $(this);
				var id = $this.attr('data-id');
				var $panel = $this.find('.thp-list');
				var sendData = _this.queryData;
				sendData.mid = id;
				var tpl = _this.tpl.articleListTpl;
				if(id == 12 || id == 15){
					_this.searchUrl = 'paper/list';
					tpl = _this.tpl.paperListTpl
				}else{
					_this.searchUrl = 'index/queryArticleByMenu';
				}
				$.ajax({
					type : 'post',
					url : _this.searchUrl,
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
			});
		},
		loadList1 : function(){
			var $panel = $('#gfjy');
			var sendData = _this.queryData;
				sendData.mid = 11;
			var tpl = _this.tpl.articleListTpl;
			var searchUrl = 'index/queryArticleByMenu';
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
					var totalCount = data.list.length;
					if(totalCount == 0){
						$panel.html(P.building);
						return;
					}
				}
			});
		},
		loadList3 : function(){
			var $panel = $('#jsll');
			var sendData = _this.queryData;
				sendData.mid = 13;
			var tpl = _this.tpl.paperListTpl3;
			var searchUrl = 'jsll/indexlist';
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
					var totalCount = data.list.length;
					if(totalCount == 0){
						$panel.html(P.building);
						return;
					}
				}
			});
		},
		loadList4 : function(){
			var $panel = $('#jsjn');
			var sendData = _this.queryData;
				sendData.mid = 14;
			var tpl = _this.tpl.paperListTpl4;
			var searchUrl = 'index/queryArticleByMenu';
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
					var totalCount = data.list.length;
					if(totalCount == 0){
						$panel.html(P.building);
						return;
					}
				}
			});
		},
		loadList5 : function(){
			var $panel = $('#paper');
			var sendData = _this.queryData;
				sendData.mid = 15;
			var tpl = _this.tpl.paperListTpl5;
			var searchUrl = 'paper/list';
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
					var totalCount = data.list.length;
					if(totalCount == 0){
						$panel.html(P.building);
						return;
					}
				}
			});
		},
		getMD : function(dateStr){
			var sa1 = dateStr.split(' ')[0];
			var sa2 = sa1.split('-');
			return sa1;
		},
		getMDH : function(dateStr){
			var sa1 = dateStr.split('T')[0];
			var sa2 = sa1.split('-');
			return sa1;
		}
	};
}(moka));
juicer.register('getMD', moka.index.getMD);
juicer.register('getMDH', moka.index.getMDH);