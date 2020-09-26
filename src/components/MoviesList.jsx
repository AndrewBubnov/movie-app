import React from 'react';
import {inject, observer} from "mobx-react";
import List from "./List";
import Arrow from "./Arrow";



const MoviesList = ({store: {setSearchString}}) => {
    return (
        <div className="App">
            <List />
            <div className='arrows-wrapper two-arrow'>
                <Arrow direction='previous' />
                <Arrow direction='next' />
            </div>
        </div>
    )
}

export default inject('store')(observer(MoviesList));
