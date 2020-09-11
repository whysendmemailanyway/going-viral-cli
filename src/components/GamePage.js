import React, {Component} from 'react';
// import io from 'socket.io-client';
// import streamer from 'socket.io-stream';
// import {API_ENDPOINT} from '../config';
import {Link} from 'react-router-dom';
import RTCService from '../services/rtc-service';

class GamePage extends Component {
    constructor (props) {
        super(props);
        this.audio = new Audio();
    }

    componentDidMount = () => {
        RTCService.createCall((peerConnection) => {
            navigator.mediaDevices.getUserMedia({audio: true})
            .then((userStream) => {
                console.log(userStream);
                const remoteStream = MediaStream();
                peerConnection.addEventListener('track', (event) => {
                    remoteStream.addTrack(event.track, remoteStream);
                });
                this.audio.srcObject = remoteStream;
                userStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, userStream);
                });
            })
            .catch((err) => {
                console.error(err);
                this.props.history.push('/notgame');
            });
        })
        // this.socket = io.connect(API_ENDPOINT);
        // navigator.mediaDevices.getUserMedia({audio: true})
        // .then((userStream) => {
        //     console.log(userStream);
        //     let outStream = streamer.createStream();
        //     let audioStream = new MediaStream();
        //     streamer(this.socket).emit('audio-data', outStream, userStream);
        //     streamer(this.socket).on('audio-data', (inStream, data) => {
        //         inStream.pipe(audioStream);
        //     });
        //     this.audio.srcObject = audioStream;
        //     this.userInput = userStream;
        // })
        // .catch((err) => {
        //     console.error(err);
        //     this.props.history.push('/notgame');
        // });
        // this.socket.on('audio-data', (stream, data) => {
        //     new Audio().srcObject = stream;
        // })
    }

    componentWillUnmount = () => {
        // if (this.socket) this.socket.disconnect();
        RTCService.endCall();
        // if (this.userInput) {
        //     this.userInput.getAudioTracks().forEach(track => track.stop());
        //     this.userInput = undefined;
        // }
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