(function () {
  var module = angular.module('starter');

  var BeaconManager = function ($rootScope, $ionicPlatform, $cordovaBeacon, $compile, $window, $state) {
    //the counter will be used to collect how many beacons are in range... if 10 results will all be 0
    //then it means that device is not in range. now every half or 1 second, I get a number about how many
    //beacons are in range. because of internet, it somethime might show that there is 0 beacons even if there is
    //at leasst one. I need to collect more data to have a more accurate info
    var counter = 0;
    $rootScope.inRange = false;

    var itemsForAverage = [];
    var prevClosest = null;

    //check which beacon is nearer
    function isNearerThan(beacon1, beacon2) {
      if(beacon1.minor != beacon2.minor) {
        return beacon1.accuracy > 0
          && beacon2.accuracy > 0
          && beacon1.rssi > beacon2.rssi;
      }
      return false;
    }

    var updateNearestBeacon = function (beacons, nearestBeacon, callback) {
      for (var i = 0; i < beacons.length; ++i)
      {
        var beacon = beacons[i];

        //get rssi of beacons you want to compare, convert 1 to positive number, add them and
        var s1 = beacon.rssi;
        var s2 = nearestBeacon.rssi;

        var diff = s1 + Math.abs(s2);
        diff = Math.abs(diff);

        if (isNearerThan(beacon, nearestBeacon)) {
          // update nearer only if it is from different room, other2wise, don't update anything because
          // it means that beacons belong to the same room.
          nearestBeacon = beacon;
          callback(nearestBeacon);
        }
        callback(nearestBeacon)
      }
    };

    function calculateAverage(arr) {
      var average = 0;
      for(var j = 0; j < arr.length; j++) {
        average += arr[j]
      }
      average = average / arr.length;
      return average;
    }

    var rangeBeacons = function () {
      $rootScope.beacons = {};

      $ionicPlatform.ready(function () {
        $cordovaBeacon.requestWhenInUseAuthorization();

        var trackAndUpdateNearestRSSI = function (beacon) {
          //set mnearestBeacon rssi by collecting five rssi and doing average
          if($rootScope.nearestBeacon != null) {
            if($rootScope.nearestBeacon.minor == beacon.minor) {
              if(itemsForAverage.length >= 4) {
                var avg = calculateAverage(itemsForAverage);

                $rootScope.nearestBeacon.rssi = avg;

                //empty the array in order to get other 4 data to do average
                itemsForAverage = [];
              }
              itemsForAverage.push(parseInt(beacon.rssi));
            }
          }
        };


        //listen to the broadcast.....
        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, data) {
          var uniqueBeaconKey;
          // console.log("heyy beacon: " + counter);

          for(var i = 0; i < data.beacons.length; i++) {
            uniqueBeaconKey = data.beacons[i].uuid + ":" + data.beacons[i].major + ":" + data.beacons[i].minor;
            // //set nereast beacon to be any beacon which is detected first by the app.
            // if($rootScope.nearestBeacon != null) {
            //   console.log("ranging: " + $rootScope.nearestBeacon.minor);
            // }

            $rootScope.beacons[uniqueBeaconKey] = data.beacons[i];
            if($rootScope.nearestBeacon == null) {
              $rootScope.nearestBeacon = data.beacons[i];
            }
            else {
              // console.log($rootScope.nearestBeacon.minor);
            }
            updateNearestBeacon(data.beacons, $rootScope.nearestBeacon, function (result) {
              $rootScope.nearestBeacon = result;
              if(prevClosest != $rootScope.nearestBeacon) {
                //
                // console.log("================");
                // console.log($rootScope.inRange);
                // console.log("================");

                // // console.log("#/tab/home/"+ $rootScope.nearestBeacon.minor);
                // $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                //   // if($state.current.name === "tabs.facts" && from.name !== "tabs.home") {
                //   //   $state.go("tabs.home")
                //   // }
                //   // console.log(Object.keys(from)[1]);
                //   // console.log(Object.keys(from)[2]);
                //
                // });


                if(($state.is('tabs.home')) && !$rootScope.stateChangeAllowed) {
                  $window.location.href = "#/tab/home/" + $rootScope.nearestBeacon.minor;
                }

                prevClosest = $rootScope.nearestBeacon;
              }
            });
            //update nearest RSSI
            trackAndUpdateNearestRSSI(data.beacons[i]);
          }

          //if there is 0 beacons increase counter. if counter will become 10 it is more than real taht
          //the device is out of range. Otherwise if a beacon appeared for a while in range, than it means user
          //is in range
          if(data.beacons.length == 0) {
            if(counter <= 10) {
              counter ++;
            }
          }
          else {
            if(counter > 0) {
              counter = 0;
            }
            if (!$rootScope.inRange) {
              $rootScope.inRange = true;
              $compile($('#carDesc'))($rootScope)

            }
          }

          // if counter became 10 or higher, show that device is out of range, display a message
          if(counter >= 10) {

            if($rootScope.inRange !== false) {
              console.log("inragne is true");
              $rootScope.inRange = false;
              $rootScope.nearestBeacon = null;
              $compile($('#carDesc'))($rootScope);
            }
          }
          $rootScope.$apply();
        });

        //create range of beacons to look for
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"))
      });
    };

    var isInRange = function () {

      return $rootScope.inRange;
    };

    var tempEmulate = function () {

      console.log("setting nearest beacons");


      //????????????????????????????????????????????????????????
      //????????????????????????????????????????????????????????
      //????????????????????????????????????????????????????????
      // this is for testing purposes . remove this alter
      $rootScope.nearestBeacon = {
        UUID: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
        minor: "225",
        major: "222"
      };

      $rootScope.inRange = true;

      if(($state.is('tabs.home'))) {
        $window.location.href = "#/tab/home/" + $rootScope.nearestBeacon.minor;
      }

      //????????????????????????????????????????????????????????
      //????????????????????????????????????????????????????????
      //????????????????????????????????????????????????????????
      //????????????????????????????????????????????????????????
    }

    return {
      range: rangeBeacons,
      isInRange: isInRange,
      tempEmulate: tempEmulate
    }
  };

  module.factory('BeaconsManager', BeaconManager);
}());
