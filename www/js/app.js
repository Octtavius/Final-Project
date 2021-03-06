angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'ngCordovaBeacon'])
  .config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

  }])
  .run(function($ionicPlatform, BeaconsManager, $rootScope, AnalyticsServices, recordService, $state, $window, $location, authService) {
    $ionicPlatform.ready(function() {
      authService.isLoggedIn(function (response) {
          if(response.userCtx.name){
            $rootScope.loggedIn = true
          }
          else {
            $rootScope.loggedIn = false;
          }
      })

      $rootScope.appPaused = false;
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      //listen to when app is minimized/working in background
      $ionicPlatform.on("pause", function (event) {
        $rootScope.appPaused = true;
        //code for action on pause
      }, false);
      $ionicPlatform.on("resume", function (event) {
        $rootScope.appPaused = false;
        //code for action on resume
      }, false);
    });

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){

        if((toState.name === ('tabs.home'))) {
          if($rootScope.nearestBeacon != null) {
            //check if page is not updated based on beacons
            // console.log($location.path());
            // console.log($location.path() === (+"/tab/home/" + $rootScope.nearestBeacon.minor));
            if (($location.path()).indexOf($rootScope.nearestBeacon.minor) === -1) {

              $window.location.href = "#/tab/home/" + $rootScope.nearestBeacon.minor;
            }
          }
        }
      });

    recordService.initDB();

    BeaconsManager.range();

    // BeaconsManager.tempEmulate();
      $rootScope.$watch('nearestBeacon', function (nearestBeacon, previousBeacon) {
        if(nearestBeacon != undefined && previousBeacon === undefined) {
          // $scope.beaconType = 1;
          AnalyticsServices.enterRegion();
        } else if (nearestBeacon != undefined && previousBeacon != undefined) {
          // $scope.beaconType = 2;
          AnalyticsServices.exitRegion(previousBeacon);
          AnalyticsServices.enterRegion();
        } else if (nearestBeacon === undefined && previousBeacon != undefined) {
          // $scope.beaconType = 3;
          AnalyticsServices.exitRegion(previousBeacon);
        }
      }, true)
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: "TabsCtrl"
      })

      .state('tabs.first', {
        url: "/first",
        views: {
          'home-tab': {
            templateUrl: "templates/first.html",
            controller: "firstCtrl"
          }
        }
      })
      .state('tabs.info', {
        url: "/info/:id",
        views: {
          'info-tab': {
            templateUrl: "car-info/templates/car-info.html",
            controller: "carInfoCtrl"
          }
        }
      })

      .state('tabs.fav-list', {
        url: "/fav-list",
        views: {
          'fav-list-tab': {
            templateUrl: "user/templates/fav-list.html",
            controller: "favListCtrl"
          }
        }
      })

      .state('tabs.home', {
        url: "/home/:id",
        views: {
          'home-tab': {
            templateUrl: "templates/car-details.html",
            controller: 'firstCtrl'
          }
        }
      })
      .state('tabs.facts', {
        url: "/facts",
        views: {
          'home-tab': {
            templateUrl: "templates/assistance-page.html",
            controller: 'AssistanceCtrl'
          }
        }
      })
      .state('tabs.facts2', {
        url: "/facts2",
        views: {
          'home-tab': {
            templateUrl: "templates/facts2.html"
          }
        }
      })
      .state('tabs.about', {
        url: "/about",
        views: {
          'about-tab': {
            templateUrl: "templates/all-cars.html",
            controller: "AllCarsCtrl"
          }
        }
      })
      .state('tabs.navstack', {
        url: "/navstack",
        views: {
          'about-tab': {
            templateUrl: "templates/nav-stack.html"
          }
        }
      })
      .state('tabs.contact', {
        url: "/contact",
        views: {
          'contact-tab': {
            templateUrl: "templates/photo-gallery.html",
            controller: "GalleryCtrl"
          }
        }
      });
    $urlRouterProvider.otherwise("/tab/home/111");
  })
  .controller("TabsCtrl", function ($scope, $ionicSideMenuDelegate, cam, authService, $rootScope, $ionicPopup, $state) {
    $scope.title = "Interactive Cars";
    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
    };

    $scope.takePhoto = function () {
      $ionicSideMenuDelegate.toggleRight();

      cam.takePhoto();
    };

    var confirmPopup;
    //log out the user
    $scope.logIn = function () {
      console.log("logging in");

      console.log($state.current.name);
      // Login
      confirmPopup = $ionicPopup.confirm({
        title: "Log In",
        templateUrl: "authentication/templates/login.html",
        okText: "Log in",
        scope: $scope
      });

      confirmPopup.then(function(res) {
        if(res) {

          $scope.data = {
            email: angular.element('#loginInputEmail').val(),
            password: angular.element('#loginInputPassword').val()
          };


          //if email is email type and password has at least 3 chars
          if($scope.data.email !== undefined && $scope.data.password.length >= 3) {
            if (!authService.isInitiated()) {
              console.log("db is not initiated. we will do that");
              authService.initDB();
            }
            authService.signIn($scope.data, function (response) {
              console.log("hehheee: ", response );
              if(response === "unauthorized") {
                $scope.logIn();
              }
            })
          }
          else {
            console.log("somehting else");
          }
        }
      });
    }

    //log out the user
    $scope.logOut = function () {
      $rootScope.favCars = [];
      authService.logOut(function (response) {

        // if(response ){
          if( response.ok !== undefined && response.ok){

            console.log("logged out successfully", response.ok);
          }
        // }
        else if(response.status !== undefined && response.status === 404){
            console.log("logged out  failed", response.status);
          }
      });
    }

  })
  .controller("GalleryCtrl", function ($scope, cam, StorageService) {
    $scope.title = "My Photos";
    $scope.allpic = [];

    //when screen page is loaded, display somehting to console
    // $scope.$on('$ionicView.afterEnter', function(){
    console.log("After Entered Interactive Guide");
    $scope.allpic = cam.getAllFotos;
    // $scope.allpic = ["A7", "mercedes1", "tesla_model_s", "volkswagen_beetle", "wheelSystem", "temp"];
    // $scope.allpic = ["DSC_0062", "DSC_0063", "DSC_0064", "DSC_0065", "DSC_0066"];
    // console.log($scope.allpic.length);
    $scope.things = StorageService.getAll();
    console.log($scope.things.length);
  })
  .controller("AllCarsCtrl", function ($scope, Data, authService) {
    $scope.title = "All Cars";
    $scope.allCars = Data.getAllCars();
  })
  .controller('firstCtrl', function($scope, Data, $state, cam, $ionicSideMenuDelegate) {


    var carId = $state.params.id;
    $scope.car = Data.carById(carId)
    // $scope.toggleRight = function () {
    //   console.log("hhhhhh");
    //   $ionicSideMenuDelegate.toggleRight();
    // }
    $scope.title = "Interactive Beacon App";

    $scope.takePhoto = function () {

      $ionicSideMenuDelegate.toggleRight();
      cam.takePhoto()
    }
    // $scope.toggleRight = function () {
    //   console.log("-=====");
    //   // $ionicSideMenuDelegate.toggleRight();
    // };
  })


