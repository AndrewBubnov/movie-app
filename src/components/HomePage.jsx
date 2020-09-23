import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import {debounce} from "lodash";



const HomePage = ({store: {setSearchString}}) => {
    const [search, setSearch] = useState('');
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const [isLifeSearchActive, setIsLifeSearchActive] = useState(false);
    const { push } = useHistory();

    const debouncedPush = useCallback(debounce(push, 500),[]);
    const debouncedSearch = useCallback(debounce(setSearchString, 500),[]);

    const handleChange = (e) => {
        const {target: { value }} = e;
        setSearch(value);
        isLifeSearchActive ?
            debouncedSearch(value)
            : debouncedPush(`/list?s=${value}`);
    }

    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    }

    const handleMouseUp = () => {
        if (Date.now() - mouseDownTime >= 1000) {
            setIsLifeSearchActive(prevState => !prevState);
        }
        setMouseDownTime(null);
    }

    return (
        <div className="App">
            <header className="App-header">
                <TextField
                    value={search}
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                />
            </header>
        </div>
    )
}

export default inject('store')(observer(HomePage));
