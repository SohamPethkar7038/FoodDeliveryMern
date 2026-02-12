import {asyncHandler} from "../utility/asyncHandler.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import userModel from "../models/user.model.js";


// add items to user cart

const addToCart = asyncHandler(async(req,res) => {

    const userId = req.user._id;
    const {itemId} = req.body;

    if(!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {$inc : { [`cartData.${itemId}`]: 1 }},
        {new : true}
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedUser.cartData,           
            "Item added to cart"
        ));
});


// remove itens from cart

const removeFromCart = asyncHandler(async(req,res) => {

    const userId = req.user._id;
    const {itemId} = req.body;

    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    const user = await userModel.findById(userId).select("cartData");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const currentQty = user.cartData ?.get(itemId) || 0;

    if(currentQty === 0) {
         throw new ApiError(400, "Item not present in cart");
    }

    let updateOperation;

    if(currentQty === 1) {
        updateOperation = {$unset : { [`cartData.${itemId}`]: "" }};
    }else {
        updateOperation = {$inc :{ [`cartData.${itemId}`]: -1 }};
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateOperation,
        {new : true}
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedUser.cartData,
            "Item updated in cart"
        ));
});


// fetch user cart data

const fetchCartData = asyncHandler(async(req,res) => {

     const userId = req.user._id;

     const user = await userModel.findById(userId).select("cartData");

      if (!user) {
        throw new ApiError(404, "User not found");
    }

     const cartObject = Object.fromEntries(user.cartData || []);

    

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            cartObject,
            "Cart fetched successfully"
        ));
});


export {addToCart, removeFromCart, fetchCartData}