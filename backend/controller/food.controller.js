import foodModel from "../models/food.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs'    // node js file system


// add food item in databases

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "food_items"
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    const food = await foodModel.create({
      name,
      description,
      price,
      category,
      image: result.secure_url   // SAVE CLOUDINARY URL
    });

    res.json({
      success: true,
      message: "Food item added",
      data: food
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food item" });
  }
};

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

const removeFood = async (req, res) => {
  try {
    const foodItem = await foodModel.findById(req.body._id);

    // Extract public_id from URL
    const publicId = foodItem.image.split('/').pop().split('.')[0];

    await cloudinary.uploader.destroy(`food_items/${publicId}`);

    await foodModel.findByIdAndDelete(req.body._id);

    res.json({ success: true, message: "Food item deleted" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting food item" });
  }
};


export {addFood,listFood,removeFood};

