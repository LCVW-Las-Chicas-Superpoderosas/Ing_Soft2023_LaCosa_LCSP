import {io} from 'socket.io-client';

const SERVER_URL = 'http://localhost:8000/game'; // Note that we removed '/game' from the URL

const getGameStatus = (idPlayer) => {
	return new Promise((resolve, reject) => {
		const socket = io(SERVER_URL);

		socket.emit('getGameStatus', idPlayer);

		// Set a timeout for the response. If you don't receive a response within 5 seconds, consider it an error.
		const timeout = setTimeout(() => {
			socket.disconnect();

			// eslint-disable-next-line prefer-promise-reject-errors
			reject({
				status: 408, // Request Timeout HTTP status code
				ok: false,
				detail: 'Request timeout',
			});
		}, 5000);

		// Listen for the response from the server
		socket.on('getGameStatus', (response) => {
			clearTimeout(timeout); // Clear the timeout as we've received a response
			socket.disconnect(); // Disconnect the socket after receiving the response

			// Now, you can handle the response
			if (response.ok) {
				resolve(response);
			} else {
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({
					status: response.status,
					ok: false,
					detail: response.detail,
				});
			}
		});
	});
};

export default getGameStatus;
