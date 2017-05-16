angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'ngCordovaBeacon'])
  .config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

  }])
  .run(function($ionicPlatform, BeaconsManager, $rootScope, AnalyticsServices, recordService, $state, $window, $location) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
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
      })

    recordService.initDB();


    // BeaconsManager.range();
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
            templateUrl: "templates/car-info.html",
            controller: "carInfoCtrl"
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
  .controller("TabsCtrl", function ($scope, $ionicSideMenuDelegate, cam) {
    $scope.title = "Interactive Cars"
    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
    };

    $scope.takePhoto = function () {
      $ionicSideMenuDelegate.toggleRight();

      cam.takePhoto()
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
  .controller("AssistanceCtrl", function ($scope, $ionicPlatform, $ionicPopup, $rootScope, socketFactory, $cordovaVibration, $interval, Data) {
    $scope.$on("$ionicView.afterEnter", function () {
      $('#car-desc-tab').attr("disabled", true);
      if($scope.nearestBeacon != null) {
        $scope.car = Data.carById($rootScope.nearestBeacon.minor)
      }
    })
    var onRequestSent = function () {
      $scope.button.request.sent = true;
      $scope.button.disabled = true;
      $scope.button.title = "Assistance request sent";
    };

    $scope.theSocket = null;

    $scope.button = {
      title: "Get assistance",
      request: {
        sent: false,
        received: false
      },
      disabled: false
    };
    $scope.metAssistanceBtn = {
      title: "I met the assistant",
      display: false
    };

    var listenersSet = false;

    var vibrationInterval = null;

    function updateUIonCancel() {
      if(vibrationInterval !== null) {
        $interval.cancel(vibrationInterval)
      }

      vibrationInterval = null;
      $scope.button.request.sent = false;
      $scope.button.title = "Assistance request sent";
      $scope.button.disabled = false;
      $scope.metAssistanceBtn.display = false
    }

    var setListeners = function () {
      $scope.theSocket = socketFactory({ioSocket: io.connect('https://final-server-project-octtavius7.c9users.io')});
      // $scope.theSocket = socketFactory({ioSocket: io.connect('http://192.168.1.8:3000')});
      //staff cancel the request
      $scope.theSocket.on("staff:reply", function () {
        $interval.cancel(vibrationInterval);
        vibrationInterval = null;
        hideMetAssistantBtn();
        $scope.button.request.sent = false;
      });

      $scope.theSocket.on("staff:arrived", function () {
        //change text back
        $scope.button.title =  "Get assistance";
        $scope.button.disabled = false;
        $scope.metAssistanceBtn.display = true;

        if(vibrationInterval === null) {
          vibrationInterval = $interval(function () {
            $cordovaVibration.vibrate(300)
          }, 800)
        }
        // Vibrate 100ms
      });
      $scope.theSocket.on("staff:accepted:request", function () {
        $scope.button.title = "Assistance is on its way"
      });
      $scope.theSocket.on("staff:canceled:request", function () {
        updateUIonCancel();
      })
    };

    var hideMetAssistantBtn = function () {
      $scope.metAssistanceBtn.display = false;
    };

    $scope.stopVibration = function () {
      $interval.cancel(vibrationInterval);
      vibrationInterval = null;
      hideMetAssistantBtn();
      $scope.button.request.sent = false;
      $scope.theSocket.emit('met:assistant');
      console.log("assitant met");
    };

    $scope.title = "Assistance page";
    $scope.requestAssistance = function () {

      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
            // .then(function(result) {
            //   if(!result) {
            //     $ionicPlatform.exitApp();
            //   }
            // });
        }
        else{
          if($rootScope.nearestBeacon != null) {
            console.log("THERE IS SOME NEAREST");
            if(!listenersSet) {
              console.log("setListeneres...");
              setListeners();
              listenersSet = true;
            }
            var msg = {
              carId: $scope.car.car_id,
              carName: $scope.car.brand.title + " " + $scope.car.model.title
            };
            $scope.theSocket.emit('send:request', msg);
            onRequestSent();
          }
          else {

            $ionicPopup.alert({
              title: "Out of Range",
              content: "Make sure you are in front of a car before requesting assistance."
            })
          }
        }
      }


    };
    $scope.cancelClientRequest = function () {
      $scope.theSocket.emit('client:cancel:request');
      updateUIonCancel();
    }
  })
  .controller("AllCarsCtrl", function ($scope, Data) {
    $scope.title = "All Cars";
    $scope.allCars = Data.getAllCars()
  })
  .controller("carInfoCtrl", function ($scope, Data, $state, $ionicHistory) {
    $scope.title = "NEW PAGE";
    var carId = $state.params.id;
    $scope.car = Data.carById(carId)

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    }
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

  .directive('showTabs', function(ngIfDirective) {
    var ngIf = ngIfDirective[0];

    return {
      transclude: ngIf.transclude,
      priority: ngIf.priority,
      terminal: ngIf.terminal,
      restrict: ngIf.restrict,
      link: function($scope, $element, $attr) {
        var value = $attr['showTabs'];
        var yourCustomValue = $scope.$eval(value);
        var tabs = document.querySelector(".tabs");
        console.log(tabs);
        console.log(yourCustomValue);

        $attr.ngIf = function() {
          return yourCustomValue;
        };

        ngIf.link.apply(ngIf, arguments);
      }
    };
  })
  .directive("mySideMenu", function () {
    return {
      restrict: "E",
      templateUrl: "templates/side-menu.html"
    }
  })

  .factory("cam", function ($cordovaCamera, StorageService) {
  var allPic = [];
  var tp = function() {
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      // targetWidth: 300,
      // targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      allPic.push("data:image/jpeg;base64," + imageData);
      StorageService.add("data:image/jpeg;base64," + imageData);
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  return{
    takePhoto:tp,
    getAllFotos:allPic
  }
})

  .factory ('StorageService', function ($localStorage) {
    $localStorage = $localStorage.$default({
      things: []
    });

    var _getAll = function () {
      return $localStorage.things;
    };
    var _add = function (thing) {
      // console.log("adding:  " + thing);
      $localStorage.things.push(thing);
    }
    var _remove = function (thing) {
      $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
    }
    return {
      getAll: _getAll,
      add: _add,
      remove: _remove
    };
  })
