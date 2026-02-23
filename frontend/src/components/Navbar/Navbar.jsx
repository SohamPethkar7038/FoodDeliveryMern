import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';




const Navbar = ({ setShowLogin, setSearch, search }) => {

  const navigate = useNavigate();

  const { getTotalCartItems,backendUrl,userData,setUserData,setIsLogin,isLogin } = useContext(StoreContext);




  // ********************************** fooditem, menu section ********************
  const [menu, setMenu] = useState("menu");
  

  
  // ********************* login and signup section *******************************

  const logout = async () =>{
    try {
      const {data} = await axios.post(backendUrl + '/api/v1/auth/logout',{},{withCredentials : true});

      if(data.success){
        setIsLogin(false);
        setUserData(false);
        navigate('/');
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }



  // ********************** searching section ************************
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // 🔍 Search handler 
  const handleSearch = () => {
    if (search.trim() !== "") {
      const section = document.getElementById("food-display");
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setShowSearch(false); // close search after searching (mobile UX)
    }
  };


  // Close search when clicking outside or pressing ESC

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

  
  // verification of email otp//

  const sendVerificationOtp = async() => {
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/v1/auth/send-verification-otp');

      if(data.success) {
        navigate('/verify-email');
        toast.success(data.message,{
          autoClose : 1000,
        });
        }
        else {
          toast.error(error.message);
        }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  } 

  return (

    <div className='navbar'>
      <Link to='/'><img src={assets.logo1} alt="" className="logo" /></Link>

      <ul className={`navbar-menu ${showSearch ? "hide-menu" : ""}`}>
        <Link to='/' onClick={() => setMenu("home")} 
        className={menu === "home" ? "active" : ""}>
          home
        </Link>

        <Link to='/#explore-menu' onClick={() => setMenu("menu")} 
        className={menu === "menu" ? "active" : ""}>
          menu
        </Link>

        <Link to='/#app-download' onClick={() => setMenu("mobile-app")} 
        className={menu === "mobile-app" ? "active" : ""}>
          mobile-app
        </Link>

        <Link to='/#footer' onClick={() => setMenu("contact us")} 
        className={menu === "contact us" ? "active" : ""}>
          contact us
        </Link>
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

        {/*  Cart */}
        <div className='navbar-search-icon'>
          <Link to="/cart" className="cart-icon">
            <img src={assets.basket_icon} alt="" />
            {getTotalCartItems() > 0 && (
              <span className="cart-count">{getTotalCartItems()}</span>
            )}
          </Link>
        </div>

        {!userData ? <button onClick={() => setShowLogin(true)}>sign in</button>
        :
        <div className='navbar-profile'>
          {userData.name[0].toUpperCase()}
          <ul className='nav-profile-dropdown'>
            <li onClick={()=>navigate("/myorders")}> <p>Orders</p> </li>
            <hr />
            <li onClick={logout}><p>Logout</p></li>
            <hr/>
             {
                !userData.isAccountVerified && 
                    <li 
                    onClick={sendVerificationOtp}
                    >
                      <p>Verify Email</p>
                    </li>
            }
          </ul>
        </div>
      }
      </div>
    </div>
  );
};

export default Navbar;
