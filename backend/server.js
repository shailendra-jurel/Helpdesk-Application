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
// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server (development)
  'http://localhost:3000', // React dev server (optional)
  process.env.VERCEL_URL || 'https://helpdesk-application.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);  // Log the full error
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

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


const PORT = process.env.PORT ||  5001 || 5002;
app.get("/", (req, res) => { 
  res.send("Hello World!");
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});