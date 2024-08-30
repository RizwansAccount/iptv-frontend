import React from 'react'
import './style.css';

const Button = ({title, onClick, isLoading, style}) => {
  return (
    <button onClick={onClick} disabled={isLoading} className='button_btn' style={style}>
      { isLoading ? 'Loading...' : title}
    </button>
  )
}

export default Button