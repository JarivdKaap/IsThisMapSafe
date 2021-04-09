import http from 'http';
import { Server, Socket } from 'socket.io';
import Container from 'typedi';
import config from '../config';

export default ({ server }: { server: http.Server }) => {
  let io = new Server(server, {
    path: '/socket-io',
    cors: {
      origin: config.socketio.clientOrigin,
      methods: ["GET", "POST"]
    }
  })

  Container.set('socket.io', io)
};