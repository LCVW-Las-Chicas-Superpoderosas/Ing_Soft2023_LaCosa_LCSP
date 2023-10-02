const SERVER_URL = 'http://localhost:8000/hand/play';
// Should pass an object with the idPlayer, targetId and cardToken
const playCard = async ({values}) => {
	const parseJSONResponse = (response) => {
		return new Promise((resolve) => {
			response.json().then((json) => {
				if (response.ok) {
					resolve({
						status: response.status_code,
						ok: response.ok,
						idPlayer: json.data.id_player,
						cardToken: json.data.card_token,
						targetId: json.data.target_id,
						// data: hay que ver bien que devuelve
					});
				} else {
					resolve({
						status: response.status_code,
						ok: response.ok,
						detail: json.detail,
					});
				}
			});
		});
	};

	const config = {
		method: 'POST',
		header: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values),
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

export default playCard;
