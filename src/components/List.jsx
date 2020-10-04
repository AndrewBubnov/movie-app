import React, { useEffect, useRef } from 'react';
import { inject, observer } from "mobx-react";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router-dom';
import CustomPagination from "./CustomPagination";

const List = ({
                  store: {
                      filtered,
                      filterString,
                      setActiveMovie,
                      error,
                      search,
                      setPage,
                      moviesNumber,
                      isLoading,
                      setId,
                      setPageIncrement,
                      setSearch,
                  }
              }) => {

    useEffect(setSearch, []);

    const {push} = useHistory();

    const {text, page} = search;

    const handleClick = (item) => {
        if (item.isActive) {
            setId(item.imdbID);
            push(`/movie`);
        } else {
            setActiveMovie(item.imdbID)
        }
    }

    const handleChangePage = (_, value) => {
        setPage(value);
    };

    const observer = useRef();

    const lastMovieRef = node => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < Math.ceil(moviesNumber / 10)) {
                setPageIncrement()
            }
        })
        if (node) observer.current.observe(node)
    }

    const moviesList = filtered
        .map((item, index) => {
            if (index === filtered.length - 1 && !filterString) {
                return (
                    <div
                        className='list-item'
                        ref={lastMovieRef}
                        key={item.imdbID}
                        onClick={() => handleClick(item)}
                        style={{color: item.isActive ? '#fff' : '#878787'}}
                    >
                        <div className='list-item-title'>{item.Title}</div>
                        <div className='list-item-details-wrapper'>
                            <div>{item.Year}</div>
                            <div>{item.Type}</div>
                        </div>
                    </div>
                )
            }
            return (
                <div
                    className='list-item'
                    key={item.imdbID}
                    onClick={() => handleClick(item)}
                    style={{color: item.isActive ? '#fff' : '#878787'}}
                >
                    <div className='list-item-title'>{item.Title}</div>
                    <div className='list-item-details-wrapper'>
                        <div>{item.Year}</div>
                        <div>{item.Type}</div>
                    </div>
                </div>
            )
        })

    return (
        <>
            {!!moviesNumber && (
                <div>{`${moviesNumber} results found for «${text}» response:`}</div>
            )}
            <br/>
            {moviesNumber > 10 && (
                <CustomPagination
                    handleChangePage={handleChangePage}
                    moviesNumber={moviesNumber}
                    page={page}
                />
            )}
            <br/>
            <div className='list-wrapper'>
                {error ? (
                    <div>{error}</div>
                ) : (
                    <>
                        {moviesList}
                        <br/>
                    </>
                )}
                {isLoading && (
                    <CircularProgress style={{color: '#878787'}}/>
                )}
            </div>
        </>
    )
}


export default inject('store')(observer(List))


