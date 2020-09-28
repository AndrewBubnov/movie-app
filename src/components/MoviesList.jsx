import React from 'react';
import List from "./List";
import Arrow from "./Arrow";
import mainPoster from "../assets/img/main_poster.jpg";
import Search from "./Search";


const MoviesList = () => {
    return (
        <div className="App">
            <img src={mainPoster} className='main-poster' alt=""/>
            <Arrow direction='previous' top={400}/>
            <Arrow direction='next' top={400}/>
            <div className="hero-block movie-list">
                <Search/>
                <List/>
            </div>
        </div>
    )
}

export default MoviesList;
