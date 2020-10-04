import React from 'react';
import {inject, observer} from "mobx-react";
import Arrow from "./Arrow";
import mainPoster from '../assets/img/main_poster.jpg';
import Visited from "./Visited";
import Search from "./Search";
import List from "./List";


const HomePage = ({store: {isLiveSearchActive}}) => {
    return (
        <div className="App">
            <img src={mainPoster} className='main-poster' alt=""/>
            <Visited/>
            <Arrow direction='next'/>
            <div className="hero-block">
                <p className="main-title">Explore movies & series</p>
                <Search/>
                {isLiveSearchActive && (
                    <List/>
                )}
            </div>
        </div>
    )
}

export default inject('store')(observer(HomePage));
