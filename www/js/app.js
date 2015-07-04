// Ionic Starter App 

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('appYiSou', ['ionic', 'firebase', 'appYiSou.controllers'])

.run(function($ionicPlatform, $rootScope, $state, $stateParams, loginModal) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $ionicPlatform.ready(function() {
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

})

.config(function($stateProvider, $urlRouterProvider) {
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
  .state('app.home.add', {
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
    url: "/lists/:listId",
    views: {
      'menuContent': {
        templateUrl: "templates/list.html",
        controller: 'ListCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
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
      console.log("dialog removed")
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
});
