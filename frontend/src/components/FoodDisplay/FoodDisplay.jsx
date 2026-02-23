import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, search }) => {
  const { food_list } = useContext(StoreContext);

  const filteredList = food_list.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = search === "" ? (category === "All" || item.category === category) : true;
    return nameMatch && categoryMatch;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near your</h2>
      <div className='food-display-list'>
        {filteredList.map(item => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;