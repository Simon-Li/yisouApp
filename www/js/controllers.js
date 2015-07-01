angular.module('appYiSou.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicSideMenuDelegate) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    var ref = new Firebase("https://hosty.firebaseIO.com");
    ref.authWithPassword({
      email    : $scope.loginData.username,
      password : $scope.loginData.password
    }, function(error, authData) {
      if (error) {
        console.log(error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $scope.loginData.authResp = authData;
        $scope.closeLogin();
      }
    });
  };

  $scope.enterSignup = function() {
    $scope.closeLogin();
    $ionicSideMenuDelegate.toggleLeft();
    $state.go('app.signup');
  };

})

.controller('SignupCtrl', function($scope) {
  var ref = new Firebase("https://hosty.firebaseIO.com");
  $scope.alert = '';

  $scope.doSignup = function(userInfo) {
    console.log("%s, %s, %s", userInfo.username, userInfo.password, userInfo.confirmPassword)
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
    ref.createUser({
      email   : userInfo.username,
      password: userInfo.password
    }, function(error, userData) {
      if (error) {
        console.log(error);
      } else {
        console.log("Successfully created user account: ", userData);
        $scope.alert = '';
        //$scope.login(userInfo);
      }
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
