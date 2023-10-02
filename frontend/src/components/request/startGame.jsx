const SERVER_URL = 'http://localhost:8000/game/start';

// Should be called with an object with the idPartida and idUsuario
const startGame = async ({values}) => {
	const config = {
		method: 'PUT',
		header: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values),
	};
	const parseJSONResponse = (response) => {
		return new Promise((resolve) =>
			response.json().then((json) => {
				if (response.ok) {
					resolve({
						status: response.status,
						ok: response.ok,
						// data: ver bien que va aca
					});
				} else {
					resolve({
						status: response.status,
						ok: response.ok,
						detail: json.detail,
					});
				}
			}),
		);
	};
	return new Promise((resolve, reject) => {
		fetch(SERVER_URL, config)
			.then(parseJSONResponse)
			.then((response) => {
				if (response.ok) {
					return resolve(response);
				}
				return reject(response);
			})
			.catch((error) => {
				return reject(error);
			});
	});
};

export default startGame;
