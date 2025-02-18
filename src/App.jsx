import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticatedRoute>
            <Home />
          </AuthenticatedRoute>} />
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Signup />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
