var myApp= angular.module('passportLocal');

myApp.controller('RegisterController',function($auth,$location,$rootScope,$scope){
	console.log("RegisterController loaded");
    var vm = this;
    $rootScope.signup=function(){
    $auth.signup({//$auth.signup por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor
        username:$scope.username,
        password:$scope.password
    }).then(function(response){
        //Si se ha registrado correctamente, le redirige a otra ruta
        $scope.serverResponse=response;
        
    }).catch(function(response){
        $scope.serverResponse=response;
    });
    }
});		