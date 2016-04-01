
// 限定拖拽的范围模块
define(function(require, exports, module){

    function range(inum, imax, imin){

        if(inum > imax){
            return imax;
        }else if(inum < imin){
            return imin;
        }else{
            return inum;
        }
    }

    // 公开接口 注意带参
    exports.range = range;
});