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
                key={item.imdbID}
                onClick={() => handleClick(item)}
                style={{color: item.isActive ? '#fff' : '#878787'}}
            >
                {item.Title}
            </div>
        ))

    return (
        <>
            {!!moviesNumber && (
                <div>{`${moviesNumber} results found for «${search}» response:`}</div>
            )}
            <br/>
            <div
                className='list-wrapper'
                style={{justifyContent: isLoading ? 'center' : 'flex-start'}}
            >

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
            {!!moviesNumber && (
                <CustomPagination
                    handleChangePage={handleChangePage}
                    moviesNumber={moviesNumber}
                    page={page}
                />
            )}
        </>
    )
}


export default inject('store')(observer(List))


