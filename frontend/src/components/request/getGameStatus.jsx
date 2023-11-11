const getGameStatus = (response, idPlayer) => {
	const json = response;
	console.log('json de getGameStatus ', json);
	const player = json.data.players.find(
		(player) => player.id === idPlayer,
	)?.position;

	const gameStatus = {
		status: json.status_code,
		ok: 1,
		players: json.data.players,
		position: player,
		isFinish: json.data.game_status,
		currentPlayerId: json.data.current_player,
	};

	return gameStatus;
};

export default getGameStatus;

// import {json} from 'react-router-dom';

// const SERVER_URL = 'http://localhost:8000/game';
/* 
const getGameStatus = async (idPlayer, connection) => {
	const parseJSONResponse = (response) => {
		//console.log('entering the parser');
		return new Promise((resolve) => {
			//console.log('im returning the parser response');
			const json = JSON.parse(response); // Parse JSON from string
			//console.log('json', json);
			//console.log('status', json.status);
			//console.log('the ok parameter is', json.ok);
			//console.log(idPlayer);

			 if (200 <= json.status_code < 300) {
				resolve({
					status: json.status,
					ok: 0,
					detail: json.detail,
				});
			} else { 
			const player = json.data.players.find(
				(player) => player.id === idPlayer,
			).position;

			//console.log('TH3E PLAYERR', player);
			resolve({
				status: json.status_code,
				ok: 1,
				players: json.data.players,
				position: player,
				isFinish: json.data.game_status,
				currentPlayerId: json.data.current_player,
			});
		}
		});
	};

	// chequear que onda el async en WS
	connection.onmessage = async function (response) {
		//console.log('im listening the event');
		//console.log('the response is');
		//console.log(response.data);
		//console.log(response);

		const promise = parseJSONResponse(response.data);

		//console.log('the promise is');
		//console.log(promise);
		 		if (!promise.ok) {
			const error = {status: promise.status, detail: promise.detail};
			//console.log('promise has errors');
			throw error; 
		} 

		//console.log('returning the promise');
		return promise;
	};
};
export default getGameStatus; */
