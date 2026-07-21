
import 'dotenv/config';
import express from 'express';
import connectDB from './Data/mongoConnect.js';
import errorHandler from './Middleware/errorHandler.js';
import authRoutes from './Routes/authRoutes.js';
import ticketRoutes from './Routes/ticketRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import commentRoutes from './Routes/commentRoutes.js';
import notificationRoutes from './Routes/notificationRoutes.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'
import { initSocket } from './socket.js';


const app = express();
app.use(express.json());
app.use(cors());
await connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes)
app.use('/api/notifications', notificationRoutes)

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler)

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});
initSocket(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


