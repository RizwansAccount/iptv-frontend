import React, { useState } from 'react'
import './style.css'
import { useAddSeriesMutation, useDeleteSeriesMutation, useGetAllSeriesQuery, useGetFileQuery, useUpdateSeriesMutation, useUploadFileMutation } from '../../redux/storeApis'
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import Loader from '../../components/Loader';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ViewList from '../../components/Views/ViewList';
import { Config } from '../../constants';
import { useSearchManager } from '../../hooks/useSearchManager';

const Series = () => {
  
  const { fnShowSnackBar } = useSnackBarManager();
  const { searchTxt } = useSearchManager();

  const { data: allSeries, isLoading: isLoadingAllSeries } = useGetAllSeriesQuery(searchTxt);
  const [addSeries, { isLoading: isLoadingAddSeries }] = useAddSeriesMutation();
  const [deleteSeries, { isLoading: isLoadingDeleteSeries }] = useDeleteSeriesMutation();
  const [updateSeries, { isLoading: isLoadingUpdateSeries }] = useUpdateSeriesMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const [selectedSeries, setSelectedSeries] = useState({ name: '', description: '', file: null });
  const [deleteSeriesId, setDeleteSeriesId] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(false);

  const { data: file, isLoading: isLoadingFile } = useGetFileQuery(selectedSeries?.thumbnail_id);

  const fnOnRevertDeleteView = async (series) => {
    const id = series?._id;
    const isDeleted = series?.is_deleted;
    if (isDeleted) {
      const result = await updateSeries({ _id: id, is_deleted: false });
      const response = result?.data
      if (response?.success) {
        fnShowSnackBar('Series updated successfully!')
      }
    } else {
      setDeleteSeriesId(id);
    }
  };

  const fnDeleteSeries = async () => {
    try {
      const result = await deleteSeries(deleteSeriesId);
      const response = result?.data;
      if (response?.success) {
        setDeleteSeriesId(null);
        fnShowSnackBar('Series deleted successfully!')
      }
    } catch (error) {
      fnShowSnackBar('something went wrong!', true);
    }
  };

  const fnUpdateSeries = async () => {
    try {
      const file = selectedSeries?.file;

      let tailer_id;
      let thumbnail_id;

      if (file) {
        let formData = new FormData();
        formData.append('file', file);
        const fileResponse = await uploadFile(formData);
        tailer_id = fileResponse?.data?._id;
        thumbnail_id = fileResponse?.data?._id;
      }

      const body = {
        _id: selectedSeries?._id,
        name: selectedSeries?.name,
        description: selectedSeries?.description,
        tailer_id: tailer_id ?? selectedSeries?.tailer_id,
        thumbnail_id: thumbnail_id ?? selectedSeries?.thumbnail_id
      };

      const result = await updateSeries(body);
      const response = result?.data;
      if (response?.success) {
        fnShowSnackBar('Series updated successfully!')
        setSelectedSeries(null)
        setUpdateModal(false);
      }

    } catch (error) {
      fnShowSnackBar('something went wrong!', true)
    }
  };

  const fnAddSeries = async () => {

    const checkValidation = Object?.values(selectedSeries)?.every(value => value);
    if (checkValidation) {
      try {
        const file = selectedSeries?.file;

        let formData = new FormData();
        formData.append('file', file);

        const fileResponse = await uploadFile(formData);
        const tailer_id = fileResponse?.data?._id;
        const thumbnail_id = fileResponse?.data?._id;

        const body = { name: selectedSeries?.name, description: selectedSeries?.description, tailer_id, thumbnail_id };

        const result = await addSeries(body);
        const response = result?.data;
        if (response?.success) {
          fnShowSnackBar('Series added successfully!');
          setSelectedSeries({name : '', description: '', file: null}); 
          setAddModal(false);
        }

      } catch (error) {
        fnShowSnackBar('something went wrong!')
      }
    } else {
      fnShowSnackBar('required all fields!', true)
    }

  };

  const fnOnFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSeries((pre) => ({ ...pre, file }));
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    };
  };

  const fnOnChange = (e) => {
    const {name, value} = e.target;
    setSelectedSeries((pre)=> ({...pre, [name]: value}))
  };

  const fnOnModalClose =(type)=> {

    setSelectedSeries({name : '', description: '', file: null}); 
    setSelectedImage(null); 

    if(type == 'update') { setUpdateModal(false); } 
    else { setAddModal(false); }
  }

  return (
    <>
      {isLoadingAllSeries ? <Loader />
        : <ViewCrudContainer type='series' onAdd={() => setAddModal(true)}>
          {allSeries?.map((series) => {
            return (
              <ViewList>
                <p className='list'>{series?.name}</p>
                <p className='list spacing'>{series?.description}</p>
                <p className='list'>{series?.is_deleted ? 'Deleted' : 'Active'}</p>
                <div className='edit_view_box list'>
                  <p style={{ cursor: 'pointer' }} onClick={() => { setSelectedSeries(series); setUpdateModal(true) }}>Edit</p>
                  <p style={{ cursor: 'pointer' }} onClick={() => fnOnRevertDeleteView(series)}>
                    {series?.is_deleted ? <i className="ri-reset-left-line"></i> : <i className="ri-delete-bin-6-line"></i>}
                  </p>
                </div>
              </ViewList>
            )
          })}
        </ViewCrudContainer>
      }

      <Modal open={addModal} title='Add Series' onClose={fnOnModalClose}>
        <div className='inputs_container'>
          <Input inputTitle='Name' value={selectedSeries?.name} name={'name'} onChange={fnOnChange} />
          <Input inputTitle='Description' value={selectedSeries?.description} name={'description'} onChange={fnOnChange} />
          <Input inputTitle='Select File' type='file' onChange={fnOnFileChange} />
          {selectedImage && <img src={selectedImage} className='series_img' />}
        </div>
        <Button onClick={fnAddSeries} isLoading={isLoadingUploadFile || isLoadingAddSeries} style={{ width: 'fit-content' }} title={'Save'} />
      </Modal>

      <Modal open={updateModal} title='Edit Series' onClose={() => fnOnModalClose('update')}>
        {isLoadingFile ? <Loader /> :
          <>
            <div className='inputs_container'>
              <Input inputTitle='Name' value={selectedSeries?.name} name={'name'} onChange={fnOnChange} />
              <Input inputTitle='Description' value={selectedSeries?.description} name={'description'} onChange={fnOnChange} />
              <Input inputTitle='Select File' type='file' onChange={fnOnFileChange} />
              <img src={selectedImage ? selectedImage : (Config.imgUrl + file?.original_name)} className='series_img' />
            </div>

            <Button onClick={fnUpdateSeries} isLoading={isLoadingUploadFile || isLoadingUpdateSeries} style={{ width: 'fit-content' }} title={'Update'} />
          </>
        }
      </Modal>

      <DeleteModal open={deleteSeriesId} onClose={() => setDeleteSeriesId(null)}>
        <p>Are you sure to want to delete this Series ?</p>
        <Button onClick={fnDeleteSeries} title={'Delete'} isLoading={isLoadingDeleteSeries} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </>
  )
}

export default Series