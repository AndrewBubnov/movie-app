import React from 'react';
import {inject, observer} from "mobx-react";
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from "react-player"
import Arrow from "./Arrow";

const Movie = ({store: {movie, isLoading}}) => {
    // if (!movie) {
    //     return <div className='main-title'>Movie not found</div>
    // }
    // const {Title, Plot, Runtime, Genre, Type, Year, Poster, imdbRating} = movie;

    return (
        <div className="App">
            {isLoading ? (
                <CircularProgress style={{color: '#878787'}}/>
            ) : movie ? (
                <>
                    <Arrow direction='previous' top={300}/>
                    {/*<ReactPlayer style={{margin: 'auto'}} url='https://www.youtube.com/watch?v=T6DJcgm3wNY' />*/}
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
                <div className='main-title'>Movie not found</div>
            )}

        </div>
    )
}

export default inject('store')(observer(Movie));
