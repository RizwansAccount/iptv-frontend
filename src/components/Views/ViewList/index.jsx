import React from 'react'
import './style.css'

const ViewList = ({children}) => {
  return (
    <div className='list_box'>
        {children}
    </div>
  )
}

export default ViewList