import React from 'react'
import './style.css'

const TopBar = () => {
  return (
    <div className='top_bar'>
      <div className="top_bar1">
        <i className="ri-volume-down-line icon"></i>
        <i className="ri-menu-line icon_small"></i>
      </div>
      <div className="top_bar2">
        <i className="ri-search-line icon_small"></i>
        <i className="ri-logout-box-r-line icon_small"></i>
      </div>
    </div>
  )
}

export default TopBar