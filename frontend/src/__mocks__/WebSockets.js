// src/__mocks__/WebSocket.js

class MockWebSocket {
	constructor(url) {
		this.url = url;
		this.onmessage = null;
	}

	send(data) {
		// Implement if needed for your tests
	}

	close() {
		// Implement if needed for your tests
	}

	// Simulate receiving a message from the server
	simulateMessage(message) {
		if (this.onmessage) {
			const event = {
				type: 'message',
				data: message,
			};
			this.onmessage(event);
		}
	}
}

global.WebSocket = MockWebSocket;
export default MockWebSocket;
