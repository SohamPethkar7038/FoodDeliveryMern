import express from "express"
import { Router } from "express"

import userModel from "../models/user.model.js"
import verifyJWT from "../middlewares/user.middleware.js"
import getUserData from "../controller/fetchUserDetail.controller.js"

const userDetailRouter = express.Router();

userDetailRouter.route('/data').get(verifyJWT, getUserData);

export default userDetailRouter;


