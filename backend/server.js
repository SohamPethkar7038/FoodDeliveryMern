import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './config/Database.js'
import foodRouter from './routes/food.route.js'

// load env variables
dotenv.config()

// app config
const app=express();
const PORT=process.env.PORT || 4000


// middlewares
app.use(express.json());
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use('/images',express.static('uploads'))



app.get('/',(req,res)=>{
    res.send("started with backend for food delivery project");
})


app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`);
})