
// 缩放模块
define(function(require, exports, module){

    function scale(obj1, obj2){

    	var max = 500, min = 100,
        	disX = 0, disY = 0,
        	disW = 0, disH = 0,
        	rangeModel = require('range.js');

        obj2.onmousedown = function(e){

            var e = e || window.event;
	            disX = e.clientX;
	            disY = e.clientY;
	            disW = obj1.offsetWidth;
	            disH = obj1.offsetHeight;

            document.onmousemove = function(e){

                var e = e || window.event;

                // 加载模块 传参调用方法
                obj1.style.width = rangeModel.range(e.clientX - disX + disW, max, min) + 'px';
                obj1.style.height = rangeModel.range(e.clientY - disY + disH, max, min) + 'px';
            };

            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }

    // 公开接口 注意带参
    exports.scale = scale;
});