import React, { useEffect, useState } from 'react'
import './Add.css'
import {assets} from "../../assets/assets.js";
import axios from "axios"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Add = () => {

  
  const backendURL=import.meta.env.VITE_BACKEND_URL;

  const [image,setImage]=useState(false);

  const [loading, setLoading] = useState(false);


  const [data,setData]=useState({
    name:"",
    description:"",
    price:"",
    category:"",
  });

  

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(prev=>({...prev,[name] : value}));
  }

  const onSubmitHandler=async(event)=>{

    event.preventDefault();

    if (loading) return;
    setLoading(true); 

    try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(
      backendURL + "/api/v1/food/add",
      formData
    );

    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);

      toast.success("Food item added successfully!");
    } else {
      toast.error(response.data.message || "Failed to add food");
    }
  } catch (error) {
    toast.error("Upload failed. Try again.");
  }

  setLoading(false);
    }
  


  return (
    <div className='add'>

      <form  onSubmit={onSubmitHandler} className='flex-col'>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here'/>
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write content here'></textarea>
        </div>
        <div className="add-category-price">
          <div className='add-category flex-col'>
            <p>Product category</p>
            <select onChange={onChangeHandler}  value={data.category} name="category" required>
                <option value="Salad">Salad</option>
                <option value="Desserts">Desserts</option>
                <option value="Noodles">Noodles</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Rolls">Rolls</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Pizza">Pizza</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='Rs40' />
          </div>
        </div>
       <button type="submit" className="add-button" disabled={loading}>
            {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  )

}


export default Add