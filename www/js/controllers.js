angular.module('appYiSou.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $firebaseAuth) {
  var ref = new Firebase("https://hosty.firebaseIO.com");
  $rootScope.authObj = $firebaseAuth(ref);

  $rootScope.g_auth = $rootScope.authObj.$getAuth();
  if ($rootScope.g_auth) {
    console.log("Logged in as:", $rootScope.g_auth.uid);
  } else {
    console.log("User not logged in");
  }
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('LoginModalCtrl', function($scope, $rootScope, $state, $ionicSideMenuDelegate, loginModal) {
  $scope.alert = '';

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    loginModal.closeModal();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(loginData) {
    console.log('Doing login', loginData);
    if (loginData.username.indexOf("@") === -1) {
      $scope.alert = ">> Your username is invalid email";
      return;      
    }
    if (typeof loginData.password === 'undefined') {
      $scope.alert = ">> Your password is empty";
      return;
    }
    loginModal.login(loginData).then(function(authData) {
      console.log("Authenticated successfully with payload:", authData.uid);
      $rootScope.g_auth = authData;
      $scope.closeLogin();
      $ionicSideMenuDelegate.toggleLeft();
      $state.go(loginModal.getToState().toState.name, loginModal.getToState().toParams);
    }).catch(function(error) {
      $scope.alert = error;
      if (error.code === "INVALID_EMAIL") {
        $scope.alert = ">> Your username email is invalid";
      }
      if (error.code === "INVALID_PASSWORD") {
        $scope.alert = ">> Your password is incorrect";
      }        
      if (error.code === "INVALID_USER") {
        $scope.alert = ">> The user name is not existed";
      }      
      console.error(error);

      $state.go('app.home.root');
    })
  };

  $scope.enterSignup = function() {
    $scope.closeLogin();
    $ionicSideMenuDelegate.toggleLeft();
    $state.go('app.signup');
  };

})

.controller('SignupCtrl', function($scope, $state) {
  $scope.alert = '';

  $scope.doSignup = function(userInfo) {
    console.info("%s, %s, %s", userInfo.username, userInfo.password, userInfo.confirmPassword)
    if (userInfo.username.indexOf("@") === -1) {
      $scope.alert = ">> Your username is invalid email";
      return;
    }
    if (userInfo.password === undefined || userInfo.confirmPassword === undefined) {
      $scope.alert = ">> Your passwords are empty";
      return;
    }
    if (userInfo.confirmPassword !== userInfo.password) {
      $scope.alert = ">> Your passwords don't match";
      return;
    }

    $scope.authObj.$createUser({
      email: userInfo.username,
      password: userInfo.password
    }).then(function(userData) {
      console.log("User "+userData.uid+" created successfully!")
      return $scope.authObj.$authWithPassword({
        email: userInfo.username,
        password: userInfo.password
      });
    }).then(function(authData) {
      console.log("Logged in as: ", authData.uid);
      $rootScope.g_auth = authData;
      $state.go('app.home.root');
    }).catch(function(error) {
      if (error.code === "EMAIL_TAKEN") {
        $scope.alert = ">> The user name has been taken, please try another one";
      }
      console.error("Error: ", error)
    });

  }
})

.controller('HomeCtrl', function($scope) {
  
})

.controller('AccountCtrl', function($scope, $rootScope, loginModal) {
  $scope.openLoginModal = function() {
    loginModal.openModal();
  };

  $scope.logout = function() {
    $rootScope.authObj.$unauth();
    $rootScope.g_auth = null;
    console.log("Logged out!")
  }  
})

.controller('HomeRootCtrl', 
  function($scope) {

})

.controller('HomeAddCtrl', function($scope, $rootScope, $state, fbListings) {
  $scope.presetBedsNum = ['1 bed', '2 beds', '3 beds', '4 beds'];
  $scope.presetBathsNum = ['1 bath', '2 baths', '3 baths'];
  $scope.presetCity = ['Calgary', 'Vancouver', 'Toronto', 'Montreal'];
  $scope.fbListings = fbListings;
  
  $scope.goBack = function() {
    $state.go("app.home.root");
    console.log("goBack to the Home view")
  }

  $scope.add = function(spaceInfo) {
    console.log("space listing length: %s", $scope.fbListings.length);
    var elem = {
      "listId": "",
      "ownerId": $rootScope.g_auth.password.email,
      "listDate": _.now(),
      "spaceInfo": {
        "address": spaceInfo.address,
        "city": spaceInfo.city,
        "postcode": spaceInfo.postcode,
        "price": spaceInfo.price, 
        "bedsNum": spaceInfo.beds,
        "bathsNum": spaceInfo.baths,
        "photoUrl": ""
      }      
    };
    $scope.fbListings.$add(elem).then(function(ref) {
      var key = ref.key();
      var rec = $scope.fbListings.$getRecord(key);
      rec.listId = key;
      $scope.fbListings.$save(rec).then(function(ref) {
        ref.key() === rec.$id;
      });
      console.log("added record with fb_id: " + key + ", listId: " + rec.listId);
      $state.go("app.home.root");
    });
  }

})

.controller('ListsCtrl', function($scope, fbListings) {
  $scope.fbListings = fbListings;
  
})

.controller('FavoriatesCtrl', function($scope) {
  
})

.controller('MessagesCtrl', function($scope) {
  
})

.controller('ListCtrl', function($scope, $stateParams) {

})

.controller('ProfileCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go("app.account");
    console.log("Back to the account view")
  }
})

.controller('SettingsCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go("app.account");
    console.log("Back to the account view")
  }
});

