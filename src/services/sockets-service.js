//import {API_ENDPOINT} from '../config';
const {API_ENDPOINT} = require('../config');

const socket = require('socket.io-client')(API_ENDPOINT);

let listeners = {};

const callListeners = (event, data) => {
    listeners[event].forEach(callback => callback(data));
}

const messageTypes = ['call', 'offer'];

messageTypes.forEach(messageType => {
    socket.on(messageType, (data) => {
        callListeners(messageType, socket, data);
    })
})

module.exports = {
    addListener: (event, callback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    },
    send: (event, data) => {
        socket.emit(event, data);
    },
    close: () => socket.close(),
    open: () => socket.open()
}