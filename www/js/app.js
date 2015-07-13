// Ionic Starter App 

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('appYiSou', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ngCordova', 'firebase', 'appYiSou.controllers'])

.run(function($ionicPlatform, $ionicAnalytics, $rootScope, $state, $stateParams, loginModal, myListingService) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $ionicPlatform.ready(function() {

    $ionicAnalytics.register();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && $rootScope.g_auth === null) {
      event.preventDefault();
      loginModal.openModal();
      console.log("login in dialog is opened!");
      console.log("toState: %s, toParams: %s", toState.name, toParams.toString());
      loginModal.saveToState(toState, toParams);
    }
  });

  myListingService.start();

})

.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider) {
  // Identify app
  $ionicAppProvider

  .identify({
    app_id: '7747818c',
    api_key: 'f27df5c9c948b50b76cfa46a07f7eb3a837a68e9519885ba'
  });

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.signup', {
    url: "/signup",
    views: {
      'menuContent': {
        templateUrl: "templates/signup.html",
        controller: 'SignupCtrl'
      }
    },
    data: {
      requireLogin: false
    }
  })
  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    },
    data: {
      requireLogin: false
    }    
  }) 
  .state('app.home.root', {
    url: "/root",
    views: {
      'homeContent': {
        templateUrl: "templates/home.root.html",
        controller: 'HomeRootCtrl'
      }
    },
    data: {
      requireLogin: false
    }    
  })     
  .state('app.home.add', {
    cache: false,
    url: "/add",
    views: {
      'homeContent': {
        templateUrl: "templates/home.add.html",
        controller: 'HomeAddCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })   
  .state('app.account', {
    url: "/account",
    views: {
      'menuContent': {
        templateUrl: "templates/account.html",
        controller: 'AccountCtrl'
      }
    },
    data: {
      requireLogin: false
    }    
  }) 
  .state('app.lists', {
    url: "/lists",
    views: {
      'menuContent': {
        templateUrl: "templates/lists.html",
        controller: 'ListsCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.favoriates', {
    url: "/favoriates",
    views: {
      'menuContent': {
        templateUrl: "templates/favoriates.html",
        controller: 'FavoriatesCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.messages', {
    url: "/messages",
    views: {
      'menuContent': {
        templateUrl: "templates/messages.html",
        controller: 'MessagesCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.list', {
    url: "/list/:listId",
    views: {
      'menuContent': {
        templateUrl: "templates/list.html",
        controller: 'ListCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    },
    data: {
      requireLogin: false
    }    
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home/root');
})

.factory('fbListings', [ '$firebaseArray',
  function($firebaseArray) {
    var ref = new Firebase("https://hosty.firebaseIO.com/lists");
    return $firebaseArray(ref);
  }
])

.factory('fbUsers', [ 
  function() {
    var ref = new Firebase("https://hosty.firebaseIO.com/users");
    return ref;
  }
])

.service('addFriendModal', function($ionicModal) {
  var instance;

  return {
    openModal: function() {
      $ionicModal.fromTemplateUrl('templates/addFriend.html')
        .then(function(modal) {
          instance = modal;
          instance.show();
        });      
    },
    closeModal: function() {
      instance.remove();
      console.log("dialog removed");
    }
  }
})

.service('loginModal', function($ionicModal, $rootScope, $q) {
  var instance, toState, toParams;

  return {
    openModal: function() {
      $ionicModal.fromTemplateUrl('templates/login.html')
        .then(function(modal) {
          instance = modal;
          instance.show();
        });
    },
    closeModal: function() {
      instance.remove();
      console.log("dialog removed");
    },
    login: function(loginData) {
      var deferred = $q.defer();

      $rootScope.authObj.$authWithPassword({
        email    : loginData.username,
        password : loginData.password
      }).then(function(authData) {
        deferred.resolve(authData);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    saveToState: function(State, Params) {
      toState = State;
      toParams = Params;
    },
    getToState: function() {
      return {
        toState: toState,
        toParams: toParams
      };
    }
  }
})

.service("authEventService", function($rootScope) {
  this.broadcast = function() {
    $rootScope.$broadcast("authEvent");
    console.info("broadcast authEvent");
  }
  this.listen = function(cb) {
    $rootScope.$on("authEvent", function(event, data) {
      cb.call();
    });
    console.info("listen authEvent event");
  }
})

.service("myListingService", function($rootScope, authEventService) {
  return {
    start: function() {
      console.info("myListingService is up...")

      var cb = function() {
        var ref = new Firebase("https://hosty.firebaseIO.com/lists");
        var ownerId = $rootScope.g_auth.password.email;
        console.info("receive authEvent and fire callback, ownerId: "+ownerId);

        ref.orderByChild("ownerId").equalTo(ownerId).on('value', function(snap) {
            $rootScope.myListings = snap.val();
            
            /*
            console.log($rootScope.myListings);
            _.forEach($rootScope.myListings, function(v, k) {
              console.log(v, k);
            })
            */           
        });    
      }
      
      authEventService.listen(cb);     
    }
  }
})

;
