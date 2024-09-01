import React from 'react'
import './style.css'

const Input = ({ type = 'text', placeholder, value, onChange, style }) => {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className='input_section' style={style} />
  )
}

export default Input