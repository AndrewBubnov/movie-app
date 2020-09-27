import React from 'react';
import List from "./List";
import Arrow from "./Arrow";


const MoviesList = () => {
    return (
        <div className="App">
            <Arrow direction='previous' top={400} />
            <Arrow direction='next' top={400} />
            <List/>
        </div>
    )
}

export default MoviesList;
