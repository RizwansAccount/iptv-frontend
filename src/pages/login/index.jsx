import React, { useState } from 'react'
import Button from '../../components/Button/index';
import './style.css';
import { setLocalStorage } from '../../localStorage';
import { Config } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';
import ViewAuth from '../../components/Views/ViewAuth';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import { useLoginUserMutation } from '../../redux/storeApis';

const Login = () => {

  const navigate = useNavigate();
  const { fnShowSnackBar } = useSnackBarManager();

  const [loginUser, { isLoading: isLoadingLoginUser }] = useLoginUserMutation();

  const fnLogin = async (event) => {

    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (email && password) {
      try {
        const body = { email, password };
        const result = await loginUser(body);
        const response = result?.data;
        if (response?.success) {
          const token = response?.token;
          setLocalStorage(Config.userToken, token);
          navigate(ROUTES.genre);
          fnShowSnackBar('user logged in successfully!');
        } else {
          fnShowSnackBar((response?.message || 'oops! wrong credentials try again'), true);
        }
      } catch (error) {
        fnShowSnackBar('oops! wrong credentials try again', true);
      }
    } else {
      fnShowSnackBar('all fields must be filled', true);
    }

  };

  return (
    <ViewAuth>
      <div className="login_heading_box">
        <h1>Sign In to your Account</h1>
        <h3>Welcome back please enter your detail</h3>
      </div>

      <form onSubmit={fnLogin} className='login_form'>

        <div className='login_inputBox'>
          <input name='email' type="text" className='input' placeholder='Email' />
          <input name='password' type="text" className='input' placeholder='Password' />
          <div className='rememberBox'>
            <div className='login_checkbox_container'>
              <input type='checkbox' />
              <span>Remember me</span>
            </div>
            <span className='login_forgot_txt'>Forgot password ?</span>
          </div>
        </div>

        <Button title={'Sign In'} isLoading={isLoadingLoginUser} />
      </form>

      <span onClick={() => navigate(ROUTES.register)} className='login_account_txt'>Don't have an account? Sign Up</span>
    </ViewAuth>
  )
}

export default Login