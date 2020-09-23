import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import HomePage from "./components/HomePage";
import './App.css';
import MoviesList from "./components/MoviesList";



function App() {
  return (
      <Router basename={`/`}>
          <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/list" component={MoviesList} />
          </Switch>
      </Router>
  );
}

export default App;
