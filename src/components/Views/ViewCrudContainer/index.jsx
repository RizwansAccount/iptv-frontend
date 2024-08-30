import React from 'react'
import './style.css'
import ViewList from '../ViewList'

const ViewCrudContainer = ({ children }) => {
    return (
        <div className='crud_container'>
            
            <ViewList>
                <h4 className='list'>Name</h4>
                <h4 className='list'>Status</h4>
                <h4 className='list'>Action</h4>
            </ViewList>

            {children}

        </div>
    )
}

export default ViewCrudContainer