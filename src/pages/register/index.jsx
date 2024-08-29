import React, { useState } from 'react'
import ViewAuth from '../../components/Views/ViewAuth'
import { ROUTES } from '../../routes/RouteConstants';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import './style.css'
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import { useRegisterUserMutation } from '../../redux/storeApis';

const Register = () => {

  const navigate = useNavigate();
  const { fnShowSnackBar } = useSnackBarManager();

  const [registerUser, { isLoading: isLoadingRegisterUser }] = useRegisterUserMutation();

  const [userInput, setUserInput] = useState({ first_name: "", last_name: "", email: "", password: "" });

  const fnOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInput((pre) => ({ ...pre, [name]: value }));
  };

  const fnRegister = async () => {
    const body = {
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      email: userInput.email,
      password: userInput.password
    };

    if (userInput?.first_name && userInput?.last_name && userInput?.email && userInput?.password) {
      try {
        const result = await registerUser(body);
        const response = result?.data;
        if (response?.success) {
          navigate(ROUTES.verification, { state: { email: userInput.email } });
          fnShowSnackBar(response?.message)
        } else {
          fnShowSnackBar(response?.message, true);
        }

      } catch (error) {
        fnShowSnackBar((error || 'something went wrong!'), true);
      }
    } else {
      fnShowSnackBar('please must filled all fields!', true)
    }
  };

  return (
    <ViewAuth>

      <h1 className='register_heading'>Sign Up for an Account</h1>

      <div className='register_inputBox'>
        <input value={userInput.first_name} name='first_name' type="text" className='input' placeholder='First Name' onChange={fnOnChange} />
        <input value={userInput.last_name} name='last_name' type="text" className='input' placeholder='Last Name' onChange={fnOnChange} />
        <input value={userInput.email} name='email' type="text" className='input' placeholder='Email' onChange={fnOnChange} />
        <input value={userInput.password} name='password' type="text" className='input' placeholder='Password' onChange={fnOnChange} />
      </div>

      <div className='register_checkbox_container'>
        <input type='checkbox' />
        <span>
          By creating an account means you agree to the <strong>Terms <br /> & Conditions</strong> and our <strong>Privacy Policy</strong>
        </span>
      </div>

      <Button title={'Sign Up'} isLoading={isLoadingRegisterUser} onClick={fnRegister} />

      <span onClick={() => navigate(ROUTES.login)} className='register_account_txt'>Already have an account? Sign In</span>
    </ViewAuth>
  )
}

export default Register