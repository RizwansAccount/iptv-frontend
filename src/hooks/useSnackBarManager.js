import { useDispatch, useSelector } from "react-redux"
import { hideSnackBarMessage, setSnackBarMessage, setErrorMessage, snackBarErrorSelector, snackBarMessageSelector } from "../redux/SnackBarReducer";

export function useSnackBarManager() {

    const dispatch = useDispatch();
    const isShowSnackBar = useSelector(snackBarMessageSelector);
    const isError = useSelector(snackBarErrorSelector);

    const fnShowSnackBar = (message, error = false) => {

        if (error) { dispatch(setErrorMessage(error)); };
        if (message) { dispatch(setSnackBarMessage(message)); };
        setTimeout(() => { fnHideSnackBar() }, 3000);
    };

    const fnHideSnackBar = () => {
        dispatch(hideSnackBarMessage());
        setTimeout(() => {dispatch(setErrorMessage(false));}, 1000);
    };

    return {
        isShowSnackBar,
        isError,

        fnShowSnackBar,
        fnHideSnackBar

    }
}