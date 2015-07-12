angular.module('appYiSou.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $firebaseAuth, authEventService, myListingService) {
  var ref = new Firebase("https://hosty.firebaseIO.com");
  $rootScope.authObj = $firebaseAuth(ref);

  $rootScope.g_auth = $rootScope.authObj.$getAuth();
  if ($rootScope.g_auth) {
    console.log("Logged in as:", $rootScope.g_auth.uid);
    authEventService.broadcast();
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

.controller('LoginModalCtrl', function($scope, $rootScope, $state, $ionicSideMenuDelegate, loginModal, authEventService) {
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
      console.log("Authenticated successfully, uid: "+authData.uid+", email: "+authData.password.email);

      $rootScope.g_auth = authData;

      authEventService.broadcast();
      $scope.closeLogin();
      $ionicSideMenuDelegate.toggleLeft();
      if (loginModal.getToState().toState) {
        $state.go(loginModal.getToState().toState.name, loginModal.getToState().toParams);
      } else {
        $state.go('app.home');
        console.log('no previous router state, jump to app.home');
      }
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

.controller('SignupCtrl', function($scope, $rootScope, $state, fbUsers, authEventService) {
  $scope.alert = '';
  $scope.fbUsers = fbUsers;

  $scope.doSignup = function(userInfo) {
    console.info("%s, %s, %s", userInfo.username, userInfo.password, userInfo.confirmPassword)
    if (userInfo.username.indexOf("@") === -1) {
      $scope.alert = ">> Your username is invalid email";
      return;
    }
    if (typeof userInfo.password === 'undefined' || typeof userInfo.confirmPassword === 'undefined') {
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
      console.log("Logged in as: "+authData.uid+", email: "+authData.password.email);
      $rootScope.g_auth = authData;
      authEventService.broadcast();
      $state.go('app.home.root');

      var email = authData.password.email.replace(/\./g, ',');
      $scope.fbUsers.child(email).set({
        "userId": authData.uid
      });
    }).catch(function(error) {
      if (error.code === "EMAIL_TAKEN") {
        $scope.alert = ">> The user name has been taken, please try another one";
      }
      console.error("Error: ", error);
    });

  }
})

.controller('AddFriendModalCtrl', function($scope, addFriendModal) {

  $scope.close = function() {
    addFriendModal.closeModal();
  }
})

.controller('HomeCtrl', function($scope, $state, addFriendModal) {
  $scope.openAddFriendDialog = function() {
    addFriendModal.openModal();
  }
  $scope.navTitleClicked = function() {
    $state.go("app.lists");
  }
})

.controller('AccountCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaToast, loginModal) {
  $scope.openLoginModal = function() {
    loginModal.openModal();
  };

  $scope.logout = function() {
    $rootScope.authObj.$unauth();
    $rootScope.g_auth = null;
    console.log("Logged out!")

    $ionicPlatform.ready(function() {
      $cordovaToast
        .show('You just logged out!', 'long', 'center')
        .then(
          function(success) {
          // success
          }, 
          function (error) {
          // error
          }
        );    
    });
  };

})

.controller('HomeRootCtrl', function($scope, $cordovaGeolocation) {
  $scope.regionData = [
    {
      "name": "NorthWest",
      "totalListing": "12",
      "todayListing": "5",
      "apatNum": "3",
      "singleHouseNum": "5",
      "shareHouseNum": "2",
      "hotelNum": "24"
    },
    {
      "name": "NorthEast",
      "totalListing": "18",
      "todayListing": "8",
      "apatNum": "10",
      "singleHouseNum": "6",
      "shareHouseNum": "1",
      "hotelNum": "32"
    },
    {
      "name": "Downtown",
      "totalListing": "8",
      "todayListing": "2",
      "apatNum": "7",
      "singleHouseNum": "1",
      "shareHouseNum": "2",
      "hotelNum": "48"
    },
    {
      "name": "SouthWest",
      "totalListing": "32",
      "todayListing": "10",
      "apatNum": "12",
      "singleHouseNum": "15",
      "shareHouseNum": "3",
      "hotelNum": "25"
    },
    {
      "name": "SouthEast",
      "totalListing": "32",
      "todayListing": "11",
      "apatNum": "12",
      "singleHouseNum": "17",
      "shareHouseNum": "4",
      "hotelNum": "18"
    }    
  ];

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.cur_lat  = position.coords.latitude
      $scope.cur_lon = position.coords.longitude
    }, function(err) {
      // error
    });

})

.controller('HomeAddCtrl', function($scope, $rootScope, $state, fbListings) {
  $scope.alert = '';
  $scope.spaceInfo = {};
  $scope.presetBeds = ['1', '2', '3', '4'];
  $scope.spaceInfo.beds = '1';
  $scope.presetBaths = ['1', '2', '3'];
  $scope.spaceInfo.baths = '1';
  $scope.presetCity = ['Calgary', 'Vancouver', 'Toronto', 'Montreal'];
  $scope.spaceInfo.city = 'Calgary';
  $scope.presetSpaceType = ['Apartment', 'Single House', 'Shared House', 'Hotel'];
  $scope.spaceInfo.spaceType = 'Apartment';

  $scope.fbListings = fbListings;
 
  $scope.goBack = function() {
    $state.go("app.home.root");
    console.log("goBack to the Home view")
  }

  $scope.add = function(spaceInfo) {
    if (typeof spaceInfo.address === 'undefined' && typeof spaceInfo.postcode === 'undefined' ||
        spaceInfo.address === "" && spaceInfo.postcode === "") {
      $scope.alert = ">> Address or postcode information MUST input."
      return
    }
    if (typeof spaceInfo.price === 'undefined') {
      $scope.alert = ">> Price information is missing."
      return
    }

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
        "spaceType": spaceInfo.spaceType,
        "photoUrl": "img/thehosty.ico.png"
      }      
    };

    $scope.fbListings.$add(elem).then(function(ref) {
      /*
      var key = ref.key();
      var rec = $scope.fbListings.$getRecord(key);
      rec.listId = key;
      
      $scope.fbListings.$save(rec).then(function(ref) {
        ref.key() === rec.$id;
      });
      */
      $state.go("app.lists");
      console.log("record added with key: "+ref.key());
    });
  }

})

.controller('ListsCtrl', function($scope, $rootScope, $state) {  
  $scope.$on('$ionicView.enter', function() {
    console.info("Enter Lists view")
  });

  $scope.goBack = function() {
    $state.go("app.home.root");
    console.log("goBack to the home root view");
  }
})

.controller('FavoriatesCtrl', function($scope) {
  
})

.controller('MessagesCtrl', function($scope) {
  
})

.controller('ListCtrl', function($scope, $state, $stateParams) {
  $scope.listId = $stateParams.listId;
  console.info("enter into list view, listId: ", $scope.listId);

  $scope.goBack = function() {
    $state.go("app.lists");
    console.log("Back to the lists view")
  }
})

.controller('ProfileCtrl', function($scope, $state, $rootScope) {
  //$scope.email = $rootScope.g_auth.password.email;

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

