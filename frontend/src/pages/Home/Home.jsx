import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <div id="header">
        <Header />
      </div>

      <div id="explore-menu">
        <ExploreMenu category={category} setCategory={setCategory} />
      </div>

      <FoodDisplay category={category} />

      <div id="app-download">
        <AppDownload />
      </div>
    </div>
  );
};

export default Home;
