angular.module('starter').factory('recordService', ['$q', recordService]);

function recordService($q) {
    var _db;

    // We'll need this later.
    var _records;


    function addRecord(record) {
        return $q.when(_db.post(record));
    };

    function deleteRecord(record) {
        return $q.when(_db.remove(record));
    };

    function getAllRecords() {
        if (!_records) {
            return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {

                    // Each row has a .doc object and we just want to send an
                    // array of record objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    _records = docs.rows.map(function(row) {
                        // Dates are not automatically converted from a string.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                        .on('change', onDatabaseChange);

                    return _records;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_records);
        }
    };

    function onDatabaseChange(change) {
        var index = findIndex(_records, change.id);
        var record = _records[index];

        if (change.deleted) {
            if (record) {
                _records.splice(index, 1); // delete
            }
        } else {
            if (record && record._id === change.id) {
                _records[index] = change.doc; // update
            } else {
                _records.splice(index, 0, change.doc) // insert
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
        _db = new PouchDB('records');
    };


  return {
    initDB: initDB,

    // We'll add these later.
    getAllRecords: getAllRecords,
    addRecord: addRecord,
    deleteRecord: deleteRecord
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
