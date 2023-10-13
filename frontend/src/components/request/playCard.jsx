const SERVER_URL = 'https://localhost:8000/hand/play';
// Should pass an object with the idPlayer, targetId and cardToken
const playCard = async (values) => {
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
						user: json.data.user,
						targetUser: json.data.target_user,
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
	const bodyTosend = {
		id_usuario: values.idPlayer,
		target_id: values.targetId,
		card_token: values.cardToken,
	};
	const config = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(bodyTosend),
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
