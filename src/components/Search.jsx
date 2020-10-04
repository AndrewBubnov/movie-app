import React, {useCallback, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {debounce} from "lodash";


const Search = ({store: {setSearchString, isInstantSearchActive, toggleInstantSearch}}) => {
    const text = JSON.parse(localStorage.getItem('search'))
        && JSON.parse(localStorage.getItem('search')).text;
    const [search, setSearch] = useState(text || '');
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const {push} = useHistory();
    const {pathname} = useLocation();

    const debouncedSearch = useCallback(debounce(setSearchString, 500), []);

    const handleChange = (e) => {
        const {target: {value}} = e;
        setSearch(value);
        if (isInstantSearchActive) {
            debouncedSearch(value)
        }
    }

    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    }

    const handleMouseUp = () => {
        if (Date.now() - mouseDownTime >= 300) {
            toggleInstantSearch();
            setSearchString(search);
        }
        setMouseDownTime(null);
    }

    const handleSearchPress = () => {
        setSearchString(search);
        if (search && pathname === '/') {
            push(`/list`)
        }
    }

    const handleKeyUp = (e) => {
        if (e.keyCode === 13 && !isInstantSearchActive) {
            handleSearchPress();
        }
    }

    return (
        <TextField
            value={search}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onKeyUp={handleKeyUp}
            variant="outlined"
            placeholder='Search..'
            style={{
                backgroundColor: "#fff",
                borderRadius: 5,
                width: 540,
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                            <IconButton
                                onClick={handleSearchPress}
                            >
                                {isInstantSearchActive ? (
                                    <FlashOnIcon />
                                ) : (
                                    <SearchIcon/>
                                )}
                            </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default inject('store')(observer(Search));
