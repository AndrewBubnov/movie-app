import React from 'react';
import {inject, observer} from "mobx-react";

const List = ({store: {movies, noResult}}) => {

    const moviesList = movies.map(item => (
        <div key={item.imdbID}>{item.Title}</div>
    ))
    return (
        <div className="App">
            {noResult ? (
                <div>No results found</div>
            ) : (
                <>
                    {!!movies.length && (
                        <div>{`${movies.length} results found`}</div>
                    )}
                    <br/>
                    <div>{moviesList}</div>
                </>
            )}
        </div>
    )
}

export default inject('store')(observer(List))
