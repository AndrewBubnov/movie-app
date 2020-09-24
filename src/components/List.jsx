import React, {useState} from 'react';
import {inject, observer} from "mobx-react";
import Pagination from '@material-ui/lab/Pagination';
import {useHistory} from 'react-router-dom';

const List = ({store: {movies, noResult, search}}) => {
    const [page, setPage] = useState(1);
    const {push} = useHistory();

    const handleClick = (id) => {
        push(`/movie?i=${id}`)
    }

    const handleChangePage = (_, value) => {
        setPage(value);
    };

    const moviesList = movies
        .slice((page - 1) * 10, page * 10)
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
                    {!!movies.length && (
                        <div>{`${movies.length} results found for «${search}» response:`}</div>
                    )}
                    <br/>
                    <div>{moviesList}</div>
                    <br/>
                    {!!movies.length && (
                        <Pagination
                            count={Math.ceil(movies.length / 10)}
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
