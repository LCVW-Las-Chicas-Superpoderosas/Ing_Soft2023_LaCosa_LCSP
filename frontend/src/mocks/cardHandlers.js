import { rest } from 'msw';

export const cardHandlers = [
	rest.get('https://localhost:8000/hand', (req, res, ctx) => {
		console.log('Request intercepted:', req);
		return res(
			ctx.status(200),
			ctx.json({
				status: 200,
				message: '',
				data: {
					card_token: ['img37.jpg', 'img40.jpg', 'img72.jpg', 'img78.jpg'],
				},
			}),
		);
	}),

	rest.put('https://localhost:8000/hand', (req, res, ctx) => {
		console.log('Request intercepted:', req);
		return res(
			ctx.status(200),
			ctx.json({
				status: 'int',
				message: 'str',
				data: {picked_cards: ['img37.jpg'], next_card_type: 0},
			}),
		);
	}),

	// sent when a card is about to be played
	rest.post('https://localhost:8000/hand/play', (req, res, ctx) => {
		console.log('Request intercepted:', req);
		return res(
			ctx.status(200),
			ctx.json({
				status: 200,
				detail: '',
				data: {
					user: {
						id: 36,
						name: 'pepe2',
						created_at: '2023-09-30T21:56:36',
						game: null,
						is_alive: true,
						cards: [],
					},
					target_user: {
						id: 36,
						name: 'pepe2',
						created_at: '2023-09-30T21:56:36',
						game: null,
						is_alive: true,
						cards: [],
					},
				},
			}),
		);
	}),
];
