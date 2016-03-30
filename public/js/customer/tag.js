(function(P){
	var _this = null;
	_this = moka.customer.tag = {
		searchUrl : '/tag/queryTags',
		tpl : {
			tagListTpl : null,//模特列表模板
		},
		data : {
			tag : {},
			tagMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function(){
			_this.tpl.tagListTpl = juicer($('#tag_list_tpl').html());
			_this.tpl.dlgAddTag = juicer($('#dlg_add_tag').html());
			_this.tpl.dlgEditTag = juicer($('#dlg_edit_tag').html());

			_this.initEvent();
			_this.search();
		},
		initEvent : function(){
			$('#btn_add_tag').click(_this.showAddTagDlg);
			$('#tag_list').on('click', '.view-info', _this.showViewTagDlg);
			$('#tag_list').on('click', '.view', _this.showTagModels);
			$('#tag_list').on('click', '.edit', _this.showEditTagDlg);
		},
		showAddTagDlg : function(){
			_this.data.tag = {};
			var d = dialog({
			    title: '增加模特',
			    content: _this.tpl.dlgAddTag.render(),
			    okValue : '确定',
			    ok : function(){
			    	var name = $('#add_tag_name').val();
			    	var desc = $('#add_tag_desc').val();

			    	if(!name){
			    		util.dialog.errorDialog('标签名必填');
			    		return false;
			    	}
					if(!_this.isNameExsit(name)){
						util.dialog.errorDialog('标签名已存在');
						return false;
					}

			    	if(!desc){
			    		desc = '';
			    	}
                    $.ajax({
						type : 'post',
						url : '/tag/addTag',
						data : {name:name,desc:desc},
						success : function(result){
							if(result.success){
								util.dialog.infoDialog('添加成功',function(){
									window.location.href = window.location.href;
								});
							}
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		showEditTagDlg : function(){
			var tagId = $(this).attr('data-id');
			var tag = _this.data.tagMap[tagId];
			var d = dialog({
			    title: '编辑模特信息',
			    content: _this.tpl.dlgEditTag.render(tag),
			    okValue : '确定',
			    ok : function(){
			    	var name = $('#edit_tag_name').val();
			    	var desc = $('#edit_tag_desc').val();

			    	if(!name){
			    		util.dialog.errorDialog('标签名必填');
			    		return false;
			    	}
					if(!_this.isNameExsit(name)){
						util.dialog.errorDialog('标签名已存在');
						return false;
					}

			    	if(!desc){
			    		desc = '';
			    	}
                    $.ajax({
						type : 'post',
						url : '/tag/updateTag',
						data : {tagId:tagId,name:name,desc:desc},
						success : function(result){
							if(result.success){
								util.dialog.infoDialog('修改成功',function(){
									window.location.href = window.location.href;
								});
							}
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();	
		},
		showTagModels : function(){
			var tagId = $(this).attr('data-id');
			var tagName = $(this).attr('data-name');
			window.open('/model/tagmanage?tagId=' + tagId + '&tagName=' + tagName);
		},
		isNameExsit : function(name, tagId){
			if(!tagId){
				tagId = -1;
			}
			for(var key in _this.data.tagMap){
				var tag = _this.data.tagMap[key];
				if(tag.name == name && tagId != tag.id)
					return false;
			}

			return true;
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#tag_list').html(util.loadingPanel);
				},
				success : function(result){
					var data = result.data;
		    		$('#tag_list').html(_this.tpl.tagListTpl.render(data));

		    		_this.data.tagMap = {};
		    		for(var index in result.data.list){
		    			var tag = result.data.list[index];
		    			_this.data.tagMap[tag.id] = tag;
		    		}
				}
			});
		}
		
	};
}(moka));