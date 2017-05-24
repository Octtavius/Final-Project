angular.module('starter')
  .controller("carInfoCtrl", function ($q, $scope, $rootScope, Data, $state, $ionicHistory, authService, $ionicPopup, UserManager) {
    $scope.title = "NEW PAGE !";
    var carId = $state.params.id;
    $scope.carAdded = false;
    $scope.showLoadingIcon = false
    $scope.$on('$ionicView.beforeEnter', function(){
      UserManager.checkCarAdded(carId, function (isAdded) {
        $scope.carAdded = isAdded;
      });
    });
    var confirmPopup;

    var signUp = function () {
      // SIGN AUP
      var confirmPopup = $ionicPopup.confirm({
        title: "Sign Up",
        templateUrl: "authentication/templates/signup.html",
        okText: "Sign Up",
        scope: $scope
      });

      confirmPopup.then(function(res) {
        if(res) {
          //if email is email type and password has at least 3 chars
          if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
            //do signup
            authService.signUp($scope.data);
          }

        }
      });
    };

    var logIn = function () {
      // Login
      confirmPopup = $ionicPopup.confirm({
        title: "Log In",
        templateUrl: "authentication/templates/login.html",
        okText: "Log in",
        scope: $scope
      });

      confirmPopup.then(function(res) {
        if(res) {
          //if email is email type and password has at least 3 chars
          if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
            if (!authService.isInitiated()) {
              console.log("db is not initiated. we will do that");
              authService.initDB();
            }
            authService.signIn($scope.data, function (response) {
              console.log("hehheee: ", response );
              if(response === "unauthorized") {
                logIn();
              }
            })
          }
          else {
            console.log("somehting else");
          }
        }
        else {
          console.log("canceling");
        }
      });
    };

    $scope.car = Data.carById(carId);

    $scope.data = {};

    //this is function attatched to link on singin popup, on tap it will hide sigining popup
    //and will open sign up pop up
    $scope.redirectToSignUp = function () {
      confirmPopup.close();
      signUp();
    };

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };

    //save car info to local and remote db
    $scope.saveBookmark = function () {
      $scope.showLoadingIcon = true;
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
        }
        else{
          console.log("connection to server:  ");

          //check if is logged in and get back some anwser
          authService.isLoggedIn(function (response) {

            //if nobody is logged in/if suerCtx.name is false, show a form popup
            if(!response.userCtx.name) {
              // console.log("nobody is logged in: car info");
              logIn();
            }
            else if(response.userCtx.name){
              $rootScope.user = {email: response.userCtx.name};
              UserManager.addToList($scope.car, function (data) {
                $scope.showLoadingIcon = false;

                $scope.carAdded = true;

                console.log("the car should be added: . " + data);
              });
              console.log("somebody  is logged in: ", response.userCtx.name);
              console.log("somebody  is logged in: ", $rootScope.user.email);
            }
            else {
              console.log("error or user found");
            }
          });
        }
      }
      // console.log("save car");
      // userPouchDb.initDB();
      // userPouchDb.signUp();
    }
  });
