import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {debounce} from "lodash";
import List from "./List";
import {setParcedUrlSearch} from "../helpers/helpers";



const HomePage = ({store: {setSearchString}}) => {
    const [search, setSearch] = useState('');
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const [isLiveSearchActive, setIsLiveSearchActive] = useState(false);
    const { push } = useHistory();

    const debouncedSearch = useCallback(debounce(setSearchString, 500),[]);

    if (!isLiveSearchActive) {
        setParcedUrlSearch(setSearchString);
    }

    const handleChange = (e) => {
        const {target: { value }} = e;
        setSearch(value);
        if (isLiveSearchActive) {
            debouncedSearch(value)
        }
    }

    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    }

    const handleMouseUp = () => {
        if (Date.now() - mouseDownTime >= 300) {
            setIsLiveSearchActive(prevState => !prevState);
        }
        setMouseDownTime(null);
    }

    const handleSearchPress = () => {
        push(`/list?s=${search}`);
    }

    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleSearchPress();
        }
    }

    return (
        <div className="App">
                <p>Long tap to switch search and live search</p>
                <TextField
                    value={search}
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onKeyUp={handleKeyUp}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {!isLiveSearchActive && (
                                    <IconButton
                                        onClick={handleSearchPress}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            {isLiveSearchActive ? (
                <p>Live search enabled</p>
            ) : (
                <p>Live search disabled</p>
            )}
            <List />
        </div>
    )
}

export default inject('store')(observer(HomePage));
