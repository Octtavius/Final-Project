angular.module('starter')
  .controller("AssistanceCtrl", function ($scope, $ionicPlatform, $ionicPopup, $rootScope, socketFactory, $cordovaVibration, $interval, Data) {

    var findCarInterval = null;

    var setClosestCar = function (beaconId) {
      $scope.car = Data.carById(beaconId);
    };

    $scope.$on("$ionicView.afterEnter", function () {
      $('#car-desc-tab').attr("disabled", true);
      if($scope.nearestBeacon != null) {
        setClosestCar($rootScope.nearestBeacon.minor);
      } else {
        if(findCarInterval === null) {
          findCarInterval = $interval(function () {
            if($rootScope.nearestBeacon !== null && $rootScope.nearestBeacon !== undefined) {
              console.log("there is a car");
              setClosestCar($rootScope.nearestBeacon.minor);
              $interval.cancel(findCarInterval);
            }
          }, 500)
        }
      }
    });

    // $scope.$on("$ionicView.afterEnter", function () {
    //   if(findCarInterval === null) {
    //     $interval.cancel(findCarInterval);
    //   }
    // });

    var disconnectClient = function (clientSocket) {
      listenersSet = false;
      updateUIonCancel();
      clientSocket.disconnect()
    }

    //when request was made, this function will set the parameters to change button into disabled and will show up another red button
    var onRequestSent = function () {
      $scope.button.request.sent = true;
      $scope.button.disabled = true;
      $scope.button.title = "Assistance request sent";
    };

    $scope.theSocket = null;

    //this is the request button
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

    //when user clicks on cancel, the ui wil be updated, meaing that red button will dissapear adn the request one will be again enabled
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
      // $scope.theSocket = socketFactory({ioSocket: io.connect('https://final-server-project-octtavius7.c9users.io')});
      $scope.theSocket = socketFactory({ioSocket: io.connect('http://192.168.1.8:3000')});
      // $scope.theSocket = socketFactory({ioSocket: io.connect('http://10.182.95.233:3000')});

      //staff cancel the request
      $scope.theSocket.on("staff:reply", function () {
        updateUIonCancel();
        disconnectClient($scope.theSocket)
      });


      $scope.theSocket.on("staff:arrived", function () {
        if(!$rootScope.appPaused){
          //change text back
          $scope.button.title =  "Get assistance";
          $scope.button.disabled = false;
          $scope.metAssistanceBtn.display = true;

          if(vibrationInterval === null) {
            vibrationInterval = $interval(function () {
              $cordovaVibration.vibrate(300)
            }, 800)
          }
        }
        else {
          $scope.theSocket.emit("notification:from:client:app:paused");
          onRequestSent()
          console.log("app is paused");
        }
        // Vibrate 100ms
      });

      $scope.theSocket.on("staff:accepted:request", function () {
        console.log("staff accepted request")
        $scope.button.title = "Assistance is on its way"
      });

      $scope.theSocket.on("disconnect", function () {
        console.log("DISCONNECTEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
      });

      $scope.theSocket.on("staff:canceled:request", function () {
        updateUIonCancel();
        disconnectClient($scope.theSocket)
      })
    };
    //
    // //set button metAssistance display to false, this way the UI will update
    // var hideMetAssistantBtn = function () {
    //   $scope.metAssistanceBtn.display = false;
    // };

    $scope.stopVibration = function () {
      //i use updateon cancel function as it does same things as it should do on assistance met
      updateUIonCancel();
      $scope.theSocket.emit('met:assistant');
    };

    $scope.title = "Assistance page";
    $scope.requestAssistance = function () {

      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
        }
        else{
          console.log("connection to server: ");
          console.log($rootScope.nearestBeacon);
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
      disconnectClient($scope.theSocket)
    }
  });
