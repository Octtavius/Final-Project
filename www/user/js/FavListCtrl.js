angular.module('starter')
  .controller("favListCtrl", function ($scope, $rootScope, UserManager) {
    $scope.title = "User fav list";

    $scope.$on("$ionicView.afterEnter", function () {
      UserManager.getAllCars(function (result) {
        $scope.favCars = result;
      });

    })
    // var carId = $state.params.id;
    //
    // var confirmPopup;
    //
    // var signUp = function () {
    //   // SIGN AUP
    //   var confirmPopup = $ionicPopup.confirm({
    //     title: "Sign Up",
    //     templateUrl: "authentication/templates/signup.html",
    //     okText: "Sign Up",
    //     scope: $scope
    //   });
    //
    //   confirmPopup.then(function(res) {
    //     if(res) {
    //       //if email is email type and password has at least 3 chars
    //       if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
    //         //do signup
    //         authService.signUp($scope.data);
    //       }
    //
    //     }
    //   });
    // };
    //
    // var logIn = function () {
    //   // Login
    //   confirmPopup = $ionicPopup.confirm({
    //     title: "Log In",
    //     templateUrl: "authentication/templates/login.html",
    //     okText: "Log in",
    //     scope: $scope
    //   });
    //
    //   confirmPopup.then(function(res) {
    //     if(res) {
    //       //if email is email type and password has at least 3 chars
    //       if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
    //         if (!authService.isInitiated()) {
    //           console.log("db is not initiated. we will do that");
    //           authService.initDB();
    //         }
    //         authService.signIn($scope.data, function (response) {
    //           console.log("hehheee: ", response );
    //           if(response === "unauthorized") {
    //             logIn();
    //           }
    //         })
    //       }
    //       else {
    //         console.log("somehting else");
    //       }
    //     }
    //   });
    // };
    //
    // $scope.car = Data.carById(carId);
    //
    // $scope.data = {};
    //
    // //this is function attatched to link on singin popup, on tap it will hide sigining popup
    // //and will open sign up pop up
    // $scope.redirectToSignUp = function () {
    //   confirmPopup.close();
    //   signUp();
    // };
    //
    // $scope.myGoBack = function () {
    //   $ionicHistory.goBack();
    // };
    //
    // //save car info to local and remote db
    // $scope.saveBookmark = function () {
    //   if(window.Connection) {
    //     if(navigator.connection.type == Connection.NONE) {
    //       $ionicPopup.alert({
    //         title: "Internet Disconnected",
    //         content: "The internet is disconnected on your device."
    //       })
    //     }
    //     else{
    //       console.log("connection to server: ");
    //
    //       //check if is logged in and get back some anwser
    //       authService.isLoggedIn(function (response) {
    //
    //         //if nobody is logged in/if suerCtx.name is false, show a form popup
    //         if(!response.userCtx.name) {
    //           // console.log("nobody is logged in: car info");
    //           logIn();
    //         }
    //         else if(response.userCtx.name){
    //           $rootScope.user = {email: response.userCtx.name};
    //           UserManager.addToList($scope.car);
    //           console.log("somebody  is logged in: ", response.userCtx.name);
    //           console.log("somebody  is logged in: ", $rootScope.user.email);
    //         }
    //         else {
    //           console.log("error or user found");
    //         }
    //       });
    //     }
    //   }
    //   // console.log("save car");
    //   // userPouchDb.initDB();
    //   // userPouchDb.signUp();
    // }
  });
