import React from 'react'
import './style.css'
import { useGetAllGenreQuery } from '../../redux/storeApis'
import Loader from '../../components/Loader';

const Genre = () => {
  const { data: allGenres, isLoading: isLoadingAllGenres } = useGetAllGenreQuery();
  return (
    <>
      {isLoadingAllGenres ? <Loader /> :
        <div>
          {
            allGenres?.map((genre)=>{
              return (
                <div>
                  {genre?.name}
                </div>
              )
            })
          }
        </div>}
    </>
  )
}

export default Genre