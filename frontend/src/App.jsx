import React, { useState } from 'react';
import './App.css';

import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import ScrollToHash from './components/ScrollToHash';

import { Route, Routes } from 'react-router-dom';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All"); // ✅ move category here

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <ScrollToHash />  

        <Navbar setShowLogin={setShowLogin} setSearch={setSearch} search={search} />

        <Routes>
          <Route 
            path='/' 
            element={
              <Home 
                search={search} 
                setSearch={setSearch} 
                category={category} 
                setCategory={setCategory} 
              />
            } 
          />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default App;
