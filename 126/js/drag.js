
// 拖拽模块
define(function(require, exports, module){

	function drag(obj){

	    var disX = 0, disY = 0;
	    var rangeModel = require('range.js');

	     obj.onmousedown = function(e){

	        var e = e || window.event;
	        disX = e.clientX - obj.offsetLeft;
	        disY = e.clientY - obj.offsetTop;

	        document.onmousemove = function(e){
	        	var e = e || window.event;
	            var l = rangeModel.range(e.clientX - disX, document.documentElement.clientWidth - obj.offsetWidth,0);
	            var t = rangeModel.range(e.clientY - disY, document.documentElement.clientHeight - obj.offsetHeight,0);
	            obj.style.left = l + "px";
	            obj.style.top = t + "px";
	        };

	        document.onmouseup = function(){
	            document.onmousemove = null;
	            document.onmouseup = null;
	        };
	     }
	}

	// 公开接口 注意带参
    exports.drag = drag;
});