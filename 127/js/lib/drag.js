
// 拖拽模块
define(['range'], function(_range){

	return {

		isTrue : false,

		drag: function(obj){

			this.isTrue = true;
			this.console();

			var disX = 0, disY = 0;

		    obj.onmousedown = function(e){

		    	var e = e || window.event;
		        disX = e.clientX - obj.offsetLeft;
		        disY = e.clientY - obj.offsetTop;

		        document.onmousemove = function(e){
		        	var e = e || window.event;
		            var l = _range.range(e.clientX - disX, document.documentElement.clientWidth - obj.offsetWidth,0);
		            var t = _range.range(e.clientY - disY, document.documentElement.clientHeight - obj.offsetHeight,0);
		            obj.style.left = l + "px";
		            obj.style.top = t + "px";
		        };

		        document.onmouseup = function(){
		            document.onmousemove = null;
		            document.onmouseup = null;
		        };
		    }
		},

		console: function(){
			console.log(this.isTrue);
		}
	};
});