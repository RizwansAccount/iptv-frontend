import React from 'react'
import './style.css'
import ViewList from '../ViewList'

const ViewCrudContainer = ({ children, onAdd, type = 'genre' }) => {
    return (
        <div className='crud_container'>

            <ViewList>
                {
                    type == 'series' ? <>
                        <h4 className='list'>Name</h4>
                        <h4 className='list'>Description</h4>
                        <h4 className='list'>Status</h4>
                        <h4 className='list'>Action</h4>
                    </> : <>
                        <h4 className='list'>Name</h4>
                        <h4 className='list'>Status</h4>
                        <h4 className='list'>Action</h4>
                    </>
                }
            </ViewList>

            {children}

            <i onClick={onAdd} className="ri-add-line add_btn"></i>

        </div>
    )
}

export default ViewCrudContainer