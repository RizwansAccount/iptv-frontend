import React from 'react'
import './style.css'
import { useSnackBarManager } from '../../hooks/useSnackBarManager';

const SnackBar = () => {
    const { isShowSnackBar, isError } = useSnackBarManager();
    return (
        <div className={`snackBar ${isShowSnackBar && 'show'} ${isError && 'error'}`}>
            <i className={`icon ${isError ? "ri-error-warning-fill" : "ri-check-double-line"}`}></i>
            <span className="message">
                {isShowSnackBar}
            </span>
        </div>
    );
};

export default SnackBar