import React from 'react';
import {inject, observer} from "mobx-react";
import List from "./List";



const MoviesList = ({store: {setSearchString}}) => {

    return (
        <List />
    )
}

export default inject('store')(observer(MoviesList));
