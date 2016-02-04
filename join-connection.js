'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function createJoinConnection() {
	var servers = null;

	localConnection = new RTCPeerConnection(servers);

	localConnection.onicecandidate = iceCallback1;

	// Wait for offer from HOST
	
}