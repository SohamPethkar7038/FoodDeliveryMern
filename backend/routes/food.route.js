import express from 'express'

import { addFood, listFood ,removeFood} from '../controller/food.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter=express.Router();


foodRouter.post('/add',upload.single("image"),addFood)
foodRouter.get('/list',listFood)
foodRouter.post('/remove',removeFood)



export default foodRouter;
