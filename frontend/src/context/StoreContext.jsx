import { createContext, useEffect, useState } from "react";
import { food_list as staticFoodList } from "../assets/assets";
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
            
            data.success ? setUserData(data.data.user) : toast.error(data.message, {
                autoClose:1000
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message ,{
                autoClose:1000
            });
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


    // useffect for login downside



    // ************************************** cart section logic **********************************

    const [cartItems,setCartItems]=useState({});

    const addToCart = (itemId) => {
    const id = String(itemId);
    setCartItems((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
    }));
};


    const removeFromCart = (itemId) => {
    const id = String(itemId);
    setCartItems((prev) => ({
        ...prev,
        [id]: prev[id] - 1,
    }));
};


    const getTotalCartAmount=()=>{
        let totalAmount=0;

        for(const item in cartItems){

            if(cartItems[item]>0){
                let itemInfo=mergedFoodList.find((product)=>product._id===item);
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


//    ******************** listing fooditems from backend to ui and also assets ********************

    const [foodList, setFoodList] = useState([]);

     const mergedFoodList = [...staticFoodList, ...foodList];

    const fetchFoodListFromBackend = async() => {
        
        const response = await axios.get(backendUrl + "/api/v1/food/list");
        setFoodList(response.data.data);
    }


    useEffect(() =>{
        getAuthState();
        
        
        async function loadData() {
            await fetchFoodListFromBackend()
        }
        loadData();
    },[]);


    const contextValue={
        food_list:  mergedFoodList,
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