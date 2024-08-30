import React from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../routes/RouteConstants'

const SideBar = () => {

  return (
    <div className='side_bar'>
      <NavLink to={ROUTES.genre} className={({ isActive }) => isActive ? 'tab_active' : 'tab'}>Genre</NavLink>
      <NavLink to={ROUTES.series} className={({ isActive }) => isActive ? 'tab_active' : 'tab'}>Series</NavLink>
      <NavLink to={ROUTES.season} className={({ isActive }) => isActive ? 'tab_active' : 'tab'}>Seasons</NavLink>
      <NavLink to={ROUTES.episode} className={({ isActive }) => isActive ? 'tab_active' : 'tab'}>Episodes</NavLink>
    </div>
  )
}

export default SideBar