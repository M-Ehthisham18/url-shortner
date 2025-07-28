import React from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import AnalyticsCard from './pages/AnalyticsCard'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
       
        <Route path='/:shortId/analytics' element={<AnalyticsCard /> }/>
      </Routes>
      {/* <Home/> */}
      <Toaster/>
    </div>
  )
}

export default App