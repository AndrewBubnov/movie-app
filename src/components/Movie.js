import React, { useEffect } from 'react';
import {inject, observer} from "mobx-react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Arrow from "./Arrow";

const Movie = ({store: {movie, setMovieId}}) => {

    useEffect(setMovieId, []);
        console.log(movie)

    return (
        <div className="App">
            { movie ? (
                <>
                    <Arrow direction='previous'/>
                    <div className="movie">
                        <div className='movie-block'>
                            <img
                                src={movie.Poster}
                                className='poster'
                                alt='poster'
                            />
                            {parseFloat(movie.imdbRating) ? (
                                <>
                                    <div className='movie-title'>IMDB Rating:</div>
                                    <span className='movie-title'>{movie.imdbRating}/</span>
                                    <span className='imdb'>10</span>
                                </>
                            ) : null}
                        </div>
                        <div className='movie-block'>
                            <div className='movie-title'>{movie.Title}</div>
                            <div className="movie-details">
                                <p>Runtime: <strong>{movie.Runtime}</strong></p>
                                <p>Genre: <strong>{movie.Genre}</strong></p>
                                <p>Year: <strong>{movie.Year}</strong></p>
                                <p>Type: <strong>{movie.Type}</strong></p>
                                <p className='plot'>{movie.Plot}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <CircularProgress style={{color: '#878787', marginTop: 200}}/>
            )}
        </div>
    )
}

export default inject('store')(observer(Movie));
