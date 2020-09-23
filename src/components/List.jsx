import React from 'react';
import {inject, observer} from "mobx-react";

const List = ({store: {movies, noResult}}) => {

    const moviesList = movies.map(item => (
        <div key={item.imdbID}>{item.Title}</div>
    ))
    return (
        <div>
            {noResult ? (
                <div>No results found</div>
            ) : (
                <div>{moviesList}</div>
            )}
        </div>
    )
}

export default inject('store')(observer(List))
