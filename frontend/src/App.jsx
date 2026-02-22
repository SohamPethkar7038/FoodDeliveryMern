import React, { useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, Outlet } from 'react-router-dom';

import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import VerifyOrder from './pages/VerifyOrder/VerifyOrder';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import ScrollToHash from './components/ScrollToHash';
import MyOrder from './pages/myOrder/MyOrder';

function App() {

  const [showLogin, setShowLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Layout WITH footer
  const LayoutWithFooter = () => (
  <div className="app">
    <ScrollToHash />
    <Navbar 
      setShowLogin={setShowLogin} 
      setSearch={setSearch} 
      search={search} 
    />
    <Outlet />
    <Footer />
  </div>
);

const LayoutNoFooter = () => (
  <div className="app">
    <ScrollToHash />
    <Navbar 
      setShowLogin={setShowLogin} 
      setSearch={setSearch} 
      search={search} 
    />
    <Outlet />
  </div>
);

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>

        {/* Pages with Footer */}
        <Route element={<LayoutWithFooter />}>
          <Route 
            path="/" 
            element={
              <Home
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
              />
            } 
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Route>

        {/* Pages WITHOUT Footer (but WITH Navbar) */}
        <Route element={<LayoutNoFooter />}>
          <Route path="/verify" element={<VerifyOrder />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path='/myorders' element={<MyOrder/>}/>
        </Route>



      </Routes>
    </>
  );
}

export default App;