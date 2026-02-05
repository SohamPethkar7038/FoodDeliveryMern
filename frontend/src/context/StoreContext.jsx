import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
import axios from "axios"
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const StoreContext=createContext(null);

const StoreContextProvider=(props)=>{


    // ****************************** Login section *************************************************


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLogin , setIsLogin] = useState(false);
    
    const [userData, setUserData] = useState(false);


    const getUserData = async() =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/v1/user/data');

            console.log(data);
            
            data.success ? setUserData(data.data.user) : toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getAuthState = async() => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/v1/auth/isAuth`);

            if(data.success){
                
                setIsLogin(true);
                setUserData(data.data.user);
              
            }
            else{
                setIsLogin(false);
                setUserData(false);
            }
        } catch (error) {
            setIsLogin(false);
            setUserData(false);
        }
    }


    useEffect(() =>{
        getAuthState();
    },[]);



    // ************************************** cart section logic **********************************

    const [cartItems,setCartItems]=useState({});




    const addToCart=(itemId)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
    }

    const removeFromCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;

        for(const item in cartItems){

            if(cartItems[item]>0){
                let itemInfo=food_list.find((product)=>product._id===item);
                totalAmount+=itemInfo.price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
        totalItems += cartItems[item];
    }
    return totalItems;
}

    const contextValue={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        isLogin,
        setIsLogin,
        backendUrl,
        getUserData,
        setUserData,
        userData
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;