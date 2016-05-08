'use strict';
var app= angular.module('passportLocal', ['ui.router','satellizer','toastr']);

//app.run carga los servicios personalizados
app.run(['$rootScope','$state','servicio','authorization',function ($rootScope, $state,servicio,authorization) {
  $rootScope.$on('$stateChangeStart', function ($state,toState, toStateParams) {
    // track the state the user wants to go to; authorization service needs this
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        // if the principal is resolved, do an authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        if (servicio.isIdentityResolved()){    
            console.log("Identidad " + toState.name);  
            return;
        }else{
            console.log("Identidad no resuelta aún");
            authorization.authorize("Miguel");
        }
  });

}]);

//app.controller() para la conexión entre nuestros servicios y la vista HTML
app.controller('mainController',function($scope,$http,$location,$window,$state,$rootScope,toastr){
	$scope.formData={};
    $scope.authors={};
    $scope.serverResponse=String("");
    console.log("mainController loaded");
    toastr.success( 'Bienvenido!','GeoData');

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


     
});