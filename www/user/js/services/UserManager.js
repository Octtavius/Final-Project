angular.module('starter').factory('UserManager', ["userDb", "$rootScope", UserManager]);

function UserManager(userDb, $rootScope) {
  var addCarToList = function (car) {
    // console.log(car.car_id);
    // console.log(car.brand.title);
    // console.log($rootScope.user.email);
    // console.log(userDb.isInit());
    userDb.addCar(car, $rootScope.user);
    userDb.syncDb()
  };

  return {
    addToList: addCarToList
  };
}
