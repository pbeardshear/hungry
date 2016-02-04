// WebRTC p2p data transfer

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

function createConnection() {
	// Google STUN server: stun.l.google.com:19302
	var servers = null;

	localConnection = new RTCPeerConnection(servers);

	sendChannel = localConnection.createDataChannel('sendDataChannel', null);
	// sendChannel.binaryType = 'arraybuffer';

	sendChannel.onopen = onSendChannelStateChange;
	sendChannel.onclose = onSendChannelStateChange;


	localConnection.onicecandidate = iceCallback1;

	// remoteConnection = new RTCPeerConnection(servers);
	// remoteConnection.onicecandidate = iceCallback2;
	// remoteConnection.ondatachannel = receiveChannelCallback;

	localConnection.createOffer(function (offer) {
		localConnection.setLocalDescription(offer);
	}, onCreateSessionDescriptionError);
}

function sendData() {
  var data = dataChannelSend.value;
  sendChannel.send(data);
  trace('Sent Data: ' + data);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}


// function gotDescription1(desc) {
// 	localConnection.setLocalDescription(desc);
// 	trace('Offer from localConnection \n' + desc.sdp);
// 	// remoteConnection.setRemoteDescription(desc);
// 	// remoteConnection.createAnswer(gotDescription2, onCreateSessionDescriptionError);
// }

// function gotDescription2(desc) {
// 	remoteConnection.setLocalDescription(desc);
// 	trace('Answer from remoteConnection \n' + desc.sdp);
// 	localConnection.setRemoteDescription(desc);
// }


function iceCallback1(event) {
  trace('local ice callback');
  if (event.candidate) {
    remoteConnection.addIceCandidate(event.candidate,
        onAddIceCandidateSuccess, onAddIceCandidateError);
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function iceCallback2(event) {
  trace('remote ice callback');
  if (event.candidate) {
    localConnection.addIceCandidate(event.candidate,
        onAddIceCandidateSuccess, onAddIceCandidateError);
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}


function receiveChannelCallback(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  // receiveChannel.binaryType = 'arraybuffer';
  receiveChannel.onmessage = onReceiveMessageCallback;

  // receivedSize = 0;
}

function onReceiveMessageCallback(event) {
  console.log('got message:', event);
  dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}


// --------------------------------------------------------
function trace(str) {
	console.log(str);
}

function onCreateSessionDescriptionError(error) {
	trace('Failed to create session description: ' + error.toString());
}

