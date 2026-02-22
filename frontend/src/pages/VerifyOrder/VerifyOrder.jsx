import React from 'react'
import './VerifyOrder.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useEffect } from 'react';
import axios from 'axios';

const VerifyOrder = () => {

    const [searchParam, setSearchParam] = useSearchParams();
    const success = searchParam.get("success");
    const orderId = searchParam.get("orderId");

    const navigate = useNavigate();

    const {backendUrl} = useContext(StoreContext);

    const verifyPayment = async() => {
        const response = await axios.post(backendUrl + '/api/v1/order/verifyorder',{success,orderId})

        if(response.data.success) {
            navigate('/myorders');
        }
        else {
            navigate('/');
        }
    }

    useEffect(() => {
        verifyPayment();
    },[])
  return (
    <div className='verify'>
        <div className='spinner'>



        </div>

    </div>
  )
}

export default VerifyOrder