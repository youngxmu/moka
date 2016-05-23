var component = {};
(function(component){
	var _this = null;
	_this = component.imgFSPlayer = {
		panel : 
			'<div id="img_fs_panel" >' +
			'<div class="img-player-fs-mask" ></div>' +
			'<div class="header-player-fs">'+
			'<a id="btn_img_player_fs_close" class="btn_round_blue30" href="javascript:void(0);">关闭</a>'+
			'<a id="btn_img_player_fs_rotate" class="btn_round_blue30" href="javascript:void(0);">旋转</a>'+
			'</div>'+
			'<div id="img_player_fs_panel" class="img-player-fs">'+
	      		'<ul style="text-align:center;padding: 0 5%;width:90%;">'+
	        	    '<li style="float:none;"><img src="/img/ico/loading.gif"></li>'+
	    	    '</ul>'+
	    	    '<div class="page"><span>1</span> / 1</div>'+
				'<a id="btn_fs_prev" class="page_lf" href="javascript:;"></a>'+
				'<a id="btn_fs_next" class="page_rt" href="javascript:;"></a>'+
		  	'</div>'+
		  	'</div>'
		,
		init : function(options){
			var $target = $('#img_player_fs_panel');
			if($target.length == 0){
				$('body').append(_this.panel);
				$target = $('#img_player_fs_panel');
			}

			
				
			var $btnPrev = $('#btn_fs_prev'); 
			var $btnNext = $('#btn_fs_next');
			var imgList = options.imgList;
			var totalCount = imgList.length;
			var currIndex = 1;
			if(options.currIndex){
				currIndex = options.currIndex;
			}
			if(options.renderCallback){
				$target.data('renderCallback', options.renderCallback);
			}
			

			$target.find('.page').html('<span>1</span> / ' + imgList.length);

			$target.data('imgList', imgList);
			$target.data('totalCount', totalCount);
			$target.data('currIndex', currIndex);
			$target.data('btnPrevId', 'btn_fs_prev');
			$target.data('btnNextId', 'btn_fs_next');

			$btnPrev.click(function(){_this.prev($target);});
			$btnNext.click(function(){_this.next($target);});

			$('#btn_img_player_fs_close').click(function(){
				$('#img_fs_panel').remove();
			});
			
			$('#btn_img_player_fs_rotate').click(function(){
				var $img = $target.find('img');
				var className = $img.attr('class');

				if(!className || className == ''){
					className = 'rotate90';
				}else{
					var angle = className.substr(6);
					angle = parseInt(angle, 10) + 90;
					if(angle == 360){
						className = '';
					}else{
						className = 'rotate' + angle;
					}
				}

				$img.attr('class', className);
			});

			_this.renderImg($target);

			$target.show();
			$('#img_fs_panel').show();

		},
		prev : function($target){
			var currIndex = $target.data('currIndex');
			var totalCount = $target.data('totalCount');
			if (currIndex == 1) {
				return;
			} else{
				currIndex--;
				$target.data('currIndex', currIndex);
				_this.renderImg($target);
			}
		},
		next : function($target){
			var currIndex = $target.data('currIndex');
			var totalCount = $target.data('totalCount');

			if (currIndex == totalCount) {
				return;
			} else{
				currIndex++;
				$target.data('currIndex', currIndex);
				_this.renderImg($target);
			}
		},
		renderImg : function($target){
			var currIndex = $target.data('currIndex');
			var imgList = $target.data('imgList');
			var currImgSrc = imgList[currIndex - 1];

			$target.find('img').attr('src', '/img/loading.gif');

			$target.find('.page').find('span').text(currIndex);

			var callback = $target.data('renderCallback');
			if(callback){
				callback(currIndex);
			}
			
			var img = new Image();

	        img.onload = function () {
	            $target.find('img').attr('src', currImgSrc);

	            var $btnPrev = $('#' + $target.data('btnPrevId')); 
				var $btnNext = $('#' + $target.data('btnNextId')); 

				if (currIndex == 1) {
					$btnPrev.addClass('page_lf_first');
				} else{
					$btnPrev.removeClass('page_lf_first');
				}
				if (currIndex == imgList.length) {
					$btnNext.addClass('page_rt_last');
				}else{
					$btnNext.removeClass('page_rt_last');
				}
				
				if(imgList.length == 1){
					$btnPrev.remove();
					$btnNext.remove();
				}

				var width = $target.width();
				var height = $target.height();

				var $li = $target.find('img').parent('li');
				var liWidth = $li.width();
				var liHeight = $li.height();
				if(liHeight < height){
					$li.css('margin-top', (height - liHeight)/2);
				}else{
					$li.css('margin-top', 0);
				}
				
				$('#curr_page_no').text(currIndex);
	        };
	        img.src = currImgSrc;
		}
	};
}(component));
