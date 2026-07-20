
import 'dotenv/config';
import express from 'express';
import connectDB from './Data/mongoConnect.js';
import errorHandler from './Middleware/errorHandler.js';
import authRoutes from './Routes/authRoutes.js';
const app = express();
app.use(express.json());

await connectDB();
app.use('/api/auth', authRoutes);




app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

