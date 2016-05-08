var myApp= angular.module('passportLocal');

myApp.controller('RegisterController',function($auth,$location,$rootScope,$scope,$state){
	console.log("RegisterController loaded");
    var vm = this;

    $rootScope.signup=function(){

    $scope.userRoles = routingConfig.userRoles;
    console.log($scope.userRoles);
    var user= {};
    user={username:$scope.username,
        password:$scope.password};
    var rol = $scope.rol;
    if(rol === "admin"){
    $auth.signupAdmin(user)//$auth.signup por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor
        .then(function(response){
        $auth.setToken(response);
        $state.go('user.home');
    }).catch(function(response){
        //toastr.error(response.data.message);
    })
    }else{
    $auth.signup(user)//$auth.signup por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor
        .then(function(response){
        $auth.setToken(response.data.token); // Guarda en localStorage el token recibido del servidor
    }).catch(function(response){
        //toastr.error(response.data.message);
    });
    }
   
    console.log("se registró como " + rol);
    }
});	