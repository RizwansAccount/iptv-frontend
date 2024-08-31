import React from 'react'
import './style.css';

const Button = ({title, onClick, isLoading, style, className}) => {
  return (
    <button onClick={onClick} disabled={isLoading} className={`button_btn ${className} `} style={style}>
      { isLoading ? 'Loading...' : title}
    </button>
  )
}

export default Button