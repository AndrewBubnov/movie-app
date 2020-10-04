import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import HomePage from "./components/HomePage";
import MoviesList from "./components/MoviesList";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Movie from "./components/Movie";


function App() {
    return (
        <Router basename={`/`}>
            <Route render={({location}) => (
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        timeout={700}
                        classNames="fade"
                    >
                        <Switch location={location}>
                            <Route exact path="/" component={HomePage}/>
                            <Route exact path="/list" component={MoviesList}/>
                            <Route exact path="/movie" component={Movie}/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            )}/>

        </Router>
    );
}

export default App;
