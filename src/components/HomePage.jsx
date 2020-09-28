import React from 'react';
import Arrow from "./Arrow";
import mainPoster from '../assets/img/main_poster.jpg';
import Visited from "./Visited";
import Search from "./Search";


const HomePage = () => {
    return (
        <div className="App">
            <img src={mainPoster} className='main-poster' alt=""/>
            <Visited />
            <Arrow direction='next' top={400}/>
            <div className="hero-block">
                <p className="main-title">Explore movies & series</p>
                <Search />
            </div>
        </div>
    )
}

export default HomePage;
