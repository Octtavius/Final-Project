/**
 * Created by I334037 on 21/04/2017.
 */

(function () {
  var module = angular.module('starter');

  var AnalyticsService = function () {

    // var analyticsEnabled = false;

    var bid = null;
    var records = [];

    var enterTime = null;
    var exitTime = null;

    // function enableAnalytics() {
    //   analyticsEnabled = true;
    //   console.log("Analytics Enabled: "+analyticsEnabled);
    // }

    function enterRegion() {
      enterTime = new Date();
    }

    function exitRegion(beaconId) {
      exitTime = new Date();

      // if client explored car more than 10 seconds, than we could save it
      if(((exitTime - enterTime) / 1000) > 10) {
        saveRecord(enterTime, exitTime, beaconId);
      }
    }

    function saveRecord(enterTime, exitTime, beaconId) {

      if(beaconId != undefined) {
        var record = {
          "enterTime": enterTime,
          "exitTime": exitTime,
          "beaconId": beaconId
        };

        records.push(record);

        // console.dir(records);
      }
    }

    // function analyticsPermitted() {
    //   return analyticsEnabled;
    // }

    return {
      // analyticsPermitted: analyticsPermitted,
      // enableAnalytics: enableAnalytics,
      records: records,
      enterRegion: enterRegion,
      exitRegion: exitRegion
    }
  };

  module.factory('AnalyticsServices', AnalyticsService);
}());
