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
  console.log('a user connected', socket.id);
  idmap[socket.id] = Math.floor(Math.random() * 4294967295);
  players[idmap[socket.id]] = {
    x: 0,
    y: 0,
    color: {
      r: 0,
      g: 0,
      b: 0
    }
  }

  socket.on('player_pos', (data) => {
    delete players[idmap[socket.id]];
    socket.emit('players_update', players);
    players[idmap[socket.id]] = {
      x: data.x,
      y: data.y,
      color: data.color
    }
  });

  socket.on('disconnect', () => {
    delete players[idmap[socket.id]];
    delete idmap[socket.id];
  });

});