var myApp= angular.module('passportLocal');

myApp.factory('authorization', ['$rootScope', '$state', 'principal',
  function($rootScope, $state, principal, $window) {
  	console.log("authorization.js cargado")
    return {
      authorize: function() {
        return principal.identity(false,"5729b398d1b1abdc1a2fc949")
          .then(function(credentials) {
            var isAuthenticated = principal.isAuthenticated();
            //if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
              if (isAuthenticated){
               $state.go('home'); // user is signed in but not authorized for desired state
              	console.log("$state.go a home");
              }else {
                // user is not authenticated. stow the state they wanted before you
                // send them to the signin state, so you can return them when you're done
                  $rootScope.returnToState = $rootScope.toState;
                  $rootScope.returnToStateParams = $rootScope.toStateParams;
  				        console.log("$state.go a login");
                // now, send them to the signin state so they can log in
                  $state.go('login');

              }
            //}
          })
          .catch(function(err){
          	console.dir(err);
          });
      }
    };
  }
])