import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import HomePage from "./components/HomePage";
import MoviesList from "./components/MoviesList";
import './App.css';


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
