import React from 'react'
import ViewAuth from '../../components/Views/ViewAuth'
import { ROUTES } from '../../routes/RouteConstants';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import './style.css'
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import { useRegisterUserMutation } from '../../redux/storeApis';
import { getLocalStorage } from '../../localStorage';
import { Config } from '../../constants';

const Register = () => {

  const navigate = useNavigate();
  const { fnShowSnackBar } = useSnackBarManager();
  const isUserLoggedIn = getLocalStorage(Config.userToken);

  const [registerUser, { isLoading: isLoadingRegisterUser }] = useRegisterUserMutation();

  if (isUserLoggedIn) {
    return <Navigate to={ROUTES.genre} replace />
  };

  const fnRegister = async (event) => {

    event.preventDefault();

    const body = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      email: event.target.email.value,
      password: event.target.password.value
    };

    const checkValidation = Object.values(body)?.every(value => value);

    if (checkValidation) {
      try {
        const result = await registerUser(body);
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar(response?.message);
          navigate(ROUTES.verification, { state: { email : body.email } });
        } else {
          fnShowSnackBar(response?.message || 'something went wrong!', true);
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

      <form onSubmit={fnRegister} className='register_form'>
        <div className='register_inputBox'>
          <input name='first_name' type="text" className='input' placeholder='First Name' />
          <input name='last_name' type="text" className='input' placeholder='Last Name' />
          <input name='email' type="text" className='input' placeholder='Email' />
          <input name='password' type="text" className='input' placeholder='Password' />
        </div>

        <div className='register_checkbox_container'>
          <input type='checkbox' />
          <span>
            By creating an account means you agree to the <strong>Terms <br /> & Conditions</strong> and our <strong>Privacy Policy</strong>
          </span>
        </div>

        <Button title={'Sign Up'} isLoading={isLoadingRegisterUser} />
      </form>

      <span onClick={() => navigate(ROUTES.login)} className='register_account_txt'>Already have an account? Sign In</span>
    </ViewAuth>
  )
}

export default Register