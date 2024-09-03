import React, { useEffect, useState } from 'react'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { removeLocalStorage } from '../../localStorage';
import { Config } from '../../constants';
import { ROUTES } from '../../routes/RouteConstants';
import Input from '../Input';
import { useSearchManager } from '../../hooks/useSearchManager';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fnAddSearch, fnRemoveSearch } = useSearchManager();

  const [search, setSearch] = useState('');

  useEffect(()=>{
    if(search) {
      setSearch('');
      fnRemoveSearch();
    }
  },[location.pathname])

  const fnLogout = () => {
    removeLocalStorage(Config.userToken);
    navigate(ROUTES.login);
  };

  const fnOnSearch = () => {
    fnAddSearch(search);
  };

  const fnOnChange = (e) => {
    const value = e.target.value;
    setSearch(e.target.value);
    if (!value) { fnRemoveSearch();}
  };

  const fnOnPressEnter = (e) => {
    if (e.key === 'Enter' && search) {
      fnOnSearch();
    }
  };

  return (
    <div className='top_bar'>
      <div className="top_bar1">
        <i className="ri-volume-down-line icon"></i>
        <i className="ri-menu-line icon_small"></i>
      </div>
      <div className="top_bar2">
        <div className='search_box'>
          <Input type="text" placeholder='Search' value={search} onChange={fnOnChange} onKeyDown={fnOnPressEnter} style={{ width: '400px' }} />
          <div onClick={fnOnSearch} className='search_icon_box'>
            <i className="ri-search-line icon_small"></i>
          </div>
        </div>
        <i onClick={fnLogout} className="ri-logout-box-r-line icon_small"></i>
      </div>
    </div>
  )
}

export default TopBar