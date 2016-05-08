var myApp= angular.module('passportLocal');

myApp.controller('LogoutController',function($scope,$auth,$state){//Servicio que recoja datos del formu
	$scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
        
    };

    $scope.logout=function(){
    if($scope.isAuthenticated()){
        $auth.logout()
        .then(function() {
            //var url = "http://" + $window.location.host + "/";
            $state.go('logout');
            toaster.info("you have logged out");
            //$window.location.href=url;
        })
    }else{
        toaster.error("something went wrong");
        return;
    }
    };
});		