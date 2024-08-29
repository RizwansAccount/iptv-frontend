import { useDispatch, useSelector } from "react-redux"
import { hideSnackBarMessage, setSnackBarMessage, snackBarErrorSelector, snackBarMessageSelector } from "../redux/SnackBarReducer";

export function useSnackBarManager() {

    const dispatch = useDispatch();
    const isShowSnackBar = useSelector(snackBarMessageSelector);
    const isError = useSelector(snackBarErrorSelector);

    const fnShowSnackBar = (message) => {
        if (message) {
            dispatch(setSnackBarMessage(message));
        };
        setTimeout(() => { dispatch(hideSnackBarMessage()) }, 3000);
    };

    const fnHideSnackBar = () => {
        dispatch(hideSnackBarMessage())
    };

    return {
        isShowSnackBar,
        isError,

        fnShowSnackBar,
        fnHideSnackBar

    }
}