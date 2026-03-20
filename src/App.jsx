import React from 'react'
import Navbar from './components/navbar/Navbar'
import ServiceBar from './components/servicebar/servicebar'
import './App.css'
import Home from './components/home/home'

const App = () => {
  return (
    <>
        <Navbar />
        <ServiceBar />  
        <Home />
    </>
  )
}

export default App