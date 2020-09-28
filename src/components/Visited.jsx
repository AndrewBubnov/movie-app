import React from 'react';
import {inject, observer} from "mobx-react";
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const Visited = ({store: {visited, setId}}) => {

    const {push} = useHistory();

    const movies = visited.map(item => (
        <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
    ))

    const handleChange = (e) => {
        setId(e.target.value);
        push(`/movie`);
    }

    const classes = useStyles();

    return (
        <>
            {!!movies.length ? (
                <FormControl className={classes.formControl}>
                    <InputLabel shrink={false} className={classes.inputLabel}>Last visited</InputLabel>
                    <Select
                        disableUnderline
                        onChange={handleChange}
                        value=''
                        inputProps={{
                            classes: {
                                root: classes.select,
                                icon: classes.icon,
                            },
                        }}
                        MenuProps={menuProps}
                    >
                        {movies}
                    </Select>
                </FormControl>
            ) : null}
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        position: 'absolute',
        left: 10,
        zIndex: 2,
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    inputLabel: {
        color: '#ffffff !important',
        pointerEvents: 'none',
        '&:focus': {
            color: '#fff',
        }
    },
    icon: {
        fill: '#fff',
    },
}));

const menuProps = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    getContentAnchorEl: null,
};

export default inject('store')(observer(Visited));
