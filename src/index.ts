import pino from 'pino-http'
import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    }
}))

app.get('/', function (req, res) {
    req.log.info('something')
    res.send('hello world')
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});