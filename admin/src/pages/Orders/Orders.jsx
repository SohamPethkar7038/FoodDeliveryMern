import React from 'react'
import { useState,useEffect } from 'react'
import {toast} from "react-toastify"
import axios from "axios"
import { assets } from '../../assets/assets.js'
import './Orders.css'


const Orders = ({backendUrl}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async() => {
    const response = await axios.get(backendUrl + "/api/v1/order/listOrderAdmin");
      if(response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      }
      else{
        toast.error("Error in listing orders",{
          autoClose: 1000
        });
      }
  }

  useEffect(() => {
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {
          orders.map((order, index) => (
            <div key = {index} className="order-item">
              <img src = {assets.parcel_icon} alt="" />

              <div>
                <p className='order-item-food'>
                  {
                    order.items.map((item, index) => {

                      if(index === order.items.length-1) {
                        return item.name + " x " +item.quantity;
                      }
                      else {
                        return item.name + " x " + item.quantity + " , " 
                      }
                  })}
                </p>

                <p className="order-item-name">
                  Customer : {order.address.firstName + " " + order.address.lastName}
                </p>

                <div className="order-item-address">
                  <p>{order.address.street + " , " }</p>
                  <p>
                    {order.address.city + " , " 
                      + order.address.state + " , " 
                      + order.address.country + " , "
                      + order.address.zipcode + " , "
                    }
                  </p>
                </div>

                <p className="order-item-phone">
                  {order.address.phone}
                </p>
              </div>

              <p className="order-item-quantity">
                <p>Items : {order.items.length}</p>
              
              </p>

              <p>Rs : { order.amount}</p> 
                
              
              <select>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

            </div>


          ))
        }
      </div>
    </div>
  )
}

export default Orders