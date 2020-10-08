import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import arrowNext from '../assets/img/Arrow-next.svg';
import arrowPrev from '../assets/img/Arrow-prev.svg';

const routes = {
    '0': '/',
    '1': '/list',
    '2': '/movie',
};

const Arrow = ({direction}) => {
    const {pathname} = useLocation();
    const {push} = useHistory();
    const routeKey = Object.keys(routes).find(key => routes[key] === pathname);
    const nextRoute = direction === 'next' && routeKey < 2 ?
        routes[Number(routeKey) + 1]
        : direction === 'previous' && routeKey > 0 ?
            routes[Number(routeKey) - 1]
            : undefined

    const handleClick = () => {
        if (nextRoute) {
            push(nextRoute)
        }
    }

    const search = JSON.parse(localStorage.getItem('search'));
    const id = JSON.parse(localStorage.getItem('id'));

    return (
        <div onClick={handleClick}>
            {direction === 'next' ?
                (pathname === routes[0] && search && search.text)
                || (pathname === routes[1] && id && id.value) ?
                    (
                        <img src={arrowNext} className='arrow next-arrow' alt=""/>
                    ) : null
                : (
                    <img src={arrowPrev} className='arrow previous-arrow' alt=""/>
                )}
        </div>
    )
}

export default Arrow;
