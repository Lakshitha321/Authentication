import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/emailverify' element={<EmailVerify/>}/>
          <Route path='/resetpassword' element={<ResetPassword/>}/>
        

        </Routes>
    </div>
  )
}

export default App
