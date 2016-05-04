'use strict';
var app= angular.module('passportLocal', ['ui.router','satellizer']);

app.config(['$httpProvider','SatellizerConfig','$locationProvider','$stateProvider','$urlRouterProvider','$authProvider',
 function($httpProvider,config,$locationProvider,$stateProvider,$urlRouterProvider,$authProvider) {
    //http://joelhooks.com/blog/2013/07/22/the-basics-of-using-ui-router-with-angularjs/
    $stateProvider
        /*.state('index',{
        url:'/'
    })*/
        .state('home', {
    url: "/home",
    controller:'HomeController',
    data: {requiredLogin: true, user:"miguel"}
    //abstract: true,
    })
        .state('login', {
    url: '/login',
    //templateUrl: 'templates/login.html',
    controller: 'LoginController',
    controllerAs: "login"
    })
        .state('register', {
    url: '/register',
    //templateUrl: 'templates/register.html',
    controller: 'RegisterController',
    controllerAs:'register'
    })
        .state('logout', {
    url: '/logout',
    templateUrl:null,
    controller:"LogoutController"
    });

    $urlRouterProvider.otherwise('/');

        // use the HTML5 History API
        //$locationProvider.html5Mode(true); //standardized way to manipulate browser history using a script, lets angular
        //cambiar el ruteo y las urls sin refrescar la pagina

    $httpProvider.interceptors.push(function($q,$location) {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        return {
            'request': function(httpConfig) {
            // do something on success
            var token = localStorage.getItem(tokenName); //Accede al almacenamiento local para recoger el token JWT
            //alert(config)
            if(token && config.httpInterceptor){
                token = config.authHeader === 'Authorization' ? 'Bearer ' + token : token;
                httpConfig.headers[config.authHeader] = token; //inserta en la cabezara el token
            }
            return httpConfig;// envia la req, el Backend se encarga de ver si existe o no
            },
            'response':function(response){
                console.dir(response);
                //console.log($location.path());
                return response;
            },'responseError': function(rejection){

                var defer = $q.defer(); //Instancia de un objeto deferred

                if(rejection.status == 401){
                    console.dir(rejection);
                    $location.url('/');
                }
                if(rejection.status == 500){
                    console.dir(rejection);
                    $location.url('/');
                }
                if(rejection.status == 301){
                    console.dir(rejection)
                }
                defer.reject(rejection); //defer.reject(reason), rechaza la promesa derivada con una razón. Equvialente
                //a resolverlo con una rejection construida así $q.reject

                return defer.promise; //retorna una instancia de nueva promesa, esta permite a la página y otross servicios asociados
                //ganar acceso al resultado de las tareas deferred cuando se completan

            }
        };
    });

    $authProvider.loginUrl= "http://localhost:3000/login";//rutas al server
    $authProvider.signupUrl= "http://localhost:3000/register";//rutas al server
    $authProvider.tokenName= "token";//Nombre del token
    $authProvider.tokenPrefix= "passportLocal";//Añade prefijo para diferenciar LocalStorage de otros. En LocalStorage: token_passportLocal

}]);



app.run(function ($rootScope, $state,$auth) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    var requiredLogin = false;
      // check if this state need login
      if (toState.data && toState.data.requiredLogin)
        requiredLogin = true;
      
      // if yes and if this user is not logged in, redirect him to login page
      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }

    /*if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }*/
  });

})


function RegisterController($auth,$location,$rootScope,$scope){
    console.log("RegisterController loaded");
    var vm = this;
    $rootScope.signup=function(){
    console.log("NO APAREZCAS!");
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
}
function LoginController($auth,$rootScope,$scope,$state,$window){//Servicio que recoja datos del formu
    console.log("loginController loaded");
    $rootScope.login=function(){ //funciones que se utilizan desde las vistas
    console.log("Logeando....");
    $auth.login({//$auth.login por debajo introducen en la cabecera HTTP el token de autenticación que se recibe del servidor cuando se autentica o realiza HTTP
        username:$scope.username,
        password:$scope.password
    }).then(function(response){
        console.log("logeado!");
        $state.go('home'); //Cambio de estado a home
        var url = "http://" + $window.location.host + "/home"; //el servicio $window permite el redireccionamiento a una nueva página
        $window.location.href=url;
        $scope.serverResponse=response.statusText;
    })
    .catch(function(response){
        console.dir(response);
    // Si ha habido errores llegamos a esta parte
    });
    }
}
function LogoutController($scope,$auth,$window) {
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
    
}
app.controller('RegisterController',RegisterController);
app.controller('LoginController',LoginController);
app.controller('LogoutController',LogoutController);
//app.controller() para la conexión entre nuestros servicios y la vista HTML
app.controller('mainController',function($scope,$http,$location,$window,AuthService,$state){
	$scope.formData={};
    $scope.authors={};
    $scope.serverResponse=String("");
    console.log("mainController loaded");


    /*$scope.login = function() {
    AuthService.login(angular.toJson(getDataFromRegisterForm()))
    .then(
        function successCallback(msg) {
            $state.go('inside');
            console.log("estado "+ $state);
    }, function errorCallback(errMsg) {
        console.log("erroraco")
      var alertPopup = alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
    };*/
    
    //pre Devdactic
    /*$scope.login = function(){
        $http({method:'POST',
            url:'/login',
            data: angular.toJson(getDataFromRegisterForm()),
            headers:{'Content-Type':'application/json'}
        }).then(function successCallback(response) {
                if(!response['status'])
                    console.log("Servers says to go to root directory!")
                else{
                    $scope.serverResponse=String("logeado!");
                    console.log(response.redirect);
                    //$window.location.href=data.redirect;

                }
                    //$window.location.href='/'; redirige sí, pero sin tener en cuenta la renderización con user
            },function errorCallback(response){
                $scope.serverResponse=response.data;
                //$location.url('/');
            }
        ).catch(function(err){
            $scope.serverResponse=err.message;
        });
    };*/
            /*
            .error(function(data) {
                console.log('Error: ' + data);
            });
            */
    /*$scope.signup = function(){
        $http.post('/register',angular.toJson(getDataFromRegisterForm()),{'Content-Type':'application/json'} )
            .success(function(data) {
               $location.url('/');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };*/

    function getDataFromRegisterForm(){
        var data = ({username:$scope.username,
            password:$scope.password
        }); 
        return data;
    }
    $scope.insertAuthor = function() {
        $http.post('/authors/', getDataFromForm())
            .success(function(data) {
                $scope.serverResponse=data;
                $scope.formData = {}; // limpia info anterior en formData;
                //$scope.authors = data;
                console.log("data " + data);
                $scope.refresh();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.refresh=function(){
        $http.get('/authors')
        .success(function(data) {
            $scope.authors = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    // $scope.refresh();

    $scope.refreshAutores=function(){
        authors={"nombre":"pene"};
        $scope.serverResponse="IT GIRL";
        console.log("authors");
    };
    $scope.getAutorByName =function(){
        var keyword = $scope.keyword;

        $http.get('/buscarAutores/'+keyword)
        .success(function(data) {
            $scope.serverResponse=data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
/*
	$scope.insertAuthor = function() {
        $http.post('/authors/', getDataFromForm())
            .success(function(data) {
                $scope.serverResponse=data;
                $scope.formData = {}; // limpia info anterior en formData;
                //$scope.authors = data;
                console.log("data " + data);
                $scope.refresh();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateAuthor = function() {
        //$http.put(url,data,config)
        //alert("Me actualiso");

        var data= ({
            first_name:$scope.first_name,
            biography:$scope.biography,
            DoB:$scope.DoB,
            nationality:$scope.nationality
        });
        console.log(data);

        $http.put('/authors/'+$scope.first_name,data)
            .success(function(data,status,headers) {
                $scope.serverResponse=data;
            })
            .error(function(data, status, header, config) {
                $scope.serverResponse="error";
                console.log('Error: ' + data);
            });
    };
    $scope.deleteAuthor = function() {
        console.log($scope.borrar);
        $http.delete('/authors/'+ $scope.borrar)
            .success(function(data,status,headers) {
                $scope.serverResponse=data;
            })
            .error(function(data, status, header, config) {
            	$scope.serverResponse="error";
                console.log('Error: ' + data);
            });
    };
    function recogerCampos(){
       
        $scope.formData[0]=$scope.first_name;
        $scope.formData[1]=$scope.biography;
        $scope.formData[2]=$scope.DoB;
        $scope.formData[3]=$scope.nationality;
        
        return $scope.formData;
    }

    function getDataFromForm(){
        var data = ({first_name:$scope.first_name,
            biography:$scope.biography,
            DoB:$scope.DoB,
            nationality:$scope.nationality}); 
        return data;
    }
*/

});