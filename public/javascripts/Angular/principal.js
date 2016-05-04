var myApp= angular.module('passportLocal');

myApp.factory('principal', ['$q', '$http', '$timeout','$window',
  function($q, $http, $timeout, $window) {
    var _identity = undefined,
      _authenticated = false;

      //devuelve states
    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      isInRole: function(role) {
        if (!_authenticated || !_identity.roles) return false;

        return _identity.roles.indexOf(role) != -1;
      },
      isInAnyRole: function(roles) {
        if (!_authenticated || !_identity.roles) return false;

        for (var i = 0; i < roles.length; i++) {
          if (this.isInRole(roles[i])) return true;
        }

        return false;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity != null;
        
        // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
        if (identity) {
          console.log("authenticate() HAY una identidad no hay una identidad en local"  + identity);
          localStorage.setItem("demo.identity", angular.toJson(identity));
        }else {
          console.log("authenticate() no hay una identidad en local")
          localStorage.removeItem("demo.identity");
        }
      },
      identity: function(force) {
        var deferred = $q.defer();
        var url = "http://" + $window.location.host + "/home";
        console.log("from principal 1");
        if (force === true){ 
            _identity = undefined;
            console.log("forzado");
        }
        console.log("from principal 2");
        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);
          console.log("angular.isDefined(_identity) retorna true" + JSON.stringify(_identity));//null
          return deferred.promise;
        }
        console.log("from principal 3");

          var url = "http://" + $window.location.host + "/user/572849d71b47b8f418bd96c6"; //Petición de Identidad del usuario
          console.log("******** identity() shot ********" + _identity);//1ºvez undefined al no persistir 
          $http.get(url, { ignoreErrors: false })
                                .success(function(data) {
                                  console.log("principal data " + data);
                                    _identity = data; //Data from controllers/user
                                    _authenticated = true;
                                    deferred.resolve(_identity);
                                })
                                .error(function () {
                                  console.log("principal errorcito");
                                    _identity = null;
                                    _authenticated = false;
                                    deferred.resolve(_identity);
                                });
        

        // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
        //                   $http.get('/svc/account/identity', { ignoreErrors: true })
        //                        .success(function(data) {
        //                            _identity = data;
        //                            _authenticated = true;
        //                            deferred.resolve(_identity);
        //                        })
        //                        .error(function () {
        //                            _identity = null;
        //                            _authenticated = false;
        //                            deferred.resolve(_identity);
        //                        });

        // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
        // i put it in a timeout to illustrate deferred resolution
        var self = this;
        $timeout(function() {
          _identity = angular.fromJson(localStorage.getItem("demo.identity"));
          self.authenticate(_identity);
          deferred.resolve(_identity);
        }, 1000);

        return deferred.promise;
      }
    };
  }]);