var myApp= angular.module('passportLocal');

myApp.controller('HomeController',function($scope){
	console.log("HomeController ejecutado");
	$scope.message=String("Home controller ejecutado");
});		