import React from 'react'
import './style.css'

const Input = ({ type = 'text', placeholder, value, name, onChange, onKeyDown, style, inputTitle = '', className }) => {
  return (
    <>
      { inputTitle && <p>{inputTitle}</p> }
      <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} onKeyDown={onKeyDown} className={` input_section ${className}`} style={style} />
    </>
  )
}

export default Input