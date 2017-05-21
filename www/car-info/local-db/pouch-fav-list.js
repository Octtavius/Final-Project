angular.module('starter').factory('favListServices', ['$q', recordServices]);

function favListServices($q) {
  var _db;
  var remoteDB;
  // We'll need this later.
  var _cars;


  function saveCar(car) {
    return $q.when(_db.post(car));
  };

  function deleteCar(car) {
    return $q.when(_db.remove(car));
  };

  function getFavList() {
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
    _db = new PouchDB('favouriteList');
    console.log(_db.adapter);
    remoteDB = new PouchDB('https://couchdb-77cd9f.smileupps.com/favouriteList');
    // remoteDB = new PouchDB('http://192.168.1.8:5984/records');
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

    // We'll add these later.
    getAllRecords: getAllRecords,
    addRecord: addRecord,
    deleteRecord: deleteRecord,
    syncRemoteDb: sync
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
