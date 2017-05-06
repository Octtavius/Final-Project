var io = require('socket.io')(3000);

io.on('connection', function(socket){
  console.log("on connection")
  socket.on('send:request', function(data){
    var request = data.car;
    console.log("arrived request from car::::: " + request);
  });

  socket.on('leave:room', function(msg){
    msg.text = msg.user + " has left the room";
    socket.in(msg.room).emit('exit', msg);
    socket.leave(msg.room);
  });


  socket.on('send:message', function(msg){
    socket.in(msg.room).emit('message', msg);
  });

});
