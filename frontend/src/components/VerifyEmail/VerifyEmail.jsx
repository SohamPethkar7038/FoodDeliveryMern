import React, { useRef } from "react";
import axios from "axios";
import {toast} from "react-toastify";

import "./VerifyEmail.css";
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from '../../context/StoreContext';


const VerifyEmail = () => {


  const inputRefs = useRef([]);
  const { backendUrl,userData,setUserData,setIsLogin,isLogin } = useContext(StoreContext);

  const navigate = useNavigate();

  const [otpValue, setOtpValue] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;

    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    // Move to next input if something is typed
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace if current empty
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async() => {

    const finalOtp = otpValue.join("");

    if(finalOtp.length!== 6) {
        toast.error("please enter complete OTP",{
            autoClose : 500
        })
        return;
    }

    try {
        setLoading(true);

        const {data} = await axios.post(
            backendUrl + "/api/v1/auth/verify-email-otp",
            {otp : finalOtp}, {withCredentials : true}
        );

        toast.success(data.message,{
            autoClose : 500,
        });

        setUserData((prev) => ({
        ...prev,
        isAccountVerified: true
    }));

    setTimeout(() => {
        navigate("/");
    }, 800);

    } catch (error) {
        toast.error(error.response?.data?.message || "Verification failed");
    }finally{
        setLoading(false);
    }
  }

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <h2>Email Verification</h2>
        <p>Enter the 6-digit OTP sent to your registered email.</p>

        <div className="otp-container">
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className="verify-btn"
            onClick={handleVerify}
            disabled={loading}
        >
         {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
