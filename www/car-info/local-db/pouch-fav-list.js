angular.module('starter').factory('userPouchDb', ['$q', favListServices]);

function favListServices($q) {
  var _db;
  var remoteDB;
  // We'll need this later.
  var _cars;

  // function doSignUp(user) {
  //   remoteDB.signup(user.email, user.password, function (err, response) {
  //     if (err) {
  //       // console.log("some error")
  //       if (err.name === 'conflict') {
  //         console.log("error name: ");
  //         console.log(err.name);
  //         // "batman" already exists, choose another username
  //       } else if (err.name === 'forbidden') {
  //         // invalid username
  //         console.log("name is forbidden");
  //       } else {
  //         console.log("http error: ");
  //       }
  //     }
  //     else {
  //       console.log("signed up. send back some response...")
  //     }
  //   });
  //
  //   sync();
  // }

  function saveCar(car) {
    return $q.when(_db.post(car));
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

          return _cars;
        });
    } else {
      // Return cached data as a promise
      return $q.when(_cars);
    }
  };

  function onDatabaseChange(change) {
    var index = findIndex(_cars, change.id);
    var car = _cars[index];

    if (change.deleted) {
      if (car) {
        _cars.splice(index, 1); // delete
      }
    } else {
      if (car && car._id === change.id) {
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
    remoteDB =new PouchDB('https://couchdb-77cd9f.smileupps.com/users', {skipSetup: true});
    console.log(remoteDB.adapter);
    _db =  new PouchDB('users');
    // remoteDB = new PouchDB('http://192.168.1.8:5984/records');
  };

  var sync = function () {
    _db.sync(remoteDB, {live: true, retry: true}).on('error', console.log.bind(console));
  };

  var isInit = function () {
    return (remoteDB !== undefined && remoteDB.name === "https://couchdb-77cd9f.smileupps.com/users")
  };

  return {
    initDB: initDB,
    // We'll add these later.
    getAllCars: getAllCars,
    saveCar: saveCar,
    deleteCar: deleteCar,
    syncRemoteDb: sync,
    // signUp: doSignUp,
    isInitiated: isInit
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
