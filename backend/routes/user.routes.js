import {Router} from "express"

import { loginUser, logoutUser, registerUser, sendVerifyEmailOTP,
         userIfAuthenticate, verifyEmailOtp } from "../controller/user.controller.js";
import verifyJWT from "../middlewares/user.middleware.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route('/isAuth').get(verifyJWT,userIfAuthenticate)

// email verification 

router.route('/send-verification-otp').post(verifyJWT, sendVerifyEmailOTP)
router.route('/verify-email-otp').post(verifyJWT,verifyEmailOtp);

export default router;