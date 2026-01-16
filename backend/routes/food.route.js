import express from 'express'

import { addFood, listFood } from '../controller/food.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter=express.Router();


foodRouter.post('/add',upload.single("image"),addFood)
foodRouter.get('/list',listFood)



export default foodRouter;
