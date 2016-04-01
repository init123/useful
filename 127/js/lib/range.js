
// 限定拖拽的范围模块
define([], function(){

	return {

		range: function(inum, imax, imin){

			if(inum > imax){
	            return imax;
	        }else if(inum < imin){
	            return imin;
	        }else{
	            return inum;
	        }
		}
	};
});