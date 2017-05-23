angular.module('starter')
  .controller("favListCtrl", function ($scope, $rootScope, UserManager) {
    $scope.title = "User fav list";

    $scope.$on("$ionicView.afterEnter", function () {
      UserManager.getAllCars(function (result) {
        console.log($rootScope.loggedIn);
        $rootScope.favCars = result;
      });
    });
  });
