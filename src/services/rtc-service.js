const SocketsService = require('./sockets-service');
const {API_ENDPOINT} = require('../config');

let peerConnection;

module.exports = {
    createCall: (successCallback) => {
        SocketsService.open();
        fetch(`${API_ENDPOINT}/debug`, {
            method: "POST"
        })
        .then((res) => {
            console.log("Posted to server.");
            SocketsService.send('call');
            return res.json();
        })
        .then(iceConfiguration => {
            console.log(iceConfiguration);
            let peerConnection = new RTCPeerConnection(iceConfiguration);
            peerConnection.createOffer().then((offer) => {
                console.log("Created offer");
                peerConnection.setLocalDescription(offer)
                .then(() => {
                    console.log("Set local description to new offer.");
                    SocketsService.send('offer', {offer, configuration: iceConfiguration});
                })
            });
            SocketsService.addListener('answer', (socket, data) => {
                console.log("Got answer");
                peerConnection.setRemoteDescription(new RTCSessionDescription(data.rtcSessionDescription));
            });
            // Listen for connectionstatechange on the local RTCPeerConnection
            peerConnection.addEventListener('connectionstatechange', event => {
                if (peerConnection.connectionState === 'connected') {
                    console.log("Peers connected!");
                    successCallback(peerConnection);
                }
            });
    
            peerConnection.addEventListener('icecandidate', event => {
                if (event.candidate) {
                    SocketsService.send('new-ice-candidate', {iceCandidate: event.candidate});
                }
            });
            // Listen for remote ICE candidates and add them to the local RTCPeerConnection
            SocketsService.addListener('new-ice-candidate', data => {
                if (data.iceCandidate) {
                    try {
                        peerConnection.addIceCandidate(data.iceCandidate)
                        .then(() => {
                            console.log("Added ice candidate!");
                        });
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                }
            });
        });
    },
    joinCall: (successCallback) => {
        SocketsService.open();
        SocketsService.addListener('offer', data => {
            peerConnection = new RTCPeerConnection(data.configuration);
            peerConnection.setRemoteDescription(data.offer);
            peerConnection.createAnswer()
            .then((answer) => {
                peerConnection.setLocalDescription(answer)
                .then(() => {
                    console.log("Sending answer");
                    SocketsService.send('answer', {rtcSessionDescription: answer});
                    // Listen for local ICE candidates on the local RTCPeerConnection
                    peerConnection.addEventListener('icecandidate', event => {
                        if (event.candidate) {
                            SocketsService.send('new-ice-candidate', {iceCandidate: event.candidate});
                        }
                    });
                    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
                    SocketsService.addEventListener('new-ice-candidate', data => {
                        if (data.iceCandidate) {
                            try {
                                peerConnection.addIceCandidate(data.iceCandidate)
                                .then(() => {
                                    console.log("Added ice candidate!");
                                });
                            } catch (e) {
                                console.error('Error adding received ice candidate', e);
                            }
                        }
                    });

                    // Listen for connectionstatechange on the local RTCPeerConnection
                    peerConnection.addEventListener('connectionstatechange', event => {
                        if (peerConnection.connectionState === 'connected') {
                            console.log("Peers connected!");
                            successCallback(peerConnection);
                        }
                    });
                });
            })
        });
        fetch(`${API_ENDPOINT}/debug`, {
            method: "POST"
        })
        .then((res) => {
            console.log("Posted to server.");
            console.log(res);
            SocketsService.send('call');
        });
    },
    endCall: () => {
        SocketsService.close();
        if (peerConnection) {
            peerConnection.close();
            peerConnection = undefined;
        }
    }
}