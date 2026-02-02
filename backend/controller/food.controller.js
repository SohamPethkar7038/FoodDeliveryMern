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
    }
    catch(error) {
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
            message:"food list is displayed ",
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


// remove the food item from database

const removeFood=async (req,res)=>{
    try {
        const foodItem=await foodModel.findById(req.body._id);
        fs.unlink(`uploads/${foodItem.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body._id);

        res.json({
            success:true,
            message:"food item delete successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"error in deleting food item"
        })
    }
} 


export {addFood,listFood,removeFood};

