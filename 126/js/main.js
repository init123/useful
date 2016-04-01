
// 入口模块
define(function(require, exports, module){

    var $id = function(_id){ return document.getElementById(_id); }

    // 加载模块 传参调用方法
    var eDrag = $id('j-drag');
    require('drag.js').drag(eDrag);

    $id('j-btn').onclick = function(){

    	// 显示隐藏区域
    	var eArea = $id('j-area');
        eArea.style.display = 'block';
        eDrag.style.display = 'block';

        // 加载模块 传参调用方法
        require('scale.js').scale(eArea, $id('j-scale'));
    }
});