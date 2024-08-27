import React from 'react'
import './style.css';

const Button = ({title, onClick}) => {
  return (
    <div onClick={onClick} className='button_btn'>
        {title}
    </div>
  )
}

export default Button