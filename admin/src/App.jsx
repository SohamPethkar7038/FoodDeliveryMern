import React from "react"
import {Routes,Route} from 'react-router-dom'

import Navbar from "./components/Navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import Add from "./pages/Add/Add"
import Orders from "./pages/Orders/Orders"
import List from "./pages/List/List"
import { ToastContainer } from "react-toastify"

function App() {

  const backendUrl = "http://localhost:3000";
  return (
   <div>
    <ToastContainer position="top-right" autoClose={3000}/>
    <Navbar/>
    <hr/>

    <div className="app-content">
      <Sidebar/>
      
      <Routes>
        <Route path='/add' element={<Add backendUrl={backendUrl}/>} />
        <Route path='/list' element={<List backendUrl={backendUrl}/>} />
        <Route path='/orders' element={<Orders backendUrl={backendUrl}/>} />
      </Routes>
    </div>
   </div>
     
  )
}

export default App
