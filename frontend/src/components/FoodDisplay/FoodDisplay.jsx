import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'


const FoodDisplay = ({category,search}) => {
    const {food_list}=useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near your</h2>
        <div className='food-display-list'>
             {
       food_list
  .filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) && // always filter by search
    (search === "" ? (category === "All" || item.category === category) : true) // only filter category if no search
  )
        .map((item,index)=>{
            return <FoodItem 
                key={item._id} 
                id={item._id} 
                name={item.name} 
                description={item.description} 
                price={item.price} 
                image={item.image}/>
        })
    }
        </div>
    </div>
  )
}

export default FoodDisplay