angular.module('starter')
  .controller("carInfoCtrl", function ($scope, Data, $state, $ionicHistory, authService, userPouchDb, $ionicPopup) {
    $scope.title = "NEW PAGE !";
    var carId = $state.params.id;
    $scope.car = Data.carById(carId)

    $scope.data = {};

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };

    $scope.saveBookmark = function () {

      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
        }
        else{
          console.log("connection to server: ");

          //check if is logged in and get back some anwser
          authService.isLoggedIn(function (response) {

            //if nobody is logged in/if suerCtx.name is false, show a form popup
            if(!response.userCtx.name) {
              // console.log("nobody is logged in: car info");

              // Login
              var confirmPopup = $ionicPopup.confirm({
                title: "Log In",
                templateUrl: "authentication/templates/login.html",
                okText: "Log in",
                scope: $scope
              });

              confirmPopup.then(function(res) {
                if(res) {
                  console.log('Sure!');
                  //if email is email type and password has at least 3 chars
                  if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
                    console.log("etaill");
                    if (!authService.isInitiated()) {
                      console.log("db is not initiated. we will do that");
                      authService.initDB();
                    }
                    $scope.user = authService.signIn($scope.data);
                  }
                } else {
                  console.log('Not sure!');
                }
              });
            }
            else if(response.userCtx.name){
              $scope.user = {email: response.userCtx.name};
              console.log("somebody  is logged in: ", response.userCtx.name);
              console.log("somebody  is logged in: ", $scope.user.email);
            }
            else {
              console.log("error or user found");
            }
          })



          // SIGN AUP
          // var confirmPopup = $ionicPopup.confirm({
          //   title: "Out of Range",
          //   templateUrl: "authentication/templates/signup.html",
          //   okText: "Sign Up",
          //   scope: $scope
          // });
          //
          // confirmPopup.then(function(res) {
          //   if(res) {
          //     console.log('Sure!');
          //     //if email is email type and password has at least 3 chars
          //     if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
          //       if (!authService.isInitiated()) {
          //         console.log("db is not initiated. we will do that");
          //         authService.initDB();
          //       }
          //       authService.signUp($scope.data);
          //     }
          //
          //   } else {
          //     console.log('Not sure!');
          //   }
          // });
        }
      }
      // console.log("save car");
      // userPouchDb.initDB();
      // userPouchDb.signUp();
    }
  });
