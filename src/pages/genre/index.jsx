import React, { useState } from 'react'
import './style.css'
import { useAddGenreMutation, useDeleteGenreMutation, useGetAllGenreQuery, useUpdateGenreMutation } from '../../redux/storeApis'
import Loader from '../../components/Loader';
import ViewList from '../../components/Views/ViewList';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';

const Genre = () => {
  const { data: allGenres, isLoading: isLoadingAllGenres } = useGetAllGenreQuery();
  const [addGenre, { isLoading: isLoadingAddGenre }] = useAddGenreMutation();
  const [deleteGenre, { isLoading: isLoadingDeleteGenre }] = useDeleteGenreMutation();
  const [updateGenre, { isLoading: isLoadingUpdateGenre }] = useUpdateGenreMutation();

  const { fnShowSnackBar } = useSnackBarManager();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [deleteGenreId, setDeleteGenreId] = useState(null);
  const [addModal, setAddModal] = useState(false);

  const fnOnRevertDeleteView = (genre) => {
    const id = genre?._id;
    const isDeleted = genre?.is_deleted;
    if (isDeleted) {
      fnUpdateGenre({ _id: genre?._id, is_deleted: false });
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
        if (selectedGenre) { setSelectedGenre(null) };
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  const fnAddGenre = async (body) => {
    const checkValidation = body?.name;
    if(checkValidation) {
      try {
        const result = await addGenre(body);
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Genre added successfully!');
          setSelectedGenre(null);
          setAddModal(false);
        }
      } catch (error) {
        fnShowSnackBar('something went wrong!', true);
      }
    } else {
      fnShowSnackBar('please filled all fields', true);
    }
  };

  return (
    <>
      {isLoadingAllGenres ? <Loader /> :
        <ViewCrudContainer onAdd={() => setAddModal(true)}>
          {allGenres?.map((genre) => {
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
          })}
        </ViewCrudContainer>
      }

      <Modal open={addModal} onClose={() => setAddModal(false)}>
        <h3 style={{ padding: '12px 0px' }} >Add Genre</h3>
        <div>
          <p>Name</p>
          <Input value={selectedGenre?.name} onChange={(e) => setSelectedGenre((pre) => ({ ...pre, name: e.target.value }))} />
        </div>
        <Button onClick={() => fnAddGenre({ name: selectedGenre?.name })} isLoading={isLoadingAddGenre} style={{ width: 'fit-content' }} title={'Save'} />
      </Modal>

      <Modal open={selectedGenre} onClose={() => setSelectedGenre(null)}>
        <h3 style={{ padding: '12px 0px' }} >Edit Genre</h3>
        <div>
          <p>Name</p>
          <Input value={selectedGenre?.name} onChange={(e) => setSelectedGenre((pre) => ({ ...pre, name: e.target.value }))} />
        </div>
        <Button onClick={() => fnUpdateGenre({ _id: selectedGenre?._id, name: selectedGenre?.name })} isLoading={isLoadingUpdateGenre} style={{ width: 'fit-content' }} title={'Update'} />
      </Modal>

      <DeleteModal open={deleteGenreId} onClose={() => setDeleteGenreId(null)}>
        <p>Are you sure to want to delete this Genre ?</p>
        <Button onClick={fnDeleteGenre} title={'Delete'} isLoading={isLoadingDeleteGenre} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </>
  )
}

export default Genre