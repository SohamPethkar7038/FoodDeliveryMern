import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin, setSearch, search }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartItems } = useContext(StoreContext);

  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // 🔍 Search handler (works for Enter key + button)
  const handleSearch = () => {
    if (search.trim() !== "") {
      const section = document.getElementById("food-display");
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setShowSearch(false); // close search after searching (mobile UX)
    }
  };

  // ❌ Close search when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>

      <ul className={`navbar-menu ${showSearch ? "hide-menu" : ""}`}>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <Link to='/#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</Link>
        <Link to='/#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</Link>
        <Link to='/#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</Link>
      </ul>

      <div className='navbar-right'>
        {/* SEARCH BOX */}
        <div className={`navbar-search ${showSearch ? "active" : ""}`} ref={searchRef}>
          {showSearch && (
            <div className="search-box" onClick={(e) => e.stopPropagation()}>
              <input
  ref={inputRef}
  type='search'
  enterKeyHint="search"
  placeholder='Search Food...'
  value={search}
  className='search-input'
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      const section = document.getElementById("food-display");
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setShowSearch(false);
    }
  }}
/>

            
            </div>
          )}
        </div>

        {/* 🔍 Search Icon Toggle */}
        <img
          src={assets.search_icon}
          alt=""
          onClick={() => {
            setShowSearch(prev => !prev);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          style={{ cursor: "pointer" }}
        />

        {/* 🛒 Cart */}
        <div className='navbar-search-icon'>
          <Link to="/cart" className="cart-icon">
            <img src={assets.basket_icon} alt="" />
            {getTotalCartItems() > 0 && (
              <span className="cart-count">{getTotalCartItems()}</span>
            )}
          </Link>
        </div>

        <button onClick={() => setShowLogin(true)}>sign in</button>
      </div>
    </div>
  );
};

export default Navbar;

