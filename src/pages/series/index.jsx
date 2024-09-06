import React, { useState } from 'react'
import './style.css'
import { useAddSeriesMutation, useDeleteSeriesMutation, useGetAllSeriesQuery, useGetFileQuery, useUpdateSeriesMutation, useUploadFileMutation } from '../../redux/storeApis'
import ViewCrudContainer from '../../components/Views/ViewCrudContainer';
import { useSnackBarManager } from '../../hooks/useSnackBarManager';
import Loader, { EmptyLoader } from '../../components/Loader';
import Modal, { DeleteModal } from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ViewList from '../../components/Views/ViewList';
import { Config } from '../../constants';
import { useSearchManager } from '../../hooks/useSearchManager';
import { useGetAllListManager } from '../../hooks/useGetAllListManager';
import { usePaginationManger } from '../../hooks/usePaginationManager';
import { Pagination } from 'antd';
import { DeleteIcon, RevertIcon } from '../../assets/icons';

const Series = () => {

  const { fnShowSnackBar } = useSnackBarManager();
  const { searchTxt } = useSearchManager();
  const { totalSeries } = useGetAllListManager();
  const { defaultCurrent, pageSize, pageSizeOptions, fnOnChangePagination } = usePaginationManger();

  const { data: allSeries, isLoading: isLoadingAllSeries, isFetching: isFetchingSeries } = useGetAllSeriesQuery({ search: searchTxt, page: defaultCurrent, limit: pageSize });
  const [addSeries, { isLoading: isLoadingAddSeries }] = useAddSeriesMutation();
  const [deleteSeries, { isLoading: isLoadingDeleteSeries }] = useDeleteSeriesMutation();
  const [updateSeries, { isLoading: isLoadingUpdateSeries }] = useUpdateSeriesMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const [selectedSeries, setSelectedSeries] = useState({ name: '', description: '', file: null });
  const [deleteSeriesId, setDeleteSeriesId] = useState(null);
  const [addUpdateModal, setAddUpdateModal] = useState({ state: false, type: null });

  const [selectedImage, setSelectedImage] = useState(false);

  const isAddModal = addUpdateModal.type == 'add';

  const { data: fileData, isLoading: isLoadingFile } = useGetFileQuery(selectedSeries?.thumbnail_id);

  const fnOnRevert = async (series) => {
    const id = series?._id;
    const result = await updateSeries({ _id: id, is_deleted: false });
    const response = result?.data
    if (response?.success) {
      fnShowSnackBar('Series updated successfully!')
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
        fnOnModalClose();
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
          fnOnModalClose();
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
    const { name, value } = e.target;
    setSelectedSeries((pre) => ({ ...pre, [name]: value }))
  };

  const fnOnModalClose = () => {
    setSelectedSeries({ name: '', description: '', file: null });
    setSelectedImage(null);
    setAddUpdateModal({ state : false, type : null })
  };

  return (
    <div className='view_page_container'>
      {(isLoadingAllSeries || isFetchingSeries) ? <Loader />
        : <ViewCrudContainer type='series' onAdd={() => setAddUpdateModal({state : true, type : 'add'})}>
          {
            allSeries?.length > 0 ? allSeries?.map((series) => {
              return (
                <ViewList>
                  <p className='list'>{series?.name}</p>
                  <p className='list spacing'>{series?.description}</p>
                  <p className='list'>{series?.is_deleted ? 'Deleted' : 'Active'}</p>
                  <div className='edit_view_box list'>
                    <p style={{ cursor: 'pointer' }} onClick={() => { setSelectedSeries(series); setAddUpdateModal({state : true, type :'update'}) }}>Edit</p>

                    {series?.is_deleted ? <RevertIcon onClick={() => fnOnRevert(series)} />
                      : <DeleteIcon onClick={() => setDeleteSeriesId(series?._id)} />}

                  </div>
                </ViewList>
              )
            })
              : <EmptyLoader />
          }
        </ViewCrudContainer>
      }

      {!isLoadingAllSeries && <div className='pagination_container'>
        <Pagination
          defaultCurrent={defaultCurrent}
          showSizeChanger
          total={totalSeries}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          onChange={fnOnChangePagination}
        />
      </div>}

      <Modal open={addUpdateModal.state} title={(isAddModal ? 'Add' : 'Update') + ' Series'} onClose={fnOnModalClose}>
        <div className='inputs_container'>
          <Input inputTitle='Name' value={selectedSeries?.name} name={'name'} onChange={fnOnChange} />
          <Input inputTitle='Description' value={selectedSeries?.description} name={'description'} onChange={fnOnChange} />
          <Input inputTitle='Select File' type='file' onChange={fnOnFileChange} />
          {isAddModal ? selectedImage && <img src={selectedImage} className='series_img' />
            : <img src={selectedImage ? selectedImage : (Config.imgUrl + fileData?.original_name)} className='series_img' />
          }
        </div>
        <Button onClick={()=> { isAddModal ? fnAddSeries() : fnUpdateSeries()}} isLoading={isLoadingUploadFile || isLoadingAddSeries} style={{ width: 'fit-content' }} title={'Save'} />
      </Modal>

      {/* <Modal open={updateModal} title='Edit Series' onClose={() => fnOnModalClose('update')}>
        <div className='inputs_container'>
          <Input inputTitle='Name' value={selectedSeries?.name} name={'name'} onChange={fnOnChange} />
          <Input inputTitle='Description' value={selectedSeries?.description} name={'description'} onChange={fnOnChange} />
          <Input inputTitle='Select File' type='file' onChange={fnOnFileChange} />
          <img src={selectedImage ? selectedImage : (Config.imgUrl + fileData?.original_name)} className='series_img' />
        </div>
        <Button onClick={fnUpdateSeries} isLoading={isLoadingUploadFile || isLoadingUpdateSeries} style={{ width: 'fit-content' }} title={'Update'} />
      </Modal> */}

      <DeleteModal open={deleteSeriesId} onClose={() => setDeleteSeriesId(null)}>
        <p>Are you sure to want to delete this Series ?</p>
        <Button onClick={fnDeleteSeries} title={'Delete'} isLoading={isLoadingDeleteSeries} style={{ width: 'fit-content', backgroundColor: '#c53030', minWidth: '120px' }} />
      </DeleteModal>

    </div>
  )
}

export default Series