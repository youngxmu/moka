(function(P){
	var _this = null;
	_this = P.user.jsll.list = {
		tpl : {},
		data : {
		},
		init : function() {
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.initEvent();
			_this.data.type = '政策';
			_this.search();
		},
		initEvent : function(){
			$('.nav-ul').on('click', 'li', _this.changeType);
			$('#menu_panel').on('click', 'li', _this.showContent);
		},
		changeType : function(){
			var $this = $(this);
			_this.data.type = $this.attr('data-type');
			$this.addClass('active').siblings().removeClass('active');
			_this.search();
		},
		search : function(){
			$.ajax({
				url : 'jsll/list/' + _this.data.type,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('#menu_panel').html(html);
						_this.listMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.listMap[item.id] = item;
							if(index == 0){
								$('#content').html(item.content);
							}
						}
					}else{
						$('#menu_panel').html('');
						$('#content').html('');			
					}
				}
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			
			var item = _this.listMap[id];
			console.log(item.content);
			$('#content').html(item.content);
		}
	};
}(moka));