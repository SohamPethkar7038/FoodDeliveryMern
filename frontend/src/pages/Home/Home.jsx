import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = ({search,setSearch}) => {
  const [category, setCategory] = useState("All");

   const handleCategoryChange = (newCategory) => {
    setCategory(prev => prev === newCategory ? "All" : newCategory);
   
  };

  return (
    <div>
      <div id="header">
        <Header />
      </div>

      <div id="explore-menu">
        <ExploreMenu category={category} setCategory={handleCategoryChange} />
      </div>

      <FoodDisplay category={category} search={search} />

      <div id="app-download">
        <AppDownload />
      </div>
    </div>
  );
};

export default Home;
