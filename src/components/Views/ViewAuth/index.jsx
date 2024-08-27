import React from 'react'
import './style.css'

const ViewAuth = ({children}) => {
  return (
    <div className='auth_container'>

      <div className='auth_card'>

        {children}

      </div>

    </div>
  )
}

export default ViewAuth