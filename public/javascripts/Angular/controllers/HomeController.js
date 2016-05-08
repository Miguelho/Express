var myApp= angular.module('passportLocal');

myApp.controller('HomeController',function($scope,$http){
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
		$http({
			method:'DELETE',
			url:'/user/' +user['_id'] 
		}).then(function onSuccess(response){
			console.log("Usuario borrado " + $scope.users.shift());
			$scope.users=$scope.users;
		})
	}
});		