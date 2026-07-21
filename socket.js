import jwt from 'jsonwebtoken';
import { createCommentServiceAsync } from './Services/commentService.js';

let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.join(decoded.id);
      console.log(`User ${decoded.id} connected via socket`);
    } catch (error) {
      socket.disconnect();
      return;
    }

    socket.on('joinTicket', (ticketId) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on('leaveTicket', (ticketId) => {
      socket.leave(`ticket_${ticketId}`);
    });

    socket.on('sendMessage', async ({ ticketId, message }) => {
      try {
        const user = { id: socket.userId, role: socket.userRole };
        const comment = await createCommentServiceAsync(ticketId, message, user);
        ioInstance.to(`ticket_${ticketId}`).emit('newMessage', comment);
      } catch (error) {
        socket.emit('chatError', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

export const getIO = () => ioInstance;
