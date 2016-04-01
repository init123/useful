
/* 
 * 创建对象 [构造函数法] 
*/
function zTransform(_sle, _cfg){

	// 注意作用域
	var that = this;
	
	// 默认配置
	this.cfg = {
		spacing: 30,      // 单行高度[间距]
		step: 3,          // 上下各分配个数
        then: 0,          // 当前位置
		complete : false  // 回调函数
	};

	// 合并配置
	for(var i in _cfg) this.cfg[i] = _cfg[i];

	// 主体元素 高度
	this.ob = (function(selector){
		return document.querySelector(selector);
	})(_sle);

	// 主体元素高度
	this.height = (function(){
		return 0 - (that.ob.clientHeight - that.cfg.spacing * (that.cfg.step * 2 + 1));
	})();

	// 浏览器内核
	this.vendor = (function (){
        var _style = document.createElement('div').style;
        var _vdr = ['-webkit-', '-moz-', '-o-', '-ms-'];
        for(var i in _vdr){
            var _v = _vdr[i] + 'transform';
            if(_style[_v] !== undefined) return _vdr[i];
        }
        return '';
    })();

    // 阻止默认事件
    this.def = function(e){ e.preventDefault(); };

	// 初始值
	var then = 0;
	if(this.cfg.then > 0) then = 0 - (this.cfg.then * this.cfg.spacing);
	this.set(then, 0);

	// 阻止[document]默认的滚动
	document.addEventListener('touchmove', this.def, false);

	// 执行
	this.ob.addEventListener('touchstart', function(e){ that.start(e); }, false);
    this.ob.addEventListener('touchmove', function(e){ that.move(e); }, false);
    this.ob.addEventListener('touchend', function(e){ that.end(e); }, false);
}

// 属性拓展
zTransform.prototype = {

	tfY : 0, startY : 0, endY : 0, moveY : 0, imove : false, lastY : 0,

	// 移除 Doc[document] 的 事件(touchmove)监听(Listener)
	removeDocLit : function(){
		document.removeEventListener('touchmove', this.def, false);
	},

    // 实时获取位移值
    transformY : function(){

        var _css = this._styles(this.ob), _transform = _css['transform'];
        if(_transform === undefined) _transform = _css[this.vendor + 'transform'];

        var _tmp = _transform.split(',');
        return parseInt(_tmp[1], 10);
    },

    // 设置样式
    set : function(y, t){

    	this.ob.style.cssText = this.vendor + 'transition:all '+ t +'s linear;'+ this.vendor +'transform:translate3d(0px, '+ y +'px, 0px);';
    },

    // 指向元素
    goon : function(i, t){

        var y = 0 - (i * this.cfg.spacing);
        this.set(y, t);
    },

    // 开始
    start : function(ev){

    	this.tfY = this.transformY();
        this.startY = ev.touches[0].pageY;
    },

    // 滑动
    move : function(ev){

        // 证明滑动
        this.imove = true;

        // 滑动结束值
    	this.endY = ev.touches[0].pageY;

        // 滑动过程距离
        this.moveY = this.endY - this.startY;

        // 元素位移距离(四舍五入取整)
        var _trfY = Math.round(this.moveY + this.tfY);

        // 边界取值范围
        if(_trfY > 0) _trfY = 0;
        if(_trfY < this.height) _trfY = this.height;

        // 位移操作
        this.set(_trfY, 0.001);

        // 后补值
        var _stpY = Math.round((this.moveY + this.tfY) / this.cfg.spacing) * this.cfg.spacing;
        this.lastY = _stpY - _trfY;
    },

    // 结束
    end : function(){

        // 滑动状态
    	if(this.imove){

            // 归整位移距离计算
            var _trfY = Math.round((this.transformY() + this.lastY) / this.cfg.spacing) * this.cfg.spacing;
           
            // 边界取值范围
            if(_trfY > 0) _trfY = 0;
            if(_trfY < this.height) _trfY = this.height;

            // 滑动结束时归整(即位移不整除时补全)
            this.set(_trfY, 0.1);

            // 处理回调
            if(this.cfg.complete !== false) this.cfg.complete.call(null, (0 - (this.transformY() / this.cfg.spacing) + this.cfg.step));

            // 重置移动标识
            this.imove = false;
        }
        
        return false;
    },

    // 刷新重置
    reFresh :function(){
        this.height = 0 - (this.ob.clientHeight - this.cfg.spacing * (this.cfg.step * 2 + 1));
        this.moveY = 0;
        this.set(0, 0);
    },

    // 格式化样式
    _styles : function (){
        var txt = this.ob.style.cssText;
        if(txt.length > 0){
            txt = txt.replace(/; /g, ';').replace(/: /g, ':').replace(/, /g, ',');
            var arr = txt.split(';'), _json = {};
            for(var i in arr){
                if(arr[i].length > 0){
                    var _tmp = arr[i].split(':');
                    _json[_tmp[0]] = _tmp[1];
                }
            }
            return _json;
        }
        return false;
    }
};