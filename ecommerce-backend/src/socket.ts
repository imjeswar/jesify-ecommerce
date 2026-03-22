import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "https://jesify-ecommerce-clgc.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('join', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
