import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, backendUrl, isLogin } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    if (!orderItems.length) return alert("Cart is empty");

    const orderData = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 40, // delivery fee
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/order/placeorder`,
        orderData,
        { withCredentials: true }
      );

      if (response.data.success) {
        window.location.href = response.data.data.sessionUrl;
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("PlaceOrder Error:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const navigate = useNavigate();

  // useEffect(() => {
  //   if(!isLogin) {
  //     navigate("/register");
  //   }
  // },[isLogin, navigate]);

  // if(!isLogin) return null;

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone number"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs {getTotalCartAmount()}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery fee</p>
            <p>Rs {getTotalCartAmount() === 0 ? 0 : 40}</p>
          </div>
          <div className="cart-total-details">
            <b>Total</b>
            <b>Rs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;