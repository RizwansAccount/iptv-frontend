import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './RouteConstants'
import Login from '../pages/login'
import Register from '../pages/register'
import Home from '../pages/home'
import ProtectedRoute from './ProtectedRoute'
import NotFound from '../pages/notFound'

const ReactRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
          
            <Route path={ROUTES.login} element={<Login/>} />
            <Route path={ROUTES.register} element={<Register/>} />

            <Route element={<ProtectedRoute/>}>
              <Route path={ROUTES.home} element={<Home/>} />
            </Route>

            <Route path='*' element={<NotFound/>} />

        </Routes>
    </BrowserRouter>
  )
}

export default ReactRoutes;