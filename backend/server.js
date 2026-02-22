import 'dotenv/config'; // load env variables
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/Database.js';
import foodRouter from './routes/food.route.js';
import userRouter from './routes/user.routes.js';
import userDetailRouter from './routes/fetchUserDetail.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';

// ------------------ App Config ------------------
const app = express();
const PORT = process.env.PORT || 4000;

// ------------------ Middlewares ------------------
app.use(express.json());
app.use(cookieParser());

// ------------------ CORS Setup ------------------
const allowedOrigins = [
  'http://localhost:5173', // React dev server
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // <--- important for cookies
}));

// ------------------ DB Connection ------------------
connectDB();

// ------------------ Routes ------------------
app.use('/api/v1/food', foodRouter);
app.use('/images', express.static('uploads')); // static folder

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/user', userDetailRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);

// ------------------ Test Route ------------------
app.get('/', (req, res) => {
  res.send("Backend for Food Delivery Project is running.");
});

// ------------------ Global Error Handler ------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});