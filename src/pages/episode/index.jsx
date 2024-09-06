import React, { useState } from 'react'
import './style.css'
import { useAddEpisodeMutation, useDeleteEpisodeMutation, useGetAllEpisodesQuery, useGetAllSeasonsQuery, useGetFileQuery, useUpdateEpisodeMutation, useUploadFileMutation } from '../../redux/storeApis'
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
import { Config } from '../../constants';

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
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const [addUpdateModal, setAddUpdateModal] = useState({ state: false, type: null });
  const [selectedEpisode, setSelectedEpisode] = useState({ name: '', description: '', season_id: null, file : null });
  const [deleteEpisodeId, setDeleteEpisodeId] = useState(false);

  const [selectedImage, setSelectedImage] = useState(false);

  const { data: fileData, isLoading: isLoadingFile } = useGetFileQuery(selectedEpisode?.thumbnail_id);

  const isAddModal = addUpdateModal.type == 'add';

  const fnOnChange = (e) => {
    const { name, value } = e.target;
    setSelectedEpisode((pre) => ({ ...pre, [name]: value }));
  };

  const fnOnFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedEpisode((pre) => ({ ...pre, file }));
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    };
  };

  const fnOnModalClose = () => {
    setSelectedEpisode({ name: '', description: '', season_id: null, file : null });
    setAddUpdateModal({ state : false, type : null });
    setSelectedImage(null);
  };

  const fnGetSeasonName = (id) => {
    const name = allSeasons?.find((season) => season?._id == id)?.name;
    return name;
  };

  const fnOnEditEpisode = (episode) => {
    const { _id, name, description, season_id, thumbnail_id } = episode;
    setSelectedEpisode({ name, description, season_id, _id, thumbnail_id });
    setAddUpdateModal({ state : true, type : 'update' })
  };

  const fnAddEpisode = async () => {
    const checkValidation = Object.values(selectedEpisode)?.every(value => value);
    if (checkValidation) {
      try {
        const file = selectedEpisode?.file;

        let formData = new FormData();
        formData.append('file', file);

        const fileResponse = await uploadFile(formData);
        const thumbnail_id = fileResponse?.data?._id;

        const body = { name : selectedEpisode?.name, description : selectedEpisode?.description, season_id : selectedEpisode?.season_id, thumbnail_id };

        const result = await addEpisode(body);
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Episode added successfully!');
          fnOnModalClose();
        }
      } catch (error) {
        fnShowSnackBar('something went wrong!', true)
      }
    } else {
      fnShowSnackBar('required all fields', true);
    }
  };

  const fnUpdateEpisode = async (data) => {
    try {
      const file = selectedEpisode?.file;
      let thumbnail_id;

      if (file) {
        let formData = new FormData();
        formData.append('file', file);
        const fileResponse = await uploadFile(formData);
        thumbnail_id = fileResponse?.data?._id;
      }

      const newData = {
        _id: selectedEpisode?._id,
        name: selectedEpisode?.name,
        description: selectedEpisode?.description,
        thumbnail_id: thumbnail_id ?? selectedEpisode?.thumbnail_id
      };

      const body = {...data, ...newData};

      const result = await updateEpisode(body);
      const response = result?.data;
      if (response?.success) {
        fnShowSnackBar('Episode updated successfully!');
        fnOnModalClose();
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
          : <ViewCrudContainer onAdd={()=> setAddUpdateModal({ state : true, type : 'add' })} type='episodes' >
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
                        : <DeleteIcon onClick={() => setDeleteEpisodeId(episode?._id)} />}

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

      <Modal open={addUpdateModal.state} title={(isAddModal ? 'Add' : 'Update') + ' Episode'} onClose={fnOnModalClose}>

        <Input inputTitle='Name' value={selectedEpisode?.name} name={'name'} onChange={fnOnChange} />
        <Input inputTitle='Description' value={selectedEpisode?.description} name={'description'} onChange={fnOnChange} />

        <p>{'Season'}</p>
        <select className='select_style' value={selectedEpisode?.season_id} name='season_id' onChange={fnOnChange}>
          <option hidden >Select Season</option>
          {allSeasons?.map((season) => <option value={season?._id}>{season?.name}</option>)}
        </select>

        <Input inputTitle='Select File' type='file' onChange={fnOnFileChange} />
        { isAddModal ? selectedImage && <img src={selectedImage} className='series_img' />
          : <img src={selectedImage ? selectedImage : (Config.imgUrl + fileData?.original_name)} className='series_img' />
        }

        <Button
          title={isAddModal ? 'Save' : 'Update'}
          isLoading={isLoadingUploadFile || isLoadingAddEpisode || isLoadingUpdateEpisode}
          onClick={()=> { isAddModal ? fnAddEpisode() : fnUpdateEpisode({ name:selectedEpisode?.name, description:selectedEpisode?.description, season_id:selectedEpisode?.season_id  }) }}
          style={{ width: 'fit-content' }}
        />

      </Modal>

      <DeleteModal open={deleteEpisodeId} onClose={() => setDeleteEpisodeId(null)}>
        <p>Are you sure to want to delete this Episode ?</p>
        <Button onClick={fnDelete} title={'Delete'} isLoading={isLoadingDeleteEpisode} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </div>
  )
}

export default Episode