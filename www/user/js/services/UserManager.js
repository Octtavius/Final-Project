angular.module('starter').factory('UserManager', ["userDb", "$rootScope", UserManager]);

function UserManager(userDb, $rootScope) {

  var cars;

  //keep track if this list was updated
  var carsRetrieved = false;

  var addCarToList = function (car) {
    // console.log(car.car_id);
    // console.log(car.brand.title);
    // console.log($rootScope.user.email);
    // console.log(userDb.isInit());
    userDb.addCar(car, $rootScope.user);
    userDb.syncDb();
    carsRetrieved = false;
  };

  var getAllCars = function (callback) {
    if(carsRetrieved){
      callback(cars)
    }else{
      userDb.getAllCars(function (allCars) {
        cars = allCars;
        carsRetrieved = true;
        callback(allCars);
      });
    }

  };

  return {
    addToList: addCarToList,
    getAllCars: getAllCars
  };
}
