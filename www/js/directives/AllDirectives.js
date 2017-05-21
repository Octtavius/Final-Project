angular.module('starter')
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
