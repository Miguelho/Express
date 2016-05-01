'use strict';
var app= angular.module('passportLocal', ['ui.router']);

app.config(['$httpProvider','$locationProvider','$stateProvider','$urlRouterProvider',
 function($httpProvider,$locationProvider,$stateProvider,$urlRouterProvider) {


    $stateProvider
        .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
    })
        .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
    })
        .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
    })
        .state('inside', {
    url: '/login#/',
    templateUrl: 'index.html'
    /*,
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'*/
    });

    $urlRouterProvider.when('/',{
        redirectTo:'/'
    });
    
    $urlRouterProvider.otherwise('/outside/login');
  
    /*$routeProvider app.config([,'$routeProvider'
    function(,$routeProvider
        .when('/',{
            redirectTo:'/'
        })
        .otherwise('/ping.html');*/
        // use the HTML5 History API
        //$locationProvider.html5Mode(true); //standardized way to manipulate browser history using a script, lets angular
        //cambiar el ruteo y las urls sin refrescar la pagina

    $httpProvider.interceptors.push(function($q,$location) {

        return {
            'request': function(config) {
            // do something on success
            //alert(config)
            return config;
            },
            'response':function(response){
                //console.dir(response);
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

}]);



app.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
//app.controller() para la conexión entre nuestros servicios y la vista HTML
app.controller('mainController',function($scope,$http,$location,$window,AuthService,$state){
	$scope.formData={};
    $scope.authors={};
    $scope.serverResponse=String("");
    console.log("mainController loaded");


    $scope.login = function() {
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
    };
    
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
    $scope.signup = function(){
        $http.post('/register',angular.toJson(getDataFromRegisterForm()),{'Content-Type':'application/json'} )
            .success(function(data) {
               $location.url('/');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

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