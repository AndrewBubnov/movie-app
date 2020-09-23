import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import {debounce} from "lodash";



const HomePage = ({store: {setSearchString}}) => {
    const [search, setSearch] = useState('');
    const { push } = useHistory();

    const debouncedPush = useCallback(debounce(push, 500),[]);

    const handleChange = (e) => {
        const {target: { value }} = e;
        setSearch(value);
        debouncedPush(`/list?s=${value}`)
    }
    return (
        <div className="App">
            <header className="App-header">
                <TextField
                    value={search}
                    onChange={handleChange}
                />
            </header>
        </div>
    )
}

export default inject('store')(observer(HomePage));
