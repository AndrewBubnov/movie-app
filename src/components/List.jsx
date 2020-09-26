import React from 'react';
import {inject, observer} from "mobx-react";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router-dom';
import CustomPagination from "./CustomPagination";

const List = ({store: {movies, error, search, page, setPage, moviesNumber, isLoading, setId}}) => {

    const {push} = useHistory();

    const handleClick = (id) => {
        setId(id);
        push(`/movie`)
    }

    const handleChangePage = (_, value) => {
        setPage(value);
    };

    const moviesList = movies
        .map(item => (
            <div
                key={item.imdbID}
                onClick={() => handleClick(item.imdbID)}
            >
                {item.Title}
            </div>
        ))

    return (
        <div className="App">
            <div
                className='list-wrapper'
                style={{justifyContent: isLoading ? 'center' : 'space-between'}}
            >
            { isLoading ? (
                <CircularProgress style={{color: '#878787'}}/>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <>
                    {!!moviesNumber && (
                        <div>{`${moviesNumber} results found for «${search}» response:`}</div>
                    )}
                    <br/>
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
        </div>
    )
}


export default inject('store')(observer(List))


