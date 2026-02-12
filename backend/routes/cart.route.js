import userModel from "../models/user.model.js";
import { addToCart, removeFromCart, fetchCartData } from "../controller/cart.controller.js";
import verifyJWT from "../middlewares/user.middleware.js";
import { Router } from "express";

const cartRouter = Router();

cartRouter.route("/add").post(verifyJWT,addToCart);
cartRouter.route("/remove").post(verifyJWT,removeFromCart);
cartRouter.route("/").get(verifyJWT,fetchCartData);

export default cartRouter;