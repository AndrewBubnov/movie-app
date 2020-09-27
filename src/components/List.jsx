import React from 'react';
import {inject, observer} from "mobx-react";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router-dom';
import CustomPagination from "./CustomPagination";

const List = ({
                  store: {
                      movies,
                      setActiveMovie,
                      error,
                      search,
                      page,
                      setPage,
                      moviesNumber,
                      isLoading,
                      setId
                  }
              }) => {

    const {push} = useHistory();

    const handleClick = (item) => {
        if (item.isActive) {
            setId(item.imdbID);
            push(`/movie`);
        } else {
            setActiveMovie(item.imdbID)
        }
    }

    const handleChangePage = (_, value) => {
        setPage(value);
    };


    const moviesList = movies
        .map(item => (
            <div
                className='list-item'
                key={item.imdbID}
                onClick={() => handleClick(item)}
                style={{color: item.isActive ? '#fff' : '#878787'}}
            >
                <div className='list-item-title'>{item.Title}</div>
                <div className='list-item-details-wrapper'>
                    <div>{item.Year}</div>
                    <div>{item.Type}</div>
                </div>
            </div>
        ))

    return (
        <>
            {!!moviesNumber && (
                <div>{`${moviesNumber} results found for «${search}» response:`}</div>
            )}
            <br/>
            {moviesNumber > 10 && (
                <CustomPagination
                    handleChangePage={handleChangePage}
                    moviesNumber={moviesNumber}
                    page={page}
                />
            )}
            <br />
            <div className='list-wrapper'>
                {isLoading ? (
                    <CircularProgress style={{color: '#878787'}}/>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <>
                        {moviesList}
                        <br/>
                    </>
                )}
            </div>
        </>
    )
}


export default inject('store')(observer(List))


