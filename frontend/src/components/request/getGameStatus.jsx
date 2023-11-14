const getGameStatus = (response, idPlayer) => {
	const json = response;
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
		nextPlayerId: json.data.next_player,
	};

	return gameStatus;
};

export default getGameStatus;
