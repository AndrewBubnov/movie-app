import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import {makeStyles} from "@material-ui/core/styles";


const CustomPagination = ({moviesNumber, page, handleChangePage}) => {

    const classes = useStyles();

    return (
        <Pagination
            count={Math.ceil(moviesNumber / 10)}
            page={page}
            onChange={handleChangePage}
            style={{display: 'flex', justifyContent: 'center'}}
            renderItem={(item) => (
                <PaginationItem
                    {...item}
                    classes={{
                        root: classes.root,
                    }}
                />
            )}
        />
    )
}

const useStyles = makeStyles({
    root: {
        color: '#878787',
        '&.Mui-selected': {
            background: '#8787878c'
        },
    },
});


export default CustomPagination;
