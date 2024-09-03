import React from 'react';
import Lottie from "react-lottie";
import LoaderAnimation from '../../animations/loader.json';
import EmptyLoaderAnimation from '../../animations/empty_loader.json'
import './style.css';

const Loader = () => {
  return (
    <div className='lottie_container'>
        <Lottie options={{ animationData: LoaderAnimation }} style={{height: '150px', width:'150px'}} />
    </div>
  )
}
export const EmptyLoader = () => {
  return (
    <div className='empty_loader_container'>
        <Lottie options={{ animationData: EmptyLoaderAnimation }} style={{height: '150px', width:'150px'}} />
    </div>
  )
}

export default Loader