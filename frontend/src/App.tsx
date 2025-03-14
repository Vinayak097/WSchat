import { useState } from 'react'


import './App.css'
import ChatInterface from './pages/Chat-interface'
import { Route, Routes } from 'react-router-dom'


function App() {

  return (
    <div className='h-screen '>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        
      </Routes>
      

    </div>
  
      
  
   
  )
}

export default App
