import React from 'react'
import ReactRoutes from './routes'
import './index.css';
import SnackBar from './components/SnackBar';

const App = () => {
  return (
    <>
      <ReactRoutes/>
      <SnackBar/>
    </>
  )
}

export default App