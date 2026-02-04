import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser"

import connectDB from './config/Database.js'
import foodRouter from './routes/food.route.js'
import router from './routes/user.routes.js'
import userDetailRouter from './routes/fetchUserDetail.route.js'

// load env variables
dotenv.config()

// app config
const app=express();
const PORT=process.env.PORT || 4000


// middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173'];
app.use(cors(
    {
        origin: function (origin,callback){
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true);
            }
            else{
                callback(new Error("Cors not allowed"));
            }
        },
        credentials: true
    }
));

// db connection
connectDB();

// api endpoints
app.use("/api/v1/food",foodRouter)
app.use('/images',express.static('uploads'))


// auth endpoints

app.use("/api/v1/auth",router);
app.use("/api/v1/user",userDetailRouter);


app.get('/',(req,res)=>{
    res.send("started with backend for food delivery project");
})


app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`);
})