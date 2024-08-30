import React, { useState } from 'react'
import './style.css'
import { useDeleteGenreMutation, useGetAllGenreQuery, useUpdateGenreMutation } from '../../redux/storeApis'
import Loader from '../../components/Loader';
import ViewList from '../../components/Views/ViewList';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';

const Genre = () => {
  const { data: allGenres, isLoading: isLoadingAllGenres } = useGetAllGenreQuery();
  const [deleteGenre, { isLoading: isLoadingDeleteGenre }] = useDeleteGenreMutation();
  const [updateGenre, { isLoading: isLoadingUpdateGenre }] = useUpdateGenreMutation();

  const { fnShowSnackBar } = useSnackBarManager();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [deleteGenreId, setDeleteGenreId] = useState(null);

  const fnOnRevertDeleteView = (genre) => {
    const id = genre?._id;
    const isDeleted = genre?.is_deleted;
    if (isDeleted) {
      fnUpdateGenre({ _id : genre?._id, is_deleted : false });
    } else {
      setDeleteGenreId(id);
    }
  };

  const fnDeleteGenre = async () => {
    try {
      const result = await deleteGenre(deleteGenreId);
      const response = result?.data;
      if (response?.success) {
        setDeleteGenreId(null);
        fnShowSnackBar('Genre deleted successfully!')
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  const fnUpdateGenre = async (body) => {
    try {
      const result = await updateGenre(body);
      const response = result?.data;
      if (response?.success) {
        fnShowSnackBar('Genre updated successfully!');
        if(selectedGenre) {  setSelectedGenre(null) };
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  return (
    <>
      {isLoadingAllGenres ? <Loader /> :
        <div className='genre_container'>
          <ViewList>
            <h4 className='list'>Name</h4>
            <h4 className='list'>Status</h4>
            <h4 className='list'>Action</h4>
          </ViewList>
          {
            allGenres?.map((genre) => {
              return (
                <ViewList>
                  <p className='list'>{genre?.name}</p>
                  <p className='list'>{genre?.is_deleted ? 'Deleted' : 'Active'}</p>
                  <div className='edit_view_box list'>
                    <p style={{ cursor: 'pointer' }} onClick={() => setSelectedGenre(genre)}>Edit</p>
                    <p style={{ cursor: 'pointer' }} onClick={() => fnOnRevertDeleteView(genre)}>
                      {genre?.is_deleted ? <i className="ri-reset-left-line"></i> : <i className="ri-delete-bin-6-line"></i>}
                    </p>
                  </div>
                </ViewList>
              )
            })
          }
        </div>}

      <Modal open={selectedGenre} onClose={() => setSelectedGenre(null)}>
        <h3>Name</h3>
        <Input value={selectedGenre?.name} onChange={(e)=> setSelectedGenre((pre)=>({...pre, name : e.target.value}))} />
        <Button onClick={()=>fnUpdateGenre({_id : selectedGenre?._id, name: selectedGenre?.name})} isLoading={isLoadingUpdateGenre} style={{ width: 'fit-content' }} title={'Save'} />
      </Modal>

      <DeleteModal open={deleteGenreId} onClose={() => setDeleteGenreId(null)}>
        <p>Are you sure to want to delete this Genre ?</p>
        <Button onClick={fnDeleteGenre} title={'Delete'} isLoading={isLoadingDeleteGenre} style={{ width: 'fit-content', backgroundColor: 'red', minWidth: '120px' }} />
      </DeleteModal>

    </>
  )
}

export default Genre