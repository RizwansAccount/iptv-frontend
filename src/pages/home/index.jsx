import React from 'react'
import { LogoutIcon } from '../../assets/icons'
import { removeLocalStorage } from '../../localStorage';
import { Config } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';

const Home = () => {

  const navigate = useNavigate();

  const fnLogout =()=>{
    removeLocalStorage(Config.userToken);
    navigate(ROUTES.login);
  };

  return (
    <div>
      <span>Home</span>
      <LogoutIcon onClick={fnLogout} />
    </div>
  )
}

export default Home