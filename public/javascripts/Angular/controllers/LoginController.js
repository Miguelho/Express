var myApp= angular.module('passportLocal');

myApp.controller('LoginController',function($auth,$rootScope,$scope,$state,$window){//Servicio que recoja datos del formu
	console.log("loginController loaded");
    $rootScope.login=function(){ //funciones que se utilizan desde las vistas
    console.log("Logeando....");
    $auth.login({//$auth.login por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor cuando se autentica o realiza HTTP
        username:$scope.username,
        password:$scope.password
    }).then(function(response){
        console.log("logeado!");
        var url = "http://" + $window.location.host + "/home"; //el servicio $window permite el redireccionamiento a una nueva página
        $window.location.href=url;
        $state.go('home')
    })
    // Si ha habido errores llegamos a esta parte
    .catch(function(response){
        console.dir(response);
    });
    }
});		