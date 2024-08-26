import React from 'react'
import { Config } from '../../constants';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';
import { getLocalStorage } from '../../localStorage';

const Home = () => {
  const isUserLoggedIn = getLocalStorage(Config.userToken);

  if (!isUserLoggedIn) {
    return <Navigate to={ROUTES.login} replace />
  }

  return (
    <div>Home</div>
  )
}

export default Home