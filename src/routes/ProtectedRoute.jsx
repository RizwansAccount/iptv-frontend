import React from 'react'
import { getLocalStorage } from '../localStorage';
import { Config } from '../constants';
import { ROUTES } from './RouteConstants';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isUserLoggedIn = getLocalStorage(Config.userToken);

    if (!isUserLoggedIn) {
      return <Navigate to={ROUTES.login} replace />
    };

    return <Outlet/>
}

export default ProtectedRoute