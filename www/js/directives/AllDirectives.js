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
