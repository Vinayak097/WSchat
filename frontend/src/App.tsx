import { useEffect, useState } from 'react'


import './App.css'
import ChatInterface from './pages/Chat-interface'
import { Route, Routes, useNavigate, } from 'react-router-dom'
import AuthPage from './pages/Auth'
import { useRecoilValue } from 'recoil'
import { userStateAtom } from './store/user'

function App() {  
  const navigate=useNavigate()
 const user=useRecoilValue(userStateAtom)
 console.log(user)
 useEffect(()=>{
  if(!user){
    navigate('/auth')
   }

 },[user])
 
  return (
    <div className='h-screen '>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path='/auth' element={<AuthPage />} />
        
      </Routes>
      

    </div>
  
      
  
   
  )
}

export default App
