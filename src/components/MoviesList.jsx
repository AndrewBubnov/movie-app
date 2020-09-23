import React from 'react';
import {inject, observer} from "mobx-react";



const MoviesList = ({store: {setSearchString}}) => {
    const searchString = new URL(window.location.href).searchParams.get('s');
    setSearchString(searchString);
    return (
        <div>MoviesList</div>
    )
}

export default inject('store')(observer(MoviesList));
