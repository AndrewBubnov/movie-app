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
    const [isLifeSearchActive, setIsLifeSearchActive] = useState(false);
    const { push } = useHistory();

    const debouncedSearch = useCallback(debounce(setSearchString, 500),[]);

    setParcedUrlSearch(setSearchString);

    const handleChange = (e) => {
        const {target: { value }} = e;
        setSearch(value);
        if (isLifeSearchActive) {
            debouncedSearch(value)
        }
    }

    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    }

    const handleMouseUp = () => {
        if (Date.now() - mouseDownTime >= 300) {
            setIsLifeSearchActive(prevState => !prevState);
        }
        setMouseDownTime(null);
    }

    const handleSearch = () => {
        push(`/list?s=${search}`);
    }

    return (
        <div className="App">
                <p>Long tap to switch search and life search</p>
                <TextField
                    value={search}
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {!isLifeSearchActive && (
                                    <IconButton
                                        // className={classes.eye}
                                        onClick={handleSearch}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            {isLifeSearchActive ? (
                <p>Life search enabled</p>
            ) : (
                <p>Life search disabled</p>
            )}
            <List />
        </div>
    )
}

export default inject('store')(observer(HomePage));
