import React, { useEffect, useState } from 'react'
import './style.css'
import { useAddGenreMutation, useDeleteGenreMutation, useGetAllGenreQuery, useUpdateGenreMutation } from '../../redux/storeApis'
import Loader, { EmptyLoader } from '../../components/Loader';
import ViewList from '../../components/Views/ViewList';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import { useSearchManager } from '../../hooks/useSearchManager';
import { useGetAllListManager } from '../../hooks/useGetAllListManager';
import { usePaginationManger } from '../../hooks/usePaginationManager';
import { Pagination } from 'antd';
import { DeleteIcon, RevertIcon } from '../../assets/icons';

const Genre = () => {

  const { fnShowSnackBar } = useSnackBarManager();
  const { searchTxt } = useSearchManager();
  const { totalGenres } = useGetAllListManager();
  const { defaultCurrent, pageSize, pageSizeOptions, fnOnChangePagination } = usePaginationManger();

  const { data: allGenres, isLoading: isLoadingAllGenres, isFetching: isFetchingGenres } = useGetAllGenreQuery({ search: searchTxt, page: defaultCurrent, limit: pageSize });
  const [addGenre, { isLoading: isLoadingAddGenre }] = useAddGenreMutation();
  const [deleteGenre, { isLoading: isLoadingDeleteGenre }] = useDeleteGenreMutation();
  const [updateGenre, { isLoading: isLoadingUpdateGenre }] = useUpdateGenreMutation();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [deleteGenreId, setDeleteGenreId] = useState(null);
  const [addUpdateModal, setAddUpdateModal] = useState({ state: false, type: null });

  const isAddModal = addUpdateModal.type == 'add';

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
        setSelectedGenre(null);
        setAddUpdateModal({ state: false, type: null })
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  const fnAddGenre = async (body) => {
    const checkValidation = body?.name;
    if (checkValidation) {
      try {
        const result = await addGenre(body);
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Genre added successfully!');
          setSelectedGenre(null);
          setAddUpdateModal({ state: false, type: null })
        };
      } catch (error) {
        fnShowSnackBar('something went wrong!', true);
      }
    } else {
      fnShowSnackBar('please filled all fields', true);
    }
  };

  return (
    <div className='view_page_container'>
      {(isLoadingAllGenres || isFetchingGenres) ? <Loader /> :
        <ViewCrudContainer onAdd={() => setAddUpdateModal({ state: true, type: 'add' })}>
          {allGenres?.length > 0 ? allGenres?.map((genre) => {
            return (
              <ViewList>
                <p className='list'>{genre?.name}</p>
                <p className='list'>{genre?.is_deleted ? 'Deleted' : 'Active'}</p>
                <div className='edit_view_box list'>

                  <p style={{ cursor: 'pointer' }} onClick={() => { setSelectedGenre(genre); setAddUpdateModal({ state: true, type: 'update' }) }}>Edit</p>

                  {genre?.is_deleted ? <RevertIcon onClick={() => fnUpdateGenre({ _id: genre?._id, is_deleted: false })} />
                    : <DeleteIcon onClick={() => setDeleteGenreId(genre?._id)} />}

                </div>
              </ViewList>
            )
          })
            : <EmptyLoader />
          }
        </ViewCrudContainer>
      }

      {!isLoadingAllGenres && <div className='pagination_container'>
        <Pagination
          defaultCurrent={defaultCurrent}
          showSizeChanger
          total={totalGenres}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          onChange={fnOnChangePagination}
        />
      </div>}

      <Modal open={addUpdateModal.state} title={(isAddModal ? 'Add' : 'Update') + ' Genre'} onClose={() => { setAddUpdateModal({ state: false, type: null }); setSelectedGenre(null) }}>
        <div>
          <p>Name</p>
          <Input value={selectedGenre?.name} onChange={(e) => setSelectedGenre((pre) => ({ ...pre, name: e.target.value }))} />
        </div>
        <Button
          onClick={() => { isAddModal ? fnAddGenre({ name: selectedGenre?.name }) : fnUpdateGenre({ _id: selectedGenre?._id, name: selectedGenre?.name }) }}
          isLoading={isLoadingAddGenre || isLoadingUpdateGenre}
          style={{ width: 'fit-content' }}
          title={ isAddModal ? 'Save' : 'Update'}
        />
      </Modal>

      <DeleteModal open={deleteGenreId} onClose={() => setDeleteGenreId(null)}>
        <p>Are you sure to want to delete this Genre ?</p>
        <Button onClick={fnDeleteGenre} title={'Delete'} isLoading={isLoadingDeleteGenre} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </div>
  )
}

export default Genre