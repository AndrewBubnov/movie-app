import React from 'react';
import {inject, observer} from "mobx-react";
import Pagination from '@material-ui/lab/Pagination';
import {useHistory} from 'react-router-dom';

const List = ({store: {movies, noResult, search, page, setPage, moviesNumber}}) => {

    const {push} = useHistory();

    const handleClick = (id) => {
        push(`/movie?i=${id}`)
    }

    const handleChangePage = (_, value) => {
        setPage(value);
    };

    const moviesList = movies
        .map(item => (
            <div
                key={item.imdbID}
                onClick={() => handleClick(item.imdbID)}
            >{item.Title}</div>
        ))

    return (
        <div className="App">
            {noResult ? (
                <div>No results found</div>
            ) : (
                <>
                    {!!moviesNumber && (
                        <div>{`${moviesNumber} results found for «${search}» response:`}</div>
                    )}
                    <br/>
                    <div>{moviesList}</div>
                    <br/>
                    {!!moviesNumber && (
                        <Pagination
                            count={Math.ceil(moviesNumber / 10)}
                            page={page}
                            onChange={handleChangePage}
                            style={{width: 342, margin: 'auto'}}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default inject('store')(observer(List))
