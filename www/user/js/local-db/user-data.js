angular.module('starter').factory('userDb', ['$q', userDb]);

function userDb($q) {
  var _db;
  var remoteDB;
  // We'll need this later.
  var _cars;


  function addCar(car, user) {
    if(!isInit()){
      initDB()
    };

    $q.when(_db.get(user.email).then(function (doc) {
      console.log("found something", doc._id);
      for (var i = 0; i < doc.favList.length; i++) {
        var carItem = doc.favList[i];

        if (carItem.car_id === car.car_id) {
          // console.log("we already have this car", carItem.car_id, car.car_id);
          break;
        }

        if(i === (doc.favList.length -1) && carItem.car_id !== car.car_id){
          // console.log("let's push it");
          doc.favList.push(car);
          _db.put({
            _id: user.email,
            _rev: doc._rev,
            favList: doc.favList
          });
        }
      }
    }).catch(function (err) {
      console.log("error", err.status, err.name, err.message);
      if(err.status === 404) {
        $q.when(_db.post({_id: user.email, favList: [car]}));
      }
    }))
    // return $q.when(_db.post({_id: user.email, favList: [car]}));
  };

  function deleteCar(car) {
    return $q.when(_db.remove(car));
  };

  function getAllCars() {
    if (!_cars) {
      return $q.when(_db.allDocs({ include_docs: true}))
        .then(function(docs) {

          // Each row has a .doc object and we just want to send an
          // array of record objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.
          _cars = docs.rows.map(function(row) {
            // Dates are not automatically converted from a string.
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });

          // Listen for changes on the database.
          _db.changes({ live: true, since: 'now', include_docs: true})
            .on('change', onDatabaseChange);

          return _cars_cars});
    } else {
      // Return cached data as a promise
      return $q.when(_cars);
    }
  };

  function onDatabaseChange(change) {
    var index = findIndex(_cars, change.id);
    var record = _cars[index];

    if (change.deleted) {
      if (record) {
        _cars.splice(index, 1); // delete
      }
    } else {
      if (record && record._id === change.id) {
        _cars[index] = change.doc; // update
      } else {
        _cars.splice(index, 0, change.doc) // insert
      }
    }
  }

// Binary search, the array is by default sorted by _id.
  function findIndex(array, id) {
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }

  function initDB() {
    // Creates the database or opens if it already exists
    _db = new PouchDB('user-fav-list');
    console.log(_db.adapter);
    remoteDB = new PouchDB('https://couchdb-77cd9f.smileupps.com/user-fav-list');
    // remoteDB = new PouchDB('http://192.168.1.8:5984/records');
  };

  var isInit = function () {
    return ((_db !== undefined && _db.name === "user-fav-list") &&
      (remoteDB !== undefined && remoteDB.name === "https://couchdb-77cd9f.smileupps.com/user-fav-list"))
  };


  var sync = function () {
    _db
      .replicate
      .to(remoteDB)
      .on('complete', function () {
        console.log("syncing......");
        // local changes replicated to remote
      }).on('error', function (err) {
      // error while replicating
      console.log("error syunc......\n", err);
    })
  };

  return {
    initDB: initDB,
    isInit: isInit,
    // We'll add these later.
    getAllCars: getAllCars,
    addCar: addCar,
    deleteCar: deleteCar,
    syncDb: sync
  };
}

// var movies = new PouchDB('Movies');
//
// movies
//     .info()
//     .then(function (info) {
//         console.log("<><><><><>><><><><><><><><><><");
//         console.log("<><><><><>><><><><><><><><><><");
//
//
//         console.log(info);
//         console.log("<><><><><>><><><><><><><><><><");
//         console.log("<><><><><>><><><><><><><><><><");
//     })
