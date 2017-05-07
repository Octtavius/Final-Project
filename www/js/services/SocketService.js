// (function(){
//
//   angular.module('starter')
//     .service('SocketService', ['socketFactory', SocketService]);
//
//   function SocketService(socketFactory){
//
//     // SocketService.on('message', function(msg){
//     //   console.log("hehhhee");
//     // });
//
//     var ioSocket = null;
//     var connect = function () {
//       ioSocket = socketFactory({ioSocket: io.connect('http://localhost:3000')});
//     };
//     var emit = function (event, msg) {
//       ioSocket.emit(event, msg)
//     }
//     // return socketFactory({ioSocket: io.connect('http://localhost:3000')});
//     return {
//       connect: connect,
//       emit: emit,
//       theSocket: ioSocket
//     }
//   }
// })();
