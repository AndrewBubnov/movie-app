import React, { useState, useCallback } from 'react';
import {inject, observer} from "mobx-react";
import TextField from '@material-ui/core/TextField';
import { debounce } from 'lodash';
import './App.css';


function App({store: {setSearchString}}) {
const [search, setSearch] = useState('');

const debouncedCall = useCallback(debounce(setSearchString, 500),[]);

const handleChange = (e) => {
    const {target: { value }} = e;
    setSearch(value)
    debouncedCall(value)
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
  );
}

export default inject('store')(observer(App))
