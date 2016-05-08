var myApp= angular.module('passportLocal');

myApp.controller('LoginController',function($auth,$rootScope,$scope,$state,$http,$location){//Servicio que recoja datos del formu
	console.log("loginController loaded");
    $rootScope.estado=$rootScope.toState;
    $rootScope.login=function(){ //funciones que se utilizan desde las vistas
    //console.log("Logeando....");
    //$state.go('user.home');
    $auth.login({//$auth.login por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor cuando se autentica o realiza HTTP
        username:$scope.username,
        password:$scope.password
     }).then(
        function(response){
            console.log("logeado!");
            //var url = "http://" + $window.location.host + "/home"; //el servicio $window permite el redireccionamiento a una nueva página
            //$window.location.href=url;
                $http({
                    method:'GET',
                    url:'/home'
                }).then(function success(response){
                    console.log("una vez que ya estoy autorizado, pido la pagina home");
                    $state.go('user.home');
                }).catch(function(response){
                    console.log("algo habrá pasado...");
                });
        })
    .catch(function(response){
        //$state.go('anon.login');
        
    });
    }

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            toastr.error(error);
          }
        });
    };
});		