angular.module('starter')
  .controller("carInfoCtrl", function ($scope, Data, $state, $ionicHistory) {
    $scope.title = "NEW PAGE";
    var carId = $state.params.id;
    $scope.car = Data.carById(carId)

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };

    $scope.saveBookmark = function () {
      console.log("save car");
    }
  });
