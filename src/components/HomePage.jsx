import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {debounce} from "lodash";
import List from "./List";
import Arrow from "./Arrow";
import mainPoster from '../assets/img/main_poster.jpg'


const HomePage = ({store: {setSearchString}}) => {
    const [search, setSearch] = useState(localStorage.getItem('search') || '');
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const [isLiveSearchActive, setIsLiveSearchActive] = useState(false);
    const {push} = useHistory();

    const debouncedSearch = useCallback(debounce(setSearchString, 500), []);

    const handleChange = (e) => {
        const {target: {value}} = e;
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
            setSearchString(search);
        }
        setMouseDownTime(null);
    }

    const handleSearchPress = () => {
        setSearchString(search);
        push(`/list`);
    }

    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleSearchPress();
        }
    }

    const liveSearchAnnounce = `long tap to activate/deactivate live search: ${isLiveSearchActive ?
        'live search enabled'
        : 'live search disabled'}`

    return (
        <div className="App">
            <img src={mainPoster} className='main-poster' alt=""/>
                <Arrow direction='next' top={400}/>
            <div className="hero-block">
                <p className="main-title">Explore movies & series</p>
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
                                {!isLiveSearchActive && (
                                    <IconButton
                                        onClick={handleSearchPress}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
                <p className='life-search-title'>{liveSearchAnnounce}</p>
                {isLiveSearchActive && (
                        <List/>
                )}
            </div>
        </div>
    )
}

export default inject('store')(observer(HomePage));
