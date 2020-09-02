import React from 'react';
import {Route} from 'react-router';
import './App.css';
import GamePage from './components/GamePage';

function App() {
  return (
    <div className="App">
      <Route path={["/", "/landing", "/game"]} component={GamePage}></Route>
    </div>
  );
}

export default App;
