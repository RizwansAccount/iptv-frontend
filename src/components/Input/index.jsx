import React from 'react'
import './style.css'

const Input = ({ type = 'text', placeholder, value, name, onChange, style, inputTitle = '' }) => {
  return (
    <>
      { inputTitle && <p>{inputTitle}</p> }
      <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} className='input_section' style={style} />
    </>
  )
}

export default Input