import React from 'react'
import './style.css'
import { useSnackBarManager } from '../../hooks/jdlfkjaf';

const SnackBar = () => {
    const { isShowSnackBar, isError } = useSnackBarManager();
    return (
        <div className={`snackBar ${isShowSnackBar ? 'show' : 'hide'} ${isError ? 'error' : ''}`}>
            <i className={`icon ${isError ? "ri-error-warning-fill" : "ri-check-double-line"}`}></i>
            <span className="message">
                {isShowSnackBar}
            </span>
        </div>
    );
};

export default SnackBar