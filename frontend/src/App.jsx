
import React from 'react'
import './App.css'

import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

import { Route, Routes } from 'react-router-dom'




function App() {
  return (
    <div>
       <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
      </Routes>
    </div>

    <Footer/>

    </div>
   
  )
}

export default App
