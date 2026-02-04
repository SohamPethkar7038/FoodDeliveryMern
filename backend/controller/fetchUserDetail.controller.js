import {asyncHandler} from "../utility/asyncHandler.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import userModel from "../models/user.model.js";
import verifyJWT from "../middlewares/user.middleware.js";



const getUserData = asyncHandler(async(req,res) => {

    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await userModel.findById(userId).select(
        "name email isAccountVerified createdAt"
    );

    if(!user) {
         throw new ApiError(404,"User not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAccountVerified: user.isAccountVerified,
                    joinedAt: user.createdAt,
                },
            },
            "User data fetched successfully"
        )
    );
})

export default getUserData;