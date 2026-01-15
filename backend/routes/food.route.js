import express from 'express'
import multer from 'multer'


import { addFood } from '../controller/food.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter=express.Router();


foodRouter.post('/add',upload.single("image"),addFood)




export default foodRouter;
