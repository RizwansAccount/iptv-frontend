import React from 'react'
import './style.css'

const Input = ({ placeholder, value, onChange, style }) => {
  return (
    <input placeholder={placeholder} value={value} onChange={onChange} className='input_section' style={style} />
  )
}

export default Input