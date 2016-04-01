
var noteApp = angular.module('noteApp', []).controller('noteCtrl', function($scope, $http) {

    $scope.message = '请输入';

    $scope.result = function() {
        return 100 - $scope.message.length;
    };
    $scope.clear = function() {
        $scope.message = '';
    };
    $scope.save = function() {

    	// POST提交数据
		$http.post('note.ajax.php', {msg: $scope.message}).success(function(res){
            console.log(res);
        });
    };
    $scope.focus = function() {
    	if($scope.message == '请输入') $scope.message = '';
    };
    $scope.blur = function() {
    	if($scope.message == '') $scope.message = '请输入';
    };
});