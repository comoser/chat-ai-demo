const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const rooms = [];
const messagesByRoom = {};

app.post('/rooms', (req, res) => {
  const room = req.body.room;
  console.log('room create', room);
  rooms.push(room);
  if (!messagesByRoom[room]) {
    messagesByRoom[room] = [];
  }
  res.json({});
});

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/messages/:room', (req, res) => {
  const room = req.params.room;
  res.json(messagesByRoom[room] ?? []);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://clear-impalas-brush.loca.lt',
    // origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (room) => {
    console.log('user joined', room);
    socket.join(room);
  });

  socket.on('message', (room, message) => {
    console.log('message to', room, message);
    io.to(room).emit('message', `${socket.id}: ${message}`);
    messagesByRoom[room] && messagesByRoom[room].push(`${socket.id}: ${message}`);
    // TODO: contact the API here on the message event
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
