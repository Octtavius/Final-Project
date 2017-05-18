angular.module('starter')
  .controller("AssistanceCtrl", function ($scope, $ionicPlatform, $ionicPopup, $rootScope, socketFactory, $cordovaVibration, $interval, Data) {
    $scope.$on("$ionicView.afterEnter", function () {
      $('#car-desc-tab').attr("disabled", true);
      if($scope.nearestBeacon != null) {
        $scope.car = Data.carById($rootScope.nearestBeacon.minor)
      }
    });


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
      console.log("set listeners");
      // $scope.theSocket = socketFactory({ioSocket: io.connect('https://final-server-project-octtavius7.c9users.io')});
      $scope.theSocket = socketFactory({ioSocket: io.connect('http://192.168.1.8:3000')});
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

      $scope.theSocket.on("disconnect", function () {
        console.log("DISCONNECTEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
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
      $scope.theSocket.disconnect();
      // $scope.theSocket = null;
      listenersSet = false;
      updateUIonCancel();
    }
  })
