import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotGame extends Component {
    render = () => {
        return (
            <div>
                <h3>You have left the game.</h3>
                <Link to='/'>Return to game</Link>
            </div>
        );
    }
}

export default NotGame;