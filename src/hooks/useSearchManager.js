import { useDispatch, useSelector } from "react-redux";
import { removeSearch, searchSelector, setSearch } from "../redux/SearchReducer";

export function useSearchManager() {
    const dispatch = useDispatch();

    const searchTxt = useSelector(searchSelector);

    const fnAddSearch =(value)=> {
        dispatch(setSearch(value));
    };

    const fnRemoveSearch =()=>{
        dispatch(removeSearch());
    };

    return {
        searchTxt,
        fnAddSearch,
        fnRemoveSearch
    }

}