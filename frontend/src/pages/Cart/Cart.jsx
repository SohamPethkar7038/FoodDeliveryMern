import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
const Cart = () => {

  const {cartItems,food_list,removeFromCart,getTotalCartAmount}=useContext(StoreContext)

  
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-item-title">
          <p className='title-p'>Items</p>
          <p className='title-p'>Title</p>
          <p className='title-p'>Price</p>
          <p className='title-p'>Quantity</p>
          <p className='title-p'>Total</p>
          <p className='title-p'>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item,index)=>{
          if(cartItems[item._id]>0){
            return (
              <div>
              <div className="cart-item-title cart-item-item">
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>Rs {item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>Rs {item.price * cartItems[item._id]}</p>
                <p className='cross' onClick={()=>removeFromCart(item._id)}>x</p>
              </div>
              <hr />
              </div>
            )
          }
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>Rs {2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs {getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code'/>
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart