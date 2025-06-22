// websocket-server/server.js
const app = require('http').createServer();
const io = require('socket.io')(app, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log('Client connected', socket.id);

  socket.on('private-message', data => {
    console.log('Private Message:', data);
    io.to(data.channel).emit('message', data.message);
  });

  socket.on('join', channel => {
    console.log(`Socket ${socket.id} joined ${channel}`);
    socket.join(channel);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

app.listen(6001, () => {
  console.log('WebSocket server running on port 6001');
});
