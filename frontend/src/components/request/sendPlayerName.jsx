// Recive un objeto con el nombre del jugador y lo envia al servidor
const SERVER_URL = 'http://localhost:8000/register';
// The status coede is missing in the response
const sendPlayerName = async ({player}) => {
	const parseJSONResponse = (response) => {
		return new Promise((resolve) => {
			response.json().then((json) => {
				if (response.ok) {
					resolve({
						status: response.status_code,
						ok: response.ok,
						id: json.data.id,
						name: json.data.name,
						detail: json.detail,
					});
				} else {
					resolve({
						// status: response.status_code,
						ok: response.ok,
						detail: json.detail,
					});
				}
			});
		});
	};

	const playerToSend = {
		name: player.name,
	};

	const config = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(playerToSend),
	};

	return new Promise((resolve, reject) => {
		fetch(SERVER_URL, config)
			.then(parseJSONResponse)
			.then((json) => {
				if (json.ok) {
					return resolve(json);
				}
				return reject(json);
			})
			.catch((error) => {
				console.log('Error in sendPlayerName: ', {error});
				throw error;
			});
	});
};
export default sendPlayerName;
