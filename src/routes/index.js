import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './RouteConstants'
import Login from '../pages/login'
import Register from '../pages/register'
import Home from '../pages/home'

const ReactRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path={ROUTES.home} element={<Home/>} />
            <Route path={ROUTES.login} element={<Login/>} />
            <Route path={ROUTES.register} element={<Register/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default ReactRoutes;