import React from 'react';
import {inject, observer} from "mobx-react";
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography';
import {toJS} from "mobx";


const Visited = ({store: {visited, setId}}) => {

    const {push} = useHistory();

    const movies = visited.map(item => (
        <MenuItem
            key={item.id}
            value={item.id}
        >
            <CustomTooltip title={item.plot}>
                <ListItemText
                    disableTypography
                    primary={
                        <Typography>{item.title}</Typography>
                    }
                />
            </CustomTooltip>
        </MenuItem>
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

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const CustomTooltip = ({ title, children }) =>
    <LightTooltip title={title}>{children}</LightTooltip>;

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
