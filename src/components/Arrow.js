import React from 'react';
import {inject, observer} from "mobx-react";
import {useHistory, useLocation} from 'react-router-dom';
import arrowNext from '../assets/img/Arrow-next.svg';
import arrowPrev from '../assets/img/Arrow-prev.svg';

const routes = {
    '0': '/',
    '1': '/list',
    '2': '/movie',
};

const Arrow = ({store: {search, id}, direction, top}) => {
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

    return (
        <div onClick={handleClick}>
            {direction === 'next' ?
                (pathname === routes[0] && search) || (pathname === routes[1] && id) ? (
                    <img src={arrowNext} className='arrow next-arrow' style={{top}} alt=""/>
                ) : null
                : (
                    <img src={arrowPrev} className='arrow previous-arrow' style={{top}} alt=""/>
                )}
        </div>
    )
}

export default inject('store')(observer(Arrow))
