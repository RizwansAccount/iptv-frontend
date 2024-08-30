import React from 'react'
import { getLocalStorage } from '../localStorage';
import { Config } from '../constants';
import { ROUTES } from './RouteConstants';
import { Navigate, Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

const ProtectedRoute = () => {
  const isUserLoggedIn = getLocalStorage(Config.userToken);

  if (!isUserLoggedIn) {
    return <Navigate to={ROUTES.login} replace />
  };

  return (
    <>
      <TopBar/>
      <div style={{background:'#EFF2F4', height:'90%', width:'100%', display:'flex', alignItems:'flex-start'}}>
        <SideBar/>
        <Outlet />
      </div>
    </>
  )
}

export default ProtectedRoute