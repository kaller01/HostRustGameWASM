const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 3090


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.use(express.static('public'))

http.listen(port, () => console.log(`Listening on port ${port}`));

const idmap = {};

const players = {};

io.on('connection', (socket) => {
  idmap[socket.id] = Math.floor(Math.random() * 4294967295);
  players[idmap[socket.id]] = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  }

  socket.on('update_player', (data) => {
    delete players[idmap[socket.id]];
    socket.emit('players_update', players);
    players[idmap[socket.id]] = {
      x: data.x || 0,
      y: data.y || 0,
      vx: data.vx || 0,
      vy: data.vy || 0,
      name: data.name || ""
    }
  });

  socket.on('event', (data) => {
    //Should probably do some checks
    data.id = idmap[socket.id];
    console.log(data);
    socket.broadcast.emit("event", data);
  });

  socket.on('disconnect', () => {
    delete players[idmap[socket.id]];
    io.emit("player_disconnect", idmap[socket.id]);
    delete idmap[socket.id];
  });

});