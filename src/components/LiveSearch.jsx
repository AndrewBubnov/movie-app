import React from 'react';
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";

const LiveSearch = ({store: {filterString, setFilterString}}) => {
    const handleSearch = (e) => {
        e.persist()
        setFilterString(e.target.value)
    }
    return (
        <TextField
            value={filterString}
            onChange={handleSearch}
            variant="outlined"
            placeholder='Search in results'
            style={{
                backgroundColor: "#fff",
                borderRadius: 5,
                width: 540,
            }}
        />
    )
}

export default inject('store')(observer(LiveSearch));
