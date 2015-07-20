// Ionic Starter App 

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('appYiSou', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ngCordova', 'firebase', 'appYiSou.controllers'])

.run(function($ionicPlatform, $ionicAnalytics, $rootScope, $state, $stateParams, loginModal, myAccountService) {
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
    console.log('toState: '+toState.name+', toParams: '+angular.toJson(toParams));
    loginModal.saveToState(toState, toParams);

    if (requireLogin && $rootScope.g_auth === null) {
      event.preventDefault();
      loginModal.openModal();
      console.log("login in dialog is opened!");
    }
  });

  myAccountService.start();

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
    url: "/lists/:userId",
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
    url: "/list/:listId/:userId",
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
  .state('app.following', {
    url: "/following",
    views: {
      'menuContent': {
        templateUrl: "templates/following.html",
        controller: 'FollowingCtrl'
      }
    },
    data: {
      requireLogin: true
    }    
  })
  .state('app.follower', {
    url: "/follower",
    views: {
      'menuContent': {
        templateUrl: "templates/follower.html",
        controller: 'FollowerCtrl'
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

.service("myAccountService", function($rootScope, $q, authEventService) {
  $rootScope.myAccountInfo = {};
  $rootScope.myAccountInfo.fullFavorListing = [];
  var digested = false;
  var listsRef = new Firebase("https://hosty.firebaseIO.com/lists");
  var usersRef = new Firebase("https://hosty.firebaseIO.com/users");

  return {
    setFavor: function(listId, ownerId) {
      var myId = $rootScope.myAccountInfo.userId.replace(/\./g, ',');
      usersRef.child(myId).child("favor").child(listId).set(ownerId);
    },
    unsetFavor: function(listId) {
      var myId = $rootScope.myAccountInfo.userId.replace(/\./g, ',');
      usersRef.child(myId).child("favor").child(listId).remove();
    },
    getListingByUserId: function(userId) {
      var deferred = $q.defer();
      listsRef.orderByChild("ownerId").equalTo(userId).once('value', function(snap) {
        console.log('getListingByUserId resolved: '+angular.toJson(snap.val()));
        deferred.resolve(snap.val());
      });
      return deferred.promise;
    },
    start: function() {
      console.info("myAccountService starts...")

      var cb = function() {
        var myUserId = $rootScope.g_auth.password.email;
        console.info("receive authEvent and fire callback, ownerId: "+myUserId);

        listsRef.orderByChild("ownerId").equalTo(myUserId).on('value', function(snap) {
            $rootScope.myAccountInfo.myListing = snap.val();            
        });

        var userId = $rootScope.g_auth.password.email.replace(/\./g, ',');
        
        usersRef.orderByKey().equalTo(userId).on('value', function(snap) {
          $rootScope.myAccountInfo.userId = $rootScope.g_auth.password.email;
          $rootScope.myAccountInfo.userName = snap.child(userId).child("name").val();
          $rootScope.myAccountInfo.following = snap.child(userId).child("following").val();
          $rootScope.myAccountInfo.follower = snap.child(userId).child("follower").val();
          $rootScope.myAccountInfo.favor = snap.child(userId).child("favor").val();

          console.log('Account userName: '+$rootScope.myAccountInfo.userName);
          console.log('my following: '+$rootScope.myAccountInfo.following);
          console.log('my follower: '+$rootScope.myAccountInfo.follower);
          console.log('my favor: '+$rootScope.myAccountInfo.favor);

          if (digested === false) {
            $rootScope.$digest();
            digested = true;
          }
        });

        usersRef.child(userId).child("favor").on('child_added', function(snap) {
          var listId = snap.key();

          listsRef.child(listId).once('value', function(childSnap) {
            console.log(angular.toJson(childSnap.val()));
            $rootScope.myAccountInfo.fullFavorListing.push({listId: listId, details: childSnap.val()});
          });
        });

        usersRef.child(userId).child("favor").on('child_removed', function(snap) {
          var listId = snap.key();

          _.remove($rootScope.myAccountInfo.fullFavorListing, function(elem) {
            return elem.listId === listId;
          });

        });

      }
      
      authEventService.listen(cb);
    },

    end: function() {
      console.info("myAccountService ends, do cleanup...");
      listsRef.off('value');
      usersRef.off('value');
      $rootScope.authObj.$unauth();
      $rootScope.g_auth = null;
      $rootScope.myAccountInfo = {};
      $rootScope.myAccountInfo.fullFavorListing = [];
    }
  }
})

;
