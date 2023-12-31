const SERVER_URL = 'http://localhost:8000/game/join';

const deleteGameJoin = async ({idPlayer}) => {
	const parseJSONResponse = (response) => {
		return new Promise((resolve) => {
			response.json().then((json) => {
				console.log('json', json);
				if (response.ok) {
					resolve({
						status: response.status,
						ok: response.ok,
						idPlayer: json.data.id_player,
						gameStatus: json.data.game_status,
					});
				} else {
					resolve({
						status: response.status,
						ok: response.ok,
						detail: json.detail,
					});
				}
			});
		});
	};
	const config = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'id-player': idPlayer,
		},
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
export default deleteGameJoin;
