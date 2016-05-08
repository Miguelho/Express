var myApp= angular.module('passportLocal');

myApp.controller('HomeController',function($scope,$http){
	console.log("HomeController ejecutado");
	$scope.message=String("Home controller ejecutado");

	$http({
		method:'GET',
		url:'/user/listUsers'
	}).then(function onSuccess(response){
		$scope.message=response;
	}).catch(function onError(err){
		$scope.message=err;
	});
});		