import React from 'react';
import List from "./List";
import Arrow from "./Arrow";
import mainPoster from "../assets/img/main_poster.jpg";
import LiveSearch from "./LiveSearch";


const MoviesList = () => {
    return (
        <div className="App">
            <img src={mainPoster} className='main-poster' alt=""/>
            <Arrow direction='previous' />
            <Arrow direction='next' />
            <div className="hero-block movie-list">
                <LiveSearch/>
                <List/>
            </div>
        </div>
    )
}

export default MoviesList;
