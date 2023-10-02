const SERVER_URL = 'http://localhost:8000/game/join';

const getLobyStatus = (idPlayer) => {
	const handleJSONParser = (response) => {
		return new Promise((resolve) => {
			response.json().then((json) => {
				if (response.ok) {
					resolve({
						status: response.status,
						ok: response.ok,
						players: json.data.players,
						cantStart: json.data.cantStart,
						detail: json.detail,
					});
				}
				resolve({
					status: response.status,
					ok: response.ok,
					detail: json.detail,
				});
			});
		});
	};

	const config = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'id-player': idPlayer,
		},
	};
	return new Promise((resolve, reject) => {
		fetch(SERVER_URL, config)
			.then(handleJSONParser)
			.then((response) => {
				if (response.ok) {
					return resolve(response);
				}
				return reject(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
};
export default getLobyStatus;
