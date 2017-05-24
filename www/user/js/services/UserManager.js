angular.module('starter').factory('UserManager', ["userDb", "$rootScope", UserManager]);

function UserManager(userDb, $rootScope) {

  var cars;

  //keep track if this list was updated
  var carsRetrieved = false;

  var addCarToList = function (car, callback) {
    // console.log(car.car_id);
    // console.log(car.brand.title);
    // console.log($rootScope.user.email);
    // console.log(userDb.isInit());

    userDb.addCar(car, $rootScope.user, function (data) {
      console.log("added");
      callback(data)
    });
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

  var checkCarAdded = function (carId, callback) {
    var carAdded = false;

    var findCar = function () {
      for (var i = 0; i < cars.length; i++) {
        var c = cars[i];
        console.log("c-->>>>   " + c.car_id)
        if(carId === c.car_id) {
          carAdded = true;
          break;
        }
      }
      callback(carAdded)
    }

    if(!carsRetrieved){
      console.log("are cars retrieved?: " + carsRetrieved);
      getAllCars(function (allCars) {
        cars = allCars;
        findCar();
      })
    }
    else {
      findCar()
    }

  }

  return {
    addToList: addCarToList,
    getAllCars: getAllCars,
    checkCarAdded: checkCarAdded
  };
}
