import React from 'react';
import './MyOrder.css';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useEffect,useState } from 'react';


const MyOrder = () => {

  const{backendUrl} = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchUserOrder = async () => {

    const response = await axios.post(backendUrl + "/api/v1/order/userorder", {}, 
      { withCredentials: true }); 
    setData(response.data.data);

    
  }

  useEffect(() => {
    fetchUserOrder();
  },[]);
  return (
    <div className='myOrder'>
      <h2>My Orders</h2>

      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />

            <p>
              {order.items.map((item, index) =>
                index === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            <p><span className='bold-text'>Rs :  </span>  {order.amount}.00</p>
            <p><span className='bold-text'>Items : </span> {order.items.length}</p>

            <p>
              <span>
                  &#x25cf; 
              </span>

              <b>
                {order.status}
              </b>
            </p>

            <button>Track Order   </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrder