import {Router} from "express"

import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import verifyJWT from "../middlewares/user.middleware.js";


const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

router.route("/logout").post(logoutUser)

export default router;