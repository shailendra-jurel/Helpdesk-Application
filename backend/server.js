// backend/server.js
import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";

//Routes
import authRoutes from './routes/authRoute.js';
import ticketRoutes from './routes/ticketRoute.js';
import userRoutes from './routes/userRoute.js';
const app = express();
app.use(cors());
app.use(express.json());

// Error handling middleware
// app.use((err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//       message: err.message,
//       stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//     });
//   });

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  connectDB();
  // Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);


const PORT =  process.env.PORT || 3000;
app.get("/", (req, res) => { 
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});