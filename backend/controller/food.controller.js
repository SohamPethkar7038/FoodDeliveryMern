import { log } from "console";
import foodModel from "../models/food.model.js";
import fs from 'fs'    // node js file system


// add food item in databases

const addFood=async(req,res)=>{

    const { name, description, price, category } = req.body;

    const image_filename = req.file ? req.file.filename : null;

    const food = new foodModel({
    name,
    description,
    price,
    category,
    image: image_filename,
});

    try{
        await food.save();
        res.json({success:true,message:"food product saved"});
    }catch(error){
        console.log(error);
        res.josn({
            success:false,
            message:"error in saving food product"
        })
    }
}


// all food list from the database

const listFood=async (req,res)=>{
    try {
        const foods=await foodModel.find({});
        res.json({
            success:true,
            message:"food list is ",
            data:foods,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"error "
        })
        
    }
}




export {addFood,listFood};