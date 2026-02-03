import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import UserModel from "../models/user.model.js"
import { asyncHandler } from "../utility/asyncHandler.js";
import jwt from "jsonwebtoken"



const verifyJWT=asyncHandler(async(req,res,next)=>{

    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");

        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }

        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user=await UserModel.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401,"Invalid access token");
        }

        req.user=user;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access tokens");
    }
})

export default verifyJWT




