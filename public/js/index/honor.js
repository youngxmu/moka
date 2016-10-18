(function(P){
	var _this = null;
	_this = P.index.honor = {
		searchUrl : 'index/res/list',
		tpl : {},
		data : {
		},
		init : function() {
			_this.tpl.listTpl = juicer($('#list_tpl').html());
			_this.tpl.picTpl = juicer($('#pic_tpl').html());
			_this.initEvent();
			_this.loadHonors();
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});
		},
		loadHonors : function(key, keyValue){
			var $listPanel = $('#list_panel');
			var $picPanel = $('#pic_panel');
			$.ajax({
				type : 'post',
				src : 'index/about/personal',
				beforeSend : function(){
					$listPanel.html(util.loadingPanel);
					$picPanel.html(util.loadingPanel);
				},
				success : function(result){
					if(result.success){
				    	$listPanel.html(_this.tpl.listTpl.render(result));
				    	$picPanel.html(_this.tpl.picTpl.render(result));
					}
					
				}
			});
		}
	};
}(moka));