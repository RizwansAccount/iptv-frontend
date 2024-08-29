import React, { useState } from 'react'
import { apiCall } from '../../api';
import Button from '../../components/Button/index';
import './style.css';
import { setLocalStorage } from '../../localStorage';
import { Config } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';
import ViewAuth from '../../components/Views/ViewAuth';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';

const Login = () => {

  const navigate = useNavigate();
  const { fnShowSnackBar } = useSnackBarManager();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fnLogin = async() => {

    if(email && password) {
      const body = { email, password };
      const response = await apiCall({url : 'users/login', http_verb : 'POST', data : body});
      if(response?.success) {
        const token = response?.token;
        setLocalStorage(Config.userToken, token);
        navigate(ROUTES.home);
        fnShowSnackBar('user logged in successfully!');
      } else {
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

      <div className='login_inputBox'>
        <input value={email} name='email' type="text" className='input' placeholder='Email' onChange={(e)=> setEmail(e.target.value)} />
        <input value={password} name='password' type="text" className='input' placeholder='Password' onChange={(e)=> setPassword(e.target.value)} />
        <div className='rememberBox'>
          <div className='login_checkbox_container'>
            <input type='checkbox' />
            <span>Remember me</span>
          </div>
          <span className='login_forgot_txt'>Forgot password ?</span>
        </div>
      </div> 

      <Button title={'Sign In'} onClick={fnLogin} />

      <span onClick={()=>navigate(ROUTES.register)} className='login_account_txt'>Don't have an account? Sign Up</span>
    </ViewAuth>
  )
}

export default Login