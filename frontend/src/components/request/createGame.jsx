const SERVER_URL = 'http://localhost:8000/game';

export const createGame = async ({game}) => {
	const parseJSONResponse = (response) => {
		return new Promise((resolve) =>
			response.json().then((json) => {
				if (response.ok) {
					resolve({
						status: response.status_code,
						ok: response.ok,
						detail: json.detail, // ver el detail cuando esta ok
						gameId: json.data.game_id,
					});
				} else {
					resolve({
						status: response.status,
						ok: response.ok,
						detail: json.detail, // ver el detail cuando esta !ok
					});
				}
			}),
		);
	};

	const config = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(game),
	};
	console.log('game to seeeend', {game});
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
				reject(error);
			});
	});
};
// export default CreateGame;
