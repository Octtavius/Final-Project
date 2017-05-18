(function(){

  angular.module('starter')
    .service('SocketService', ['socketFactory', SocketService]);

  function SocketService(socketFactory){

    var ioSocket = io.connect('/', {});
    socketFactory = socketFactory({ioSocket: ioSocket})
    socketFactory.disconnect = function () {
      ioSocket.disconnect();
    };

    return socketFactory;
  }
})();
