angular.module('starter').factory('authService', ['$q', "$rootScope", authService]);

function authService($q, $rootScope) {
  var _db;
  var remoteDB;

  var doSignUp = function(user) {

    //check if database is initialized
    if (!isInit()) {
      initDB();
    }
    remoteDB.signup(user.email, user.password, function (err, response) {
      if (err) {
        // console.log("some error")
        if (err.name === 'conflict') {
          // console.log("error name: ");
          // console.log(err.name);
          // "batman" already exists, choose another username
        } else if (err.name === 'forbidden') {
          // invalid username
          // console.log("name is forbidden");
        } else {
          // console.log("http error: ");
        }
      }
      else {
        console.log("signed up. send back some response...")
      }
    });

    sync();
  }

  var doSignIn = function(user, callback) {
    console.log("singing in")
    remoteDB.login(user.email, user.password, function (err, response) {
      if (err) {
        if (err.name === 'unauthorized') {
          // name or password incorrect
          console.log("name or password is incorrect: " + err.name);
          callback(err.name);
        } else {
          // should be other error
          callback(err);
        }
        $rootScope.loggedIn = false;

      }
      else {
        sync();
        $rootScope.loggedIn = true;
        callback(response);
      }

      $rootScope.$apply()
    });
  };

  var getSession = function (callback) {
    if(!isInit()){
      initDB();
    }

    // _db.info().then(function (info) {
    //   console.log(Object.keys(info)[0]);
    //   console.log(Object.keys(info)[1]);
    //   console.log(Object.keys(info)[2]);
    //   console.log(Object.keys(info)[3]);
    //   console.log(Object.keys(info)[4]);
    //   console.log(Object.keys(info)[5]);
    //
    //   console.log(info.doc_count);
    //   console.log(info.db_name);
    // })

    remoteDB.getSession(function (err, response) {
      if (err) {
        // network error
        console.log("nettwork error");
      } else if (!response.userCtx.name) {
        // nobody's logged in
        console.log("nobody logged in");
        callback(response)
        //returns false if nobody is logged in
        // return !response.userCtx.name

      } else {
        // response.userCtx.name is the current user
        callback(response)
        // return response
      }
    });
  };

  var logout = function (callback) {

    getSession(function (resp) {
      if(resp.userCtx.name){
        remoteDB.logout(function (err, response) {
          if (err) {
            // network error
            // console.log("some.. error");
            // console.log(typeof err);
            callback(err);
          }
          else if(response){

            callback(response);
          }
        })

        $rootScope.loggedIn = false;
        $rootScope.$apply()
      }
    });
  };

  function initDB() {
    // Creates the database or opens if it already exists
    remoteDB =new PouchDB('https://couchdb-77cd9f.smileupps.com/users', {skipSetup: true});
    // console.log(remoteDB.adapter);
    _db =  new PouchDB('users');
    // remoteDB = new PouchDB('http://192.168.1.8:5984/records');
  };

  var sync = function () {
    _db.sync(remoteDB, {live: true, retry: true}).on('error', console.log.bind("??? " + console));
  };

  var isInit = function () {
    return (remoteDB !== undefined && remoteDB.name === "https://couchdb-77cd9f.smileupps.com/users")
  };

  return {
    initDB: initDB,
    syncRemoteDb: sync,
    signUp: doSignUp,
    signIn: doSignIn,
    isInitiated: isInit,
    isLoggedIn: getSession,
    logOut: logout
  };
}
