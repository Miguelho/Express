'use strict';
var app= angular.module('passportLocal', ['ngRoute','angular-storage', 'ui.router']);

app.service('UserService', function(store) {
        var service = this,
            currentUser = null;
}).service('APIInterceptor', function($rootScope, UserService) {
        var service = this;
}).service('APIInterceptor', function($rootScope, UserService) {
        var service = this;
}).service('APIInterceptor', function($rootScope, UserService) {
        var service = this;
});
app.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/login.tmpl.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/templates/dashboard.tmpl.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard'
            });
         /*
   Response interceptors are stored inside the 
   $httpProvider.responseInterceptors array.
   To register a new response interceptor is enough to add 
   a new function to that array.
  */

  $httpProvider
    .responseInterceptors.push(['$q', function($q) {

    // More info on $q: docs.angularjs.org/api/ng.$q
    // Of course it's possible to define more dependencies.

    return function(promise) {

      /*
       The promise is not resolved until the code defined
       in the interceptor has not finished its execution.
      */

      return promise.then(function(response) {

        // response.status >= 200 && response.status <= 299
        // The http request was completed successfully.

        /*
         Before to resolve the promise 
         I can do whatever I want!
         For example: add a new property 
         to the promise returned from the server.
        */

        response.data.extra = 'Interceptor strikes back';

        // ... or even something smarter.

        /*
         Return the execution control to the 
         code that initiated the request.
        */

        return response; 

      }, function(response) {

        // The HTTP request was not successful.

        /*
         It's possible to use interceptors to handle 
         specific errors. For example:
        */

        if (response.status === 401) {

          // HTTP 401 Error: 
          // The request requires user authentication

          response.data = { 
            status: false, 
            description: 'Authentication required!'
          };

          return response;

        }

        /*
         $q.reject creates a promise that is resolved as
         rejectedwith the specified reason. 
         In this case the error callback will be executed.
        */

        return $q.reject(response);

      });

    }

  }]);
}]);


app.controller('mainController',function($scope,$http,$location){
	$scope.formData={};
    $scope.authors={};
    $scope.serverResponse=String("");
    console.log("mainController loaded");

    $scope.login = function(){
        alert("hello... it's me");
    };

    $scope.signup = function(){
        $http.post('/register', angular.toJson(getDataFromRegisterForm()))
            .success(function(data) {
               $location.path('/');
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
    }
    ;
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


});