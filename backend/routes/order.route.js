import express from "express";
import { Router } from "express";
import { placeOrder } from "../controller/order.controller.js";
import verifyJWT from "../middlewares/user.middleware.js";
import OrderModel from "../models/Order.model.js";

const orderRouter = express.Router();

orderRouter.post('/placeorder',verifyJWT,placeOrder);


export default orderRouter;