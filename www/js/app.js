angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'ngCordovaBeacon'])
  .config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

  }])
  .run(function($ionicPlatform, BeaconsManager) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    BeaconsManager.range();
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
      console.log("-=====");
      $ionicSideMenuDelegate.toggleRight();
    };

    $scope.takePhoto = function () {
      console.log("take photo");
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
  .controller("AssistanceCtrl", function ($scope, $rootScope, socketFactory, $cordovaVibration, $interval, Data) {
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

    var setListeners = function () {
      $scope.theSocket = socketFactory({ioSocket: io.connect('http://192.168.1.8:3000')});
      //staff cancel the request
      $scope.theSocket.on("staff:reply", function (data) {
        console.log("staff replied");
        console.log(data);
      });

      $scope.theSocket.on("staff:arrived", function () {
        //change text back
        $scope.button.title =  "Get assistance";
        $scope.button.disabled = false;
        $scope.metAssistanceBtn.display = true;

        vibrationInterval = $interval(function () {
          $cordovaVibration.vibrate(300)
        }, 800)
        // Vibrate 100ms
      });
      $scope.theSocket.on("staff:accepted:request", function () {
        $scope.button.title = "Assistance is on its way"
      })
    };

    var hideMetAssistantBtn = function () {
      $scope.metAssistanceBtn.display = false;
    };

    $scope.stopVibration = function () {
      $interval.cancel(vibrationInterval);
      hideMetAssistantBtn();
      $scope.button.request.sent = false;
    }

    $scope.title = "Assistance page";
    $scope.requestAssistance = function () {
      console.log("requestinnnin");

      if($rootScope.nearestBeacon != null) {
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

      }
    };

    $scope.cancelClientRequest = function () {
      $scope.theSocket.emit('client:cancel:request');
      if(vibrationInterval !== null) {
        $interval.cancel(vibrationInterval)
      }
      $scope.button.request.sent = false;
      $scope.button.disabled = false;
    }


  })
  .controller("AllCarsCtrl", function ($scope, Data) {
    $scope.title = "All Cars";
    $scope.allCars = Data.getAllCars()
  })
  .controller('firstCtrl', function($scope, Data, $state, cam) {
    var carId = $state.params.id;
    $scope.car = Data.carById(carId)
    // $scope.toggleRight = function () {
    //   console.log("hhhhhh");
    //   $ionicSideMenuDelegate.toggleRight();
    // }
    $scope.title = "Interactive Beacon App";

    $scope.takePhoto = function () {
      console.log("take photo");
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
