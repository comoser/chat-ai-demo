const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {HumanChatMessage} = require("langchain/schema");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const rooms = [];
const messagesByRoom = {};
const model = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9});

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

app.get('/chat', async () => {
  //First try, just an example of usage
  try {
    const res = await model.call([
      new HumanChatMessage("What would be a good company name a company that makes colorful socks?")
    ]);
    console.log(res);

  }catch (e){
    console.log('Error: ',e)
  }

});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_TUNNEL_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (room) => {
    console.log('user joined', room);
    socket.join(room);
  });

  socket.on('message', async (room, message) => {
    console.log('message to', room, message);
    io.to(room).emit('message', `${socket.id}: ${message}`);
    messagesByRoom[room] && messagesByRoom[room].push(`${socket.id}: ${message}`);
    const aiResponse = await askAI(message)
    // TODO: contact the API here on the message event
    io.to(room).emit('message', `ai: ${aiResponse}`);
    messagesByRoom[room] && messagesByRoom[room].push(`AI: ${aiResponse}`);

  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const askAI = async (message) => {
  const res = await model.call([
    new HumanChatMessage(message)
  ]);
  return res.text
}

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
