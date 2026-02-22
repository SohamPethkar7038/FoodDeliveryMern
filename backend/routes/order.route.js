import express from "express";
import { Router } from "express";
import { placeOrder,verifyOrder,userOrder } from "../controller/order.controller.js";
import verifyJWT from "../middlewares/user.middleware.js";
import OrderModel from "../models/Order.model.js";

const orderRouter = express.Router();

orderRouter.post('/placeorder',verifyJWT,placeOrder);
orderRouter.post('/verifyorder',verifyOrder);
orderRouter.post('/userorder',verifyJWT,userOrder);




export default orderRouter;