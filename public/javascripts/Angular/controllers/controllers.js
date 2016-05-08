var passportLocal = angular.module('passportLocal');

passportLocal.controller('HomeController',HomeController);
passportLocal.controller('IndexController',IndexController);
passportLocal.controller('RegisterController',RegisterController);
passportLocal.controller('LoginController',LoginController);
passportLocal.controller('LogoutController',LogoutController);




function HomeController ($scope,$http){
	console.log("HomeController ejecutado");
	$scope.message=String("Home controller ejecutado");
	$scope.users="";
	$http({
		method:'GET',
		url:'/user/listUsers'
	}).then(function onSuccess(response){
		var responseData = response.data; // Recibe la respuesta del servidor y guarda el campo data que es el que nos interesa
		$scope.users=responseData; //Lo meto en una variable users para mostrar la tabla en angular

	}).catch(function onError(err){
		$scope.message=err.message;
	});


	$scope.delete=function(user){
		var indexUser= $scope.users.indexOf(user)
		$http({
			method:'DELETE',
			url:'/user/' +user['_id']
		}).then(function onSuccess(response){
			console.log("Usuario borrado " + $scope.users.splice(indexUser,1));
			$scope.users=$scope.users;
		})
	}}

function IndexController($scope){console.log("IndexController ejecutado");}

function RegisterController($auth,$location,$rootScope,$scope,$state){
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
    }}

function LoginController($auth,$rootScope,$scope,$state,$http,$location,$window,toastr){
	console.log("loginController loaded");
    
    $rootScope.estado=$rootScope.toState;

    $rootScope.login=function(){ //funciones que se utilizan desde las vistas
    $auth.login({//$auth.login por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor cuando se autentica o realiza HTTP
        username:$scope.username,
        password:$scope.password
     }).then(
        function(response){
            console.log("logeado!");
            var url = "http://" + $window.location.host + "/"; //el servicio $window permite el redireccionamiento a una nueva página
            $window.location.href=url;
            $rootScope.$state=$state.go('user.home');
        })
    .catch(function(response){
        $rootScope.$state=$state.go('anon.login');
        toastr.error('No existe este usuario', 'Error');
        
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
    };}

function LogoutController($scope,$auth,$state,toastr){
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
}
