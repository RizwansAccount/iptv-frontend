const getLocalStorage =(key)=>{
    return localStorage.getItem(key);
};

const setLocalStorage =(key, data)=>{
    localStorage.setItem(key, data);
};

const removeLocalStorage =(key)=>{
    localStorage.removeItem(key);
};

export { getLocalStorage, setLocalStorage, removeLocalStorage };