import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './RouteConstants'
import Login from '../pages/login'
import Register from '../pages/register'
import ProtectedRoute from './ProtectedRoute'
import NotFound from '../pages/notFound'
import VerifyCode from '../pages/verifyCode'
import Genre from '../pages/genre'
import Episode from '../pages/episode'
import Season from '../pages/season'
import Series from '../pages/series'

const ReactRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
          
            <Route path={ROUTES.login} element={<Login/>} />
            <Route path={ROUTES.register} element={<Register/>} />
            <Route path={ROUTES.verification} element={<VerifyCode/>} />

            <Route element={<ProtectedRoute/>}>
              <Route path={ROUTES.genre} element={<Genre/>} />
              <Route path={ROUTES.episode} element={<Episode/>} />
              <Route path={ROUTES.season} element={<Season/>} />
              <Route path={ROUTES.series} element={<Series/>} />
            </Route>

            <Route path='*' element={<NotFound/>} />

        </Routes>
    </BrowserRouter>
  )
}

export default ReactRoutes;