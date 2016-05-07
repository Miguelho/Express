var app= angular.module('passportLocal');

app.config(['$httpProvider','SatellizerConfig','$stateProvider','$urlRouterProvider','$authProvider',
 function($httpProvider,config,$stateProvider,$urlRouterProvider,$authProvider) {
    //http://joelhooks.com/blog/2013/07/22/the-basics-of-using-ui-router-with-angularjs/
    //State configuration
    
var access = routingConfig.accessLevels;
    // Public routes
    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        })
        .state('public.404', {
            url: '/404/',
            templateUrl: '404'
        });

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        .state('anon.login', {
            //url: '/login/',
            template: '<h1>Has de logeartee!</h1>',
            controller: 'LoginCtrl'
        })
        .state('anon.register', {
            url: '/register/',
            templateUrl: 'register',
            controller: 'RegisterCtrl'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>"
        })
        .state('user.home', {
            url: '/home',
            redirectTo:'/home',
            templateUrl: 'home'
        })
        .state('user.private', {
            abstract: true,
            url: '/private/',
            templateUrl: 'private/layout'
        })
        .state('user.private.home', {
            url: '',
            templateUrl: 'private/home'
        })
        .state('user.private.nested', {
            url: 'nested/',
            templateUrl: 'private/nested'
        })
        .state('user.private.admin', {
            url: 'admin/',
            templateUrl: 'private/nestedAdmin',
            data: {
                access: access.admin
            }
        });

    // Admin routes
    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        })
        .state('admin.admin', {
            url: '/admin/',
            templateUrl: 'admin',
            controller: 'AdminCtrl'
        });
    /*$stateProvider
        .state('site', {
            abstract: true,
            resolve: {
                authorize: ['authorization',
                function(authorization) {
                    return authorization.authorize();
            }
            ]},
            template: '<div ui-view />'
    })
        .state('home', {
    parent:'site',
    url: "/",
    data: {requiredLogin: true},
    controller:'HomeController'
    })
        .state('outside',{
    abstract: true,

    })
        .state('login', {
    url: '/loginpolla',
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
    });*/

    //$urlRouterProvider.otherwise('/');

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
                token = config.authHeader === "'Authorization'" ? 'Bearer ' + token : token;
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
                    //$location.url('/');
                }
                if(rejection.status == 500){
                    console.dir(rejection);
                    //$location.url('/');
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
    $authProvider.authHeader = 'Authorization';
}]);