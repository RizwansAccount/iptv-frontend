import React, { useState } from 'react'
import './style.css'
import { useAddSeasonMutation, useDeleteSeasonMutation, useGetAllSeasonsQuery, useGetAllSeriesQuery, useUpdateSeasonMutation } from '../../redux/storeApis'
import Loader from '../../components/Loader';
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import ViewList from '../../components/Views/ViewList';
import Modal, { DeleteModal } from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';

const Season = () => {
  const { data: allSeasons, isLoading: isLoadingAllSeasons } = useGetAllSeasonsQuery();
  const { data: seriesData, isLoading: isLoadingSeriesData } = useGetAllSeriesQuery();
  const [addSeason, { isLoading: isLoadingAddSeason }] = useAddSeasonMutation();
  const [updateSeason, { isLoading: isLoadingUpdateSeason }] = useUpdateSeasonMutation();
  const [deleteSeason, { isLoading: isLoadingDeleteSeason }] = useDeleteSeasonMutation();

  const { fnShowSnackBar } = useSnackBarManager();

  const allSeries = seriesData?.filter((series) => series?.is_deleted == false);

  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState({ name: '', description: '', series_id: null });
  const [deleteSeasonId, setDeleteSeasonId] = useState(null);

  const fnOnChange = (e) => {
    const { name, value } = e.target;
    setSelectedSeason((pre) => ({ ...pre, [name]: value }));
  };

  const fnOnModalClose = (type) => {
    setSelectedSeason({ name: '', description: '', series_id: null });
    if (type == 'update') { setUpdateModal(false); }
    else { setAddModal(false); }
  };

  const fnAddSeason = async () => {
    const checkValidation = Object.values(selectedSeason)?.every(value => value);
    if (checkValidation) {
      try {
        const result = await addSeason({ ...selectedSeason });
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Season added successfully!');
          setSelectedSeason({ name: '', description: '', series_id: null });
          setAddModal(false);
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
        setSelectedSeason({ name: '', description: '', series_id: null });
        setUpdateModal(false);
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true)
    }
  };

  const fnGetSeasonName = (id) => {
    const name = allSeries?.find((series) => series?._id == id)?.name;
    return name;
  };

  const fnOnEditSeason = (season) => {
    const { _id, name, description, series_id } = season;
    setSelectedSeason({ name, description, series_id, _id });
    setUpdateModal(true);
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
    <>
      {isLoadingAllSeasons ? <Loader />
        : <ViewCrudContainer onAdd={() => setAddModal(true)} type='seasons' >
          {allSeasons?.map((season) => {
            const series_id = season?.series_id;
            return (
              <ViewList>
                <p className='list'>{season?.name}</p>
                <p className='list spacing'>{season?.description}</p>
                <p className='list'>{fnGetSeasonName(series_id)}</p>
                <p className='list'>{season?.is_deleted ? 'Deleted' : 'Active'}</p>
                <div className='edit_view_box list'>
                  <p style={{ cursor: 'pointer' }} onClick={() => fnOnEditSeason(season)} >Edit</p>
                  <p style={{ cursor: 'pointer' }}  >
                    {season?.is_deleted ?
                      <i onClick={()=> fnUpdateSeason({ _id : season?._id, is_deleted : false})} className="ri-reset-left-line"></i>
                      : <i onClick={() => setDeleteSeasonId(season?._id)} className="ri-delete-bin-6-line"></i>}
                  </p>
                </div>
              </ViewList>
            )
          })}
        </ViewCrudContainer>}

      <Modal open={addModal} title='Add Season' onClose={fnOnModalClose}>
        <Input inputTitle='Name' value={selectedSeason?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedSeason?.description} name={'description'} onChange={fnOnChange} />
        <p>{'Select Series'}</p>
        <select className='select_style' value={selectedSeason?.series_id} name='series_id' onChange={fnOnChange}>
          <option hidden >Select Season</option>
          {allSeries?.map((series) => <option value={series?._id}>{series?.name}</option>)}
        </select>
        <Button title={'Save'} isLoading={isLoadingAddSeason} onClick={fnAddSeason} style={{ width: 'fit-content' }} />
      </Modal>

      <Modal open={updateModal} title='Update Season' onClose={() => fnOnModalClose('update')}>
        <Input inputTitle='Name' value={selectedSeason?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedSeason?.description} name={'description'} onChange={fnOnChange} />
        <p>{'Select Series'}</p>
        <select className='select_style' value={selectedSeason?.series_id} name='series_id' onChange={fnOnChange}>
          <option hidden >Select Season</option>
          {allSeries?.map((series) => <option value={series?._id}>{series?.name}</option>)}
        </select>
        <Button title={'Update'} isLoading={isLoadingUpdateSeason} onClick={()=>fnUpdateSeason({ ...selectedSeason })} style={{ width: 'fit-content' }} />
      </Modal>

      <DeleteModal open={deleteSeasonId} onClose={() => setDeleteSeasonId(null)}>
        <p>Are you sure to want to delete this Season ?</p>
        <Button onClick={fnDelete} title={'Delete'} isLoading={isLoadingDeleteSeason} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </>
  )
}

export default Season