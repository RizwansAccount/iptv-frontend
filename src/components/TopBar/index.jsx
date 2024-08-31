import React from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
import { removeLocalStorage } from '../../localStorage';
import { Config } from '../../constants';
import { ROUTES } from '../../routes/RouteConstants';

const TopBar = () => {
  const navigate = useNavigate();

  const fnLogout =()=>{
    removeLocalStorage(Config.userToken);
    navigate(ROUTES.login);
  };

  return (
    <div className='top_bar'>
      <div className="top_bar1">
        <i className="ri-volume-down-line icon"></i>
        <i className="ri-menu-line icon_small"></i>
      </div>
      <div className="top_bar2">
        <i className="ri-search-line icon_small"></i>
        <i onClick={fnLogout} className="ri-logout-box-r-line icon_small"></i>
      </div>
    </div>
  )
}

export default TopBar