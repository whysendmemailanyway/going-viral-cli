import React from 'react';
import {Route, Switch} from 'react-router';
import './App.css';
import GamePage from './components/GamePage';
import NotGame from './components/NotGame';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={["/", "/landing", "/game"]} component={GamePage}></Route>
        <Route path={'/notgame'} component={NotGame}></Route>
      </Switch>
    </div>
  );
}

export default App;
