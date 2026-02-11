import React, { useEffect,useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = () => {

  const backendUrl=import.meta.env.VITE_BACKEND_URL;

  const [list,setList]=useState([]);


  const fetchList = async()=>{

   try {

    const response = await axios.get(`${backendUrl}/api/v1/food/list`);
    console.log(response.data);

    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error(response.data.message || "Failed to fetch food list");
    }

  } catch (error) {
    console.error(error);
    toast.error("Server error. Please try again later.");
  }
}


const removeFood=async(foodId)=>{
  const response=await axios.post(`${backendUrl}/api/v1/food/remove`,{_id:foodId});

  await fetchList();

  if(response.data.success){
    toast.success("Food item removed sucessfully",{
      autoClose:2000
    });
  }
  else{
    toast.error("Something went wrong!",{
      autoClose:2000
    });
  }
}

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <p>All Food list</p>

      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item,index)=>{

          return (
            <div key={index} className='list-table-format'>
              <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${backendUrl}/images/${item.image}`
                  }
                  alt={item.name}
                />
              <p className='values'>{item.name}</p>
              <p className='values'>{item.category}</p>
              <p className='values'>${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='values cursor'>X</p>
            </div>
          )

        }
          
        )}
      </div>

    </div>
  )
}

export default List