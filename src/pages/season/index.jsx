import React, { useState } from 'react'
import './style.css'
import { useAddSeasonMutation, useDeleteSeasonMutation, useGetAllSeasonsQuery, useGetAllSeriesQuery, useUpdateSeasonMutation } from '../../redux/storeApis'
import Loader, { EmptyLoader } from '../../components/Loader';
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import ViewList from '../../components/Views/ViewList';
import Modal, { DeleteModal } from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import { useSearchManager } from '../../hooks/useSearchManager';
import { Pagination } from 'antd';
import { useGetAllListManager } from '../../hooks/useGetAllListManager';
import { usePaginationManger } from '../../hooks/usePaginationManager';
import { DeleteIcon, RevertIcon } from '../../assets/icons';

const Season = () => {

  const { fnShowSnackBar } = useSnackBarManager();
  const { searchTxt } = useSearchManager();
  const { totalSeasons } = useGetAllListManager();
  const { defaultCurrent, pageSize, pageSizeOptions, fnOnChangePagination } = usePaginationManger();

  const { data: allSeasons, isLoading: isLoadingAllSeasons, isFetching: isFetchingSeasons } = useGetAllSeasonsQuery({ search: searchTxt, page: defaultCurrent, limit: pageSize });
  const { data: seriesData } = useGetAllSeriesQuery();
  const [addSeason, { isLoading: isLoadingAddSeason }] = useAddSeasonMutation();
  const [updateSeason, { isLoading: isLoadingUpdateSeason }] = useUpdateSeasonMutation();
  const [deleteSeason, { isLoading: isLoadingDeleteSeason }] = useDeleteSeasonMutation();

  const allSeries = seriesData?.filter((series) => series?.is_deleted == false);

  const [addUpdateModal, setAddUpdateModal] = useState({ state: false, type: null });
  const [selectedSeason, setSelectedSeason] = useState({ name: '', description: '', series_id: null });
  const [deleteSeasonId, setDeleteSeasonId] = useState(null);

  const isAddModal = addUpdateModal.type == 'add';

  const fnOnChange = (e) => {
    const { name, value } = e.target;
    setSelectedSeason((pre) => ({ ...pre, [name]: value }));
  };

  const fnOnModalClose = () => {
    setSelectedSeason({ name: '', description: '', series_id: null });
    setAddUpdateModal({ state : false, type : null })
  };

  const fnAddSeason = async () => {
    const checkValidation = Object.values(selectedSeason)?.every(value => value);
    if (checkValidation) {
      try {
        const result = await addSeason({ ...selectedSeason });
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Season added successfully!');
          fnOnModalClose();
        }
      } catch (error) {
        fnShowSnackBar('something went wrong!', true)
      }
    } else {
      fnShowSnackBar('required all fields', true);
    }
  };

  const fnUpdateSeason = async (body) => {
    try {
      const result = await updateSeason(body);
      const response = result?.data;
      if (response?.success) {
        fnShowSnackBar('Season updated successfully!');
        fnOnModalClose();
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true)
    }
  };

  const fnGetSeriesName = (id) => {
    const name = allSeries?.find((series) => series?._id == id)?.name;
    return name;
  };

  const fnOnEditSeason = (season) => {
    const { _id, name, description, series_id } = season;
    setSelectedSeason({ name, description, series_id, _id });
    setAddUpdateModal({state: true, type : 'update'});
  };

  const fnDelete = async () => {
    try {
      const result = await deleteSeason(deleteSeasonId);
      const response = result?.data;
      if (response?.success) {
        setDeleteSeasonId(null);
        fnShowSnackBar('Season deleted successfully!')
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  return (
    <div className='view_page_container' >
      {(isLoadingAllSeasons || isFetchingSeasons) ? <Loader />
        : <ViewCrudContainer onAdd={() => setAddUpdateModal({state: true, type : 'add'})} type='seasons' >
          {
            allSeasons?.length > 0 ? allSeasons?.map((season) => {
              const series_id = season?.series_id;
              return (
                <ViewList>
                  <p className='list'>{season?.name}</p>
                  <p className='list spacing'>{season?.description}</p>
                  <p className='list'>{fnGetSeriesName(series_id)}</p>
                  <p className='list'>{season?.is_deleted ? 'Deleted' : 'Active'}</p>
                  <div className='edit_view_box list'>
                    <p style={{ cursor: 'pointer' }} onClick={() => fnOnEditSeason(season)} >Edit</p>

                    {season?.is_deleted ? <RevertIcon onClick={() => fnUpdateSeason({ _id: season?._id, is_deleted: false })} />
                      : <DeleteIcon onClick={() => setDeleteSeasonId(season?._id)} />}

                  </div>
                </ViewList>
              )
            })
              : <EmptyLoader />
          }
        </ViewCrudContainer>}

      {!isLoadingAllSeasons && <div className='pagination_container'>
        <Pagination
          defaultCurrent={defaultCurrent}
          showSizeChanger
          total={totalSeasons}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          onChange={fnOnChangePagination}
        />
      </div>}

      <Modal open={addUpdateModal.state} title={(isAddModal ? 'Add' : 'Update') + ' Season'} onClose={fnOnModalClose}>
        
        <Input inputTitle='Name' value={selectedSeason?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedSeason?.description} name={'description'} onChange={fnOnChange} />
        
        <p>{'Series'}</p>
        
        <select className='select_style' value={selectedSeason?.series_id} name='series_id' onChange={fnOnChange}>
          <option hidden >Select Series</option>
          {allSeries?.map((series) => <option value={series?._id}>{series?.name}</option>)}
        </select>
        
        <Button
          title={isAddModal ? 'Save' : 'Update'} isLoading={isLoadingAddSeason || isLoadingUpdateSeason}
          onClick={()=> { isAddModal ? fnAddSeason() : fnUpdateSeason({...selectedSeason}) }}
          style={{ width: 'fit-content' }}
        />

      </Modal>

      <DeleteModal open={deleteSeasonId} onClose={() => setDeleteSeasonId(null)}>
        <p>Are you sure to want to delete this Season ?</p>
        <Button onClick={fnDelete} title={'Delete'} isLoading={isLoadingDeleteSeason} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </div>
  )
}

export default Season