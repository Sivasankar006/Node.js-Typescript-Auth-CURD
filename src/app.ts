import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
const app = express();
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

app.use('/api/auth', authRoutes);


// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
