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




export {addFood};