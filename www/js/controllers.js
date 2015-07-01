angular.module('appYiSou.controllers', [])

.controller('AppCtrl', function($scope, $firebaseAuth, $ionicModal, $state, $ionicSideMenuDelegate) {
  var ref = new Firebase("https://hosty.firebaseIO.com");
  $scope.authObj = $firebaseAuth(ref);

  $scope.g_auth = null;
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};
  $scope.alert = '';

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.logout = function() {
    $scope.authObj.$unauth();
    $scope.g_auth = null;
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    if ($scope.loginData.username.indexOf("@") === -1) {
      $scope.alert = ">> Your username is invalid email";
      return;      
    }
    if ($scope.loginData.password === undefined) {
      $scope.alert = ">> Your password is empty";
      return;
    }

    $scope.authObj.$authWithPassword({
      email    : $scope.loginData.username,
      password : $scope.loginData.password
    }).then(function(authData) {
      console.log("Authenticated successfully with payload:", authData.uid);
      $scope.g_auth = authData;
      $scope.closeLogin();
      $ionicSideMenuDelegate.toggleLeft();
    }).catch(function(error) {
      $scope.alert = error;
      if (error.code === "INVALID_EMAIL") {
        $scope.alert = ">> Your username email is invalid";
      }
      if (error.code === "INVALID_PASSWORD") {
        $scope.alert = ">> Your password is incorrect";
      }        
      console.error(error);
    });
  };

  $scope.enterSignup = function() {
    $scope.closeLogin();
    $ionicSideMenuDelegate.toggleLeft();
    $state.go('app.signup');
  };

})

.controller('SignupCtrl', function($scope, $state) {
  //var ref = new Firebase("https://hosty.firebaseIO.com");
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
      $scope.g_auth = authData;
      $state.go('app.lists');
    }).catch(function(error) {
      if (error.code === "EMAIL_TAKEN") {
        $scope.alert = ">> The user name has been taken, please try another one";
      }
      console.error("Error: ", error)
    });

  }
})

.controller('ListsCtrl', function($scope) {
  
})

.controller('FavoriatesCtrl', function($scope) {
  
})

.controller('MessagesCtrl', function($scope) {
  
})


.controller('ListCtrl', function($scope, $stateParams) {
});
