import React from 'react'
import './style.css';

const Button = ({title, onClick, isLoading}) => {
  return (
    <button onClick={onClick} disabled={isLoading} className='button_btn'>
      { isLoading ? 'Loading...' : title}
    </button>
  )
}

export default Button