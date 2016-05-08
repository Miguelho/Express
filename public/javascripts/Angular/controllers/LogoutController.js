var myApp= angular.module('passportLocal');

myApp.controller('LogoutController',function($scope,$auth,$state,toastr){//Servicio que recoja datos del formu
	$scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
        
    };

    $scope.logout=function(){
    if($scope.isAuthenticated()){
        $auth.logout()
        .then(function() {
            //var url = "http://" + $window.location.host + "/";
            $state.go('anon.login');
            console.log("desconectado");
            //toaster.info("you have logged out");
            //$window.location.href=url;
        })
    }else{
        toastr.error("something went wrong");
        return;
    }
    };
});		