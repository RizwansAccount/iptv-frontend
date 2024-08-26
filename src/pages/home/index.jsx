import React from 'react'
import { Config } from '../../constants';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';

const Home = () => {
  const isUserLoggedIn = localStorage.getItem(Config.userToken);

  if (!isUserLoggedIn) {
    return <Navigate to={ROUTES.login} replace />
  }

  return (
    <div>Home</div>
  )
}

export default Home