import {asyncHandler} from "../utility/asyncHandler.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import userModel from "../models/user.model.js";


const registerUser = asyncHandler(async(req,res)=>{

    const {name,email,password} = req.body;

    if(!name || !email || !password){
        throw new ApiError(400,"All fields are required");
    }

    const existingUser = await userModel.findOne({email:email});

    if(existingUser){
        throw new ApiError(409,"User with email id already exists");
    }


    const user = await userModel.create({
        name,
        email,
        password
    })

    const createdEntry = await userModel.findById(user._id).select("-password -refreshToken");

    res
    .status(201)
    .json(new ApiResponse(
        201,
        createdEntry,
        "User refistered successfully"));
});



//  ************************* login user *********************************


export {registerUser};