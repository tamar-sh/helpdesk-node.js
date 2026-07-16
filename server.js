
import 'dotenv/config';
import express from 'express';
import connectDB from './Data/mongoConnect.js';
const app = express();
app.use(express.json());

await connectDB();


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

