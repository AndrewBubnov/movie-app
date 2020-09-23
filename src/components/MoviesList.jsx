import React from 'react';
import {inject, observer} from "mobx-react";
import List from "./List";
import {setParcedUrlSearch} from "../helpers/helpers";



const MoviesList = ({store: {setSearchString}}) => {

    setParcedUrlSearch(setSearchString);

    return (
        <List />
    )
}

export default inject('store')(observer(MoviesList));
