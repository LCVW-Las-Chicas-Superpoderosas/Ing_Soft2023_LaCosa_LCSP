const SERVER_URL = 'http://localhost:8000/game/top_card';

const getDeckTopCard = async ({idGame}) => {
	const parseJSONResponse = (response) => {
		return new Promise((resolve) => {
			response.json().then((json) => {
				resolve({
					status: response.status_code,
					message: response.message,
					topCard: json.data.top_card,
				});
			});
		});
	};
	const config = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'id-game': idGame,
		},
	};
	console.log('config', config);
	return new Promise((resolve, reject) => {
		fetch(SERVER_URL, config)
			.then(parseJSONResponse)
			.then((response) => {
				return resolve(response);
			})
			.catch((error) => {
				return reject(error);
			});
	});
};

export default getDeckTopCard;
