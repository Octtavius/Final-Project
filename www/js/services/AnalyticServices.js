/**
 * Created by I334037 on 21/04/2017.
 */

(function () {
  var module = angular.module('starter');

  var AnalyticsService = function (recordService) {

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
      console.log("++++  adding analytics");

      if(beaconId != undefined) {
        var record = {
          "enterTime": enterTime,
          "exitTime": exitTime,
          "beaconId": beaconId.minor
        };

        recordService.addRecord(record)
        // // Get all birthday records from the database.
        // recordService.getAllRecords().then(function(records) {
        //   var recs = records;
        //   console.log("--------DB 11--------------");
        //   console.log(typeof recs);
        //   // console.log(Object.keys(recs)[0]);
        //   // console.log(Object.keys(recs)[1]);
        //   // console.log(Object.keys(recs)[2]);
        //   console.log("--------DB111 --------------");
        // });
        // records.push(record);

        // if(records.length > 5) {
        //   console.log("we have 5 records. save to cloud");
        // }

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

  module.factory('AnalyticsServices', ['recordService', AnalyticsService]);
}());
