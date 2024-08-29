import React, { useState } from 'react'
import ViewAuth from '../../components/Views/ViewAuth'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { apiCall } from '../../api'
import { ROUTES } from '../../routes/RouteConstants'

const VerifyCode = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location?.state?.email ? location?.state?.email : "" ;

    const [code, setCode] = useState(null);

    const fnVerifyCode =async()=>{
        const body = { email, verification_code : code };
        const response = await apiCall({ url:'users/verify-code', http_verb : 'post', data : body });
        if(response?.success) {
            navigate(ROUTES.login);
        }
    };

    const fnResendCode =async()=> {
        const body = { email };
        const response = await apiCall({ url:'users/resend-code', http_verb : 'post', data : body });
        if(response?.success) {
            alert('Check your email!')
        }
    };

  return (
    <ViewAuth>
        <div className='code_header_container'>
            <h1 className='heading'>We have emailed you a code</h1>
            <span className='description' >To complete your account setup, Enter the code <br/> We,ve sent to: </span>
            <span className='email'>{email}</span>
        </div>

        <input className='code_input' value={code} name='code' type="text" placeholder='Verification Code' onChange={(e)=> setCode(e.target.value)} />

        <Button onClick={fnVerifyCode} title={'Submit'} />

        <span onClick={fnResendCode} className='code_receive_email'>Don’t receive an email? <span>Resend</span></span>
    </ViewAuth>
  )
}

export default VerifyCode