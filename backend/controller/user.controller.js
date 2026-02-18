import {asyncHandler} from "../utility/asyncHandler.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import bcrypt from "bcryptjs"
import userModel from "../models/user.model.js";
import sendWelcomeEmail from "../services/emailServices/welcomeEmail.js";
import sendVerifyEmailOtpAccount from "../services/emailServices/sendVerifyEmailOtp .js";


const registerUser = asyncHandler(async(req,res)=>{

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        throw new ApiError(400,"All fields are required");
    }

    const existingUser = await userModel.findOne({email:email});

    if(existingUser){
        return res.status(409).json({
            success: false,
            message: "User with email id already exists"
        });
    }


    const user = await userModel.create({
        name,
        email,
        password
    })

    const createdEntry = await userModel.findById(user._id)
    .select("-password -refreshToken");


    // ************ Sending welcome email when first registered of user *********

    sendWelcomeEmail(email, name);
    


    res
    .status(201)
    .json(new ApiResponse(
        201,
        createdEntry,
        "User registered successfully"
    ));
});



//  ************************* login user *********************************


const loginUser = asyncHandler(async(req,res)=>{
    
    const {email,password} = req.body;

    if(!email || !password){
        throw new ApiError(400,"Email & password are required");
    }

    const user = await userModel.findOne({email:email});

    if(!user){
        throw new ApiError(401,"Invalid User Email id");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid && !user){
        throw new ApiError(404,"Invalid user password");
    }


    const generatingAccessAndRefreshToken = async(userId)=>{
        try {
            const user = await userModel.findById(userId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;

            await user.save({validateBeforesave : false});

            return {accessToken,refreshToken};

        } catch (error) {
            throw new ApiError(500,"something went wrong while generating tokens");
        }
    }

    const {accessToken,refreshToken} = await generatingAccessAndRefreshToken(user._id);

     const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken -verifyOtp");

     const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax",
     }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {User:loggedInUser},
            "User logged in successfully"
        )
    )
})


// ****************************** logout *******************************************************


const logoutUser = asyncHandler(async(req,res)=>{

    await userModel.findByIdAndUpdate(
        req.user_id,
        {$unset : {refreshToken : 1}},
        {new : true},
    )

    const options ={
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : "lax"
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logout successfully"
        )
    )
})


// *********************** check is authenticate ******************************

const userIfAuthenticate = asyncHandler(async(req,res) => {
    if(!req.user) {
         return res
         .status(401)
         .json(
            new ApiResponse(
                401,
                 {},
                "Unauthorized user"));
    }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email,
                        isAccountVerified : req.user.isAccountVerified
                    }
                },
                "User is aunthenticate"
            )
        )
    }
);


 // **************** sending email verification otp ********************

 const sendVerifyEmailOTP = asyncHandler(async(req,res) => {

     const userId = req.user?._id;

     if(!userId) {
        throw new ApiError(401, "Unauthorized user");
     }

     const user = await userModel.findById(userId)
                  .select("+verifyOtp +verifyOtpExpiredAt");

     if(!user) {
        throw new ApiError(404, "User not found");
     }

     if(user.isAccountVerified) {
        throw new ApiError(400,"Account already verified");
     }

     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     
     const hashedOtp = await bcrypt.hash(otp,10);

     user.verifyOtp = hashedOtp;
     user.verifyOtpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);

     await user.save({validateBeforesave : false});

     try {
        await sendVerifyEmailOtpAccount(user.email, otp);
     } catch (error) {
        console.error("Email failed:", error.message)
     }
    
     return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Verification otp send to email"
            )
        );
 });


 // ******** verifying email verification otp *******************


 const verifyEmailOtp = asyncHandler(async(req,res) => {

    const userId = req.user?._id;
    const {otp} = req.body;

    if(!otp) {
        throw new ApiError(400,"otp is required");
    }

    const user = await userModel.findById(userId)
                .select("+verifyOtp +verifyOtpExpiredAt");

    if(!user) {
        throw new ApiError(404,"User not found");
    }

    if(user.isAccountVerified){
        throw new ApiError(400,"Account already verified");
    }

    if(!user.verifyOtp || !user.verifyOtpExpiredAt) {
        throw new ApiError(400,"No otp request found");
    }

    if(user.verifyOtpExpiredAt < Date.now()) {
        throw new ApiError(400, "OTP has expired");
    }

    const isOtpValid = await bcrypt.compare(otp, user.verifyOtp);

    if(!isOtpValid) {
        throw new ApiError(400,"Invalid Otp");
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiredAt = undefined;

    await user.save({validateBeforesave : false});

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Email verified successfully"       
        ));
 });

export {registerUser, loginUser, logoutUser, userIfAuthenticate, sendVerifyEmailOTP
        ,verifyEmailOtp};

