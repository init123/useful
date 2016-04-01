
/*
 * 基于jQuery的弹窗插件
*/
var popLev = 0, popLen = 0;
function zPopups(target, group, cfg){

	// 弹窗ID
	this.chr = 'j-pop-' + group;

	var that = this;

	// 生成唯一标识(防止多个日历时冲突)
	this.rand = (Math.random() - Math.random() + '').substring(3, 5);

	// 默认配置
	this.cfg = {
		skin: 'skin',
		position: 'fixed',
		other: true,
		zIndex: 888,
		width: 500,
		title: 'Title',
		content: '',
		init: false,
		sure: {txt:'sure'},
		cancel: {txt:'cancel'},
		close: false
	};

	// 合并配置
	for(var i in cfg) this.cfg[i] = cfg[i];

	// 点击开启
	$(document.body).on('click', target, function(){

		popLen++;

		// 获取参数
		var param = $(this).attr('data-param');
		if(param === undefined) param = null;

		// 其他
		if(that.cfg.other === false){
			$('.j-pop-win').filter(function(){
				return $(this).attr('id') !== that.chr;
			}).hide();
		}

		// 内容
		that.doContent(true, param);

		// 初始化动态
		if(that.cfg.init) that.cfg.init.call(null, $('#' + that.chr + ' input.pop-char:first').val());

		// 操作蒙版层级
		that.doLevel('o');

		return false;
	});

	// 点击关闭
	$(document.body).on('click', '#' + this.chr + ' a.j-pop-close:first', function(){

		popLen--;

		// 内容
		that.doContent(false);

		// 回调
		if(that.cfg.close) that.cfg.close.call(null, $('#' + that.chr + ' input.pop-char:first').val());

		// 操作蒙版层级
		that.doLevel('c');

		return false;
	});

	// 点击确认
	$(document.body).on('click', '#' + this.chr + ' a.j-pop-sure:first', function(){

		popLen--;

		// 内容
		that.doContent(false);

		// 回调
		if(that.cfg.sure.func) that.cfg.sure.func.call(null, $('#' + that.chr + ' input.pop-char:first').val());

		// 操作蒙版层级
		that.doLevel('c');

		return false;
	});

	// 点击取消
	$(document.body).on('click', '#' + this.chr + ' a.j-pop-cancel:first', function(){

		popLen--;

		// 内容
		that.doContent(false);

		// 回调
		if(that.cfg.cancel.func) that.cfg.cancel.func.call(null, $('#' + that.chr + ' input.pop-char:first').val());

		// 操作蒙版层级
		that.doLevel('c');

		return false;
	});
}

zPopups.prototype = {

	mask: 'j-mask',
	level: 'j-pop-level',

	doLevel: function(switchs){

		var _zindex = [];
		$('.j-pop-win').each(function(){
			var _then = $(this);
			if(!_then.is(':hidden')){
				_zindex.push(Math.floor(_then.attr('data-zi')));
			}
		});

		// 蒙版 和 层级
		var _mask = $('#' + this.mask);

		// 关闭或取消
		if(switchs === 'c'){

			if(_zindex.length > 0){
				_zindex.sort();
				_mask.css('z-index', (_zindex.pop() - 1)).show();
			}else{
				_mask.hide();
			}

		// 新增
		}else if(switchs === 'o'){

			if(_mask.length === 1){

				if(_zindex.length > 0){

					_zindex.sort();
					var _max = _zindex.pop();
					_mask.css('z-index', (_max + 1)).show();
					$('#' + this.chr).attr('data-zi', (_max + 2)).css('z-index', (_max + 2));
				}

			}else{

				var _css = {'z-index':this.cfg.zIndex,'position':'fixed','top':0,'right':0,'bottom':0,'left':0,'width':'100%','height':'100%','opacity':'0.3','background-color':'#000'};
				$('<div id="'+ this.mask +'"><input value="'+ this.cfg.zIndex +'" type="hidden" id="j-pop-level" /></div>').css(_css).appendTo('body');
			}			
		}
	},

	doContent : function(bool, param){

		var _pop = $('#' + this.chr);

		if(_pop.length === 1){

			if(bool){

				// 修改参数
				_pop.find('input.pop-char:first').val(param);

				_pop.show();

			}else{

				_pop.hide();
			}

		}else{

			// 内容HTML
			var _cnt = this.cfg.content.call(null);

			// 按钮HTML
			var _btn = '';
			if(this.cfg.sure !== false || this.cfg.cancel !== false){

				var _sure = '', _cancle = '';
				if(this.cfg.sure !== false) _sure = '<a href="javascript:void(0);" class="pop-sure j-pop-sure">' + (this.cfg.sure.txt === undefined ? 'sure' : this.cfg.sure.txt) + '</a>';
				if(this.cfg.cancel !== false) _cancle = '<a href="javascript:void(0);" class="pop-cancel j-pop-cancel">' + (this.cfg.cancel.txt === undefined ? 'cancel' : this.cfg.cancel.txt) + '</a>';
				_btn = '<div class="pop-btn">'+ _sure + _cancle +'</div>';
			}

			if(popLev === 0) popLev = this.cfg.zIndex + 2;


			// 新建
			var _html = '<table data-zi='+ (this.cfg.zIndex + 2) +' style="z-index:'+ (this.cfg.zIndex + 2) +';position:'+ this.cfg.position +';" id="'+ this.chr +'" class="j-pop-win m-popup"><tr>' +
						'<td style="height:100%;text-align:center;">' +
						'<div style="width:'+ this.cfg.width +'px;display:inline-block;*display:inline;*zoom:1;" class="'+ this.cfg.skin +'">' +
						'<input type="hidden" class="pop-char" value="'+ param +'" /><div class="pop-tt">' +
						'<span>'+ this.cfg.title +'</span><a href="javascript:void(0);" class="j-pop-close">&times;</a></div>' + _cnt + _btn
						'</div></td></tr></table>';

			$(_html).appendTo('body');
		}
	}
};