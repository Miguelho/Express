var myApp= angular.module('passportLocal');

myApp.controller('LogoutController',function($scope,$auth,$window){//Servicio que recoja datos del formu
	$scope.isAuthenticated = function(){
        $auth.isAuthenticated();
    };
    if($scope.isAuthenticated()){
        $auth.logout()
        .then(function() {
            var url = "http://" + $window.location.host + "/";
            $state.go('logout');
            $window.location.href=url;
        })
        .catch(function(){
        });
    }
});		