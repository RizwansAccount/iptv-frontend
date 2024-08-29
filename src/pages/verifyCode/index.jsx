import React, { useState } from 'react'
import ViewAuth from '../../components/Views/ViewAuth'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { ROUTES } from '../../routes/RouteConstants'
import { useSnackBarManager } from '../../hooks/useSnackBarManager'
import { useResendCodeMutation, useVerifyUserMutation } from '../../redux/storeApis'
import Loader from '../../components/Loader'

const VerifyCode = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { fnShowSnackBar } = useSnackBarManager();

    const [verifyUser, { isLoading: isLoadingVerifyUser }] = useVerifyUserMutation();
    const [resendCode, { isLoading: isLoadingResendCode }] = useResendCodeMutation();

    const email = location?.state?.email ? location?.state?.email : "";

    const [code, setCode] = useState(null);

    const fnVerifyCode = async () => {
        if (email && code) {
            const result = await verifyUser({ email, verification_code: code });
            const response = result?.data;
            if (response?.success) {
                navigate(ROUTES.login);
                fnShowSnackBar(response?.message);
            } else {
                fnShowSnackBar(response?.message || 'something went wrong!');
            }
        } else {
            fnShowSnackBar('please enter your code to verify!', true)
        }
    };

    const fnResendCode = async () => {
        try {
            const result = await resendCode({ email });
            const response = result?.data;
            if (response?.success) {
                fnShowSnackBar('Code sent! check your email!');
            } else {
                fnShowSnackBar((response?.message || 'something went wrong!'), true)
            }
        } catch (error) {
            fnShowSnackBar('something went wrong!', true)
        }
    };

    return (
        <ViewAuth>
            <div className='code_header_container'>
                <h1 className='heading'>We have emailed you a code</h1>
                <span className='description' >To complete your account setup, Enter the code <br /> We,ve sent to: </span>
                <span className='email'>{email}</span>
            </div>

            <input className='code_input' value={code} name='code' type="text" placeholder='Verification Code' onChange={(e) => setCode(e.target.value)} />

            <Button onClick={fnVerifyCode} isLoading={isLoadingVerifyUser} title={'Submit'} />

            <span onClick={fnResendCode} className='code_receive_email'>Don’t receive an email? <span>Resend</span></span>

            { isLoadingResendCode && <Loader/> }
        </ViewAuth>
    )
}

export default VerifyCode