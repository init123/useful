// 路径引用配置
require.config({

	paths: {

		drag: './lib/drag',
		scale: './lib/scale',
		range: './lib/range'
	}
});

// 
require(['drag', 'scale', 'range'], function(_drag, _scale, _range){

	var Gi = function(_id){
		return document.getElementById(_id); 
	};

	// 加载模块 传参调用方法
    var eDrag = Gi('j-drag');
    _drag.drag(eDrag);

    Gi('j-btn').onclick = function(){

    	// 显示隐藏区域
    	var eArea = Gi('j-area');
        eArea.style.display = 'block';
        eDrag.style.display = 'block';

        // 加载模块 传参调用方法
        _scale.scale(eArea, Gi('j-scale'));
    }
});