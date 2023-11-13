export const mockStore = {
	hand: {
		cards: [
			{
				id: '0',
				token: 'img37.jpg',
				type: 1,
			},
			{
				id: '1',
				token: 'img40.jpg',
				type: 1,
			},
			{
				id: '2',
				token: 'img22.jpg',
				type: 1,
			},
			{
				id: '3',
				token: 'img78.jpg',
				type: 1,
			},
		],
		selectedCard: '',
		alreadyPlayed: false,
		alreadyPicked: true,
	},
	playArea: {
		card: null,
	},
	discardPile: {
		discardedCard: '',
	},
	game: {
		position: 0,
		isFinish: 1,
		currentPlayer: 1,
		firstDeckCard: -1,
		players: [
			{
				name: 'player1',
				id: 1,
				position: 0,
				is_alive: true,
			},
			{
				name: 'player2',
				id: 2,
				position: 1,
				is_alive: true,
			},
		],
	},
};
