import React, {Component} from 'react';
import io from 'socket.io-client';
import {API_ENDPOINT} from '../config';
import {Link} from 'react-router-dom';

class GamePage extends Component {
    // constructor () {
    //     this.socket;
    // }

    componentDidMount = () => {
        this.socket = io.connect(API_ENDPOINT);
    }

    componentWillUnmount = () => {
        if (this.socket) this.socket.disconnect();
    }

    render = () => {
        return (
            <div>
                <h3>I am a placeholder. insert game here.</h3>
                <Link to='/notgame'>Leave game</Link>
            </div>
        );
    }
}

export default GamePage;