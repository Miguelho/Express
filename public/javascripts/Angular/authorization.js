var myApp= angular.module('passportLocal');

myApp.factory('authorization', ['$rootScope', '$state', 'servicio',
  function($rootScope, $state,servicio, $window) {
  	console.log("authorization.js cargado");
    return {
      authorize: function(username) {
        console.log("authorize se dispara en authorization.js" + username);
        return servicio.identity()
          .then(function(credentials) {
            var isAuthenticated = servicio.isAuthenticated();
            //if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
              if (isAuthenticated ){
                $state.go('user.home'); // user is signed in but not authorized for desired state
                $rootScope.estado=$state.is('user.home');
                console.log("$state.go a home");//Aunque el cambio sea  al mismo estado, se considera un cambio de estado
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
]);