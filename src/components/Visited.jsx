import React from 'react';
import {inject, observer} from "mobx-react";
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import {withStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';



const Visited = ({store: {visited, setId, removeVisited}}) => {

    const {push} = useHistory();

    const handleDelete = (e, id) => {
        e.stopPropagation()
        removeVisited(id)
    }

    const movies = visited.map(item => (
        <MenuItem
            key={item.id}
            value={item.id}
        >
            <CustomTooltip title={item.plot}>
                <div className='flex-container'>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography>
                                <span className='flex-container'>
                                    <span>
                                        {item.title}
                                    </span>
                                    <span className='movie-type'>
                                        <span>
                                            <span>{item.type}</span>
                                            <span>{item.year}</span>
                                        </span>
                                    </span>
                                </span>
                            </Typography>
                        }
                    />
                    <ClearIcon
                        style={style}
                        onClick={(e) => handleDelete(e, item.id)}/>
                </div>
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

const CustomTooltip = ({title, children}) =>
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

const style = {
    height: 15,
    marginLeft: 5,
    color: 'steelblue',
}

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
