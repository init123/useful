
// 缩放模块
define(['range'], function(_range){

    return {

        scale: function(obj1, obj2){

            var max = 500, min = 100,
                disX = 0, disY = 0,
                disW = 0, disH = 0;

            obj2.onmousedown = function(e){

                var e = e || window.event;
                    disX = e.clientX;
                    disY = e.clientY;
                    disW = obj1.offsetWidth;
                    disH = obj1.offsetHeight;

                document.onmousemove = function(e){

                    var e = e || window.event;

                    // 加载模块 传参调用方法
                    obj1.style.width = _range.range(e.clientX - disX + disW, max, min) + 'px';
                    obj1.style.height = _range.range(e.clientY - disY + disH, max, min) + 'px';
                };

                document.onmouseup = function(){
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    };
});