import React from 'react';
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";

const Movie = ({store: { movie }}) => {
    const poster = movie && movie.Poster;
    console.log(toJS(movie));
    return (
        <div className="App">
            <img
                src={poster}
                style={{height: '100vh', objectFit: 'cover'}}
                alt='poster'
            />
        </div>
    )
}

export default inject('store')(observer(Movie));
