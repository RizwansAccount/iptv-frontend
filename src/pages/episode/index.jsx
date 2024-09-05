import React, { useState } from 'react'
import './style.css'
import { useAddEpisodeMutation, useDeleteEpisodeMutation, useGetAllEpisodesQuery, useGetAllSeasonsQuery, useUpdateEpisodeMutation } from '../../redux/storeApis'
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import Loader, { EmptyLoader } from '../../components/Loader';
import ViewList from '../../components/Views/ViewList';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSearchManager } from '../../hooks/useSearchManager';
import { useGetAllListManager } from '../../hooks/useGetAllListManager';
import { usePaginationManger } from '../../hooks/usePaginationManager';
import { Pagination } from 'antd';
import { DeleteIcon, RevertIcon } from '../../assets/icons';

const Episode = () => {

  const { fnShowSnackBar } = useSnackBarManager();
  const { searchTxt } = useSearchManager();
  const { totalEpisodes } = useGetAllListManager();
  const { defaultCurrent, pageSize, pageSizeOptions, fnOnChangePagination } = usePaginationManger();

  const { data: allEpisodes, isLoading: isLoadingAllEpisodes, isFetching: isFetchingEpisodes } = useGetAllEpisodesQuery({ search: searchTxt, page: defaultCurrent, limit: pageSize });
  const { data: allSeasons, isLoading: isLoadingAllSeasons } = useGetAllSeasonsQuery();
  const [addEpisode, { isLoading: isLoadingAddEpisode }] = useAddEpisodeMutation();
  const [updateEpisode, { isLoading: isLoadingUpdateEpisode }] = useUpdateEpisodeMutation();
  const [deleteEpisode, { isLoading: isLoadingDeleteEpisode }] = useDeleteEpisodeMutation();

  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState({ name: '', description: '', season_id: null });
  const [deleteEpisodeId, setDeleteEpisodeId] = useState(false);

  const fnOnChange = (e) => {
    const { name, value } = e.target;
    setSelectedEpisode((pre) => ({ ...pre, [name]: value }));
  };

  const fnOnModalClose = (type) => {
    setSelectedEpisode({ name: '', description: '', season_id: null });
    if (type == 'update') { setUpdateModal(false); }
    else { setAddModal(false); }
  };

  const fnGetSeasonName = (id) => {
    const name = allSeasons?.find((season) => season?._id == id)?.name;
    return name;
  };

  const fnOnEditEpisode = (episode) => {
    const { _id, name, description, season_id } = episode;
    setSelectedEpisode({ name, description, season_id, _id });
    setUpdateModal(true);
  };

  const fnAddEpisode = async () => {
    const checkValidation = Object.values(selectedEpisode)?.every(value => value);
    if (checkValidation) {
      try {
        const result = await addEpisode({ ...selectedEpisode });
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Episode added successfully!');
          setSelectedEpisode({ name: '', description: '', season_id: null });
          setAddModal(false);
        }
      } catch (error) {
        fnShowSnackBar('something went wrong!', true)
      }
    } else {
      fnShowSnackBar('required all fields', true);
    }
  };

  const fnUpdateEpisode = async (body) => {
    try {
      const result = await updateEpisode(body);
      const response = result?.data;
      if (response?.success) {
        fnShowSnackBar('Episode updated successfully!');
        setSelectedEpisode({ name: '', description: '', season_id: null });
        setUpdateModal(false);
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true)
    }
  };

  const fnDelete = async () => {
    try {
      const result = await deleteEpisode(deleteEpisodeId);
      const response = result?.data;
      if (response?.success) {
        setDeleteEpisodeId(null);
        fnShowSnackBar('Episode deleted successfully!')
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  return (
    <div className='view_page_container'>
      {
        (isLoadingAllEpisodes || isFetchingEpisodes) ? <Loader />
          : <ViewCrudContainer type='episodes' >
            {
              allEpisodes?.length > 0 ? allEpisodes?.map((episode) => {
                return (
                  <ViewList>
                    <p className='list'>{episode?.name}</p>
                    <p className='list spacing'>{episode?.description}</p>
                    <p className='list'>{fnGetSeasonName(episode?.season_id)}</p>
                    <p className='list'>{episode?.is_deleted ? 'Deleted' : 'Active'}</p>
                    <div className='edit_view_box list'>
                      <p style={{ cursor: 'pointer' }} onClick={() => fnOnEditEpisode(episode)} >Edit</p>

                      {episode?.is_deleted ? <RevertIcon onClick={() => fnUpdateEpisode({ _id: episode?._id, is_deleted: false })} />
                        : <DeleteIcon onClick={() => setDeleteEpisodeId(episode?._id)} /> }
                        
                    </div>
                  </ViewList>
                )
              })
                : <EmptyLoader />
            }
          </ViewCrudContainer>
      }

      {!isLoadingAllEpisodes && <div className='pagination_container'>
        <Pagination
          defaultCurrent={defaultCurrent}
          showSizeChanger
          total={totalEpisodes}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          onChange={fnOnChangePagination}
        />
      </div>}

      <Modal open={addModal} title='Add Episode' onClose={fnOnModalClose}>
        <Input inputTitle='Name' value={selectedEpisode?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedEpisode?.description} name={'description'} onChange={fnOnChange} />
        <p>{'Select Season'}</p>
        <select className='select_style' value={selectedEpisode?.season_id} name='season_id' onChange={fnOnChange}>
          <option hidden >Select Season</option>
          {allSeasons?.map((season) => <option value={season?._id}>{season?.name}</option>)}
        </select>
        <Button title={'Save'} isLoading={isLoadingAddEpisode} onClick={fnAddEpisode} style={{ width: 'fit-content' }} />
      </Modal>

      <Modal open={updateModal} title='Update Episode' onClose={() => fnOnModalClose('update')}>
        <Input inputTitle='Name' value={selectedEpisode?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedEpisode?.description} name={'description'} onChange={fnOnChange} />
        <p>{'Select Season'}</p>
        <select className='select_style' value={selectedEpisode?.season_id} name='season_id' onChange={fnOnChange}>
          <option hidden >Select Season</option>
          {allSeasons?.map((season) => <option value={season?._id}>{season?.name}</option>)}
        </select>
        <Button title={'Update'} isLoading={isLoadingUpdateEpisode} onClick={() => fnUpdateEpisode({ ...selectedEpisode })} style={{ width: 'fit-content' }} />
      </Modal>

      <DeleteModal open={deleteEpisodeId} onClose={() => setDeleteEpisodeId(null)}>
        <p>Are you sure to want to delete this Episode ?</p>
        <Button onClick={fnDelete} title={'Delete'} isLoading={isLoadingDeleteEpisode} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </div>
  )
}

export default Episode