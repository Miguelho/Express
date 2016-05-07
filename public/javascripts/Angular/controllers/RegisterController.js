var myApp= angular.module('passportLocal');

myApp.controller('RegisterController',function($auth,$location,$rootScope,$scope){
	console.log("RegisterController loaded");
    var vm = this;

    $rootScope.signup=function(){

    $scope.userRoles = routingConfig.userRoles;
    console.log($scope.userRoles);
    var user= {};
    user={username:$scope.username,
        password:$scope.password};
    var rol = $scope.rol;
    var isForAdmin = rol === "admin" ? 
    $auth.signupAdmin(user)//$auth.signup por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor
        .then(function(response){
        $auth.setToken(response);
    }).catch(function(response){
        toastr.error(response.data.message);
    })
    :
    $auth.signup(user)//$auth.signup por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor
        .then(function(response){
        $auth.setToken(response.data.token); // Guarda en localStorage el token recibido del servidor
    }).catch(function(response){
        toastr.error(response.data.message);
    });

    console.log("se registró como " + rol)
    }
});	