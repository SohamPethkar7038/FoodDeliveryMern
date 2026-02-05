import React from 'react';
import { useContext, useState } from 'react'
import './LoginPopup.css'
import axios from "axios";
import { toast } from 'react-toastify';

import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';


const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState]=useState("Sign Up")
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { backendUrl, setIsLogin,getUserData} = useContext(StoreContext);

    const onSubmitHandler = async(e) => {

        e.preventDefault();

        try {

            setLoading(true);
            
            const endPoint = currState === "Sign Up" ? "/register" : "/login";

            const payLoad = 
                currState === "Sign Up"
                    ? {name: name.trim(),
                       email: email.trim().toLowerCase(),
                       password
                     }
                     : {
                        email: email.trim().toLowerCase(),
                        password
                     } 

            const {data} = await axios.post(`${backendUrl}/api/v1/auth${endPoint}`,payLoad);

           

            setIsLogin(true);
            await getUserData();
            toast.success(currState === "Sign Up" ? "Account created!" : "Logged in!" ,{
                autoClose:2000
            });
            setShowLogin(false);

        } catch(error){
            const message =
                     error.response?.data?.message || "Invalid email or password";

            toast.error(message);
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className='login-popup'>
        <form onSubmit={onSubmitHandler} className='login-popup-container'>

            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon}/>
            </div>

            <div className="login-popup-inputs">
                {currState==="Sign Up" && ( 
                    <input 
                    type="text" 
                    placeholder='Your Name' 
                    value={name}
                    onChange= {(e) => setName(e.target.value)}
                    required /> 
                )}
                
                <input 
                type='email' 
                placeholder='Your Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />


                <input 
                type='password' 
                placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />


            </div>

            <button disabled={loading}> 
                {
                loading 
                ? "Please wait..." 
                : ( currState === "Sign Up" ? "Create Account" : "Login")} 
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required/>
                    <p>By continuing, I agree to the terms of use & privacy</p>
                </div>

                {currState==="Login"
                ? <p>
                    Create a new account ? 
                    <span onClick={()=>{setCurrState("Sign Up")}}>
                        Click here
                    </span>
                </p>
                : 
                <p>
                    Already have an account ? 
                    <span onClick={()=>{setCurrState("Login")}}>
                        Login here
                    </span>
                </p>
                }
                
                
        </form>
    </div>
  )
}

export default LoginPopup