import React from 'react';
import {inject, observer} from "mobx-react";

const Movie = ({store: { setMovieId }}) => {
    const id = new URL(window.location.href).searchParams.get('i');
    setMovieId(id);
    return (
        <div className="App">Movie</div>
    )
}

export default inject('store')(observer(Movie));
