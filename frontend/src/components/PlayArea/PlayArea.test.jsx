import '@testing-library/jest-dom';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import 'jest-localstorage-mock';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {mockStore} from './mockStore';
import PlayArea from './PlayArea';
import WS from 'jest-websocket-mock';

describe('PlayArea component', () => {
	beforeEach(() => {
		sessionStorage.setItem('player', JSON.stringify({id: 1}));
	});

	afterEach(() => {
		jest.clearAllMocks();
		WS.clean();
	});

	it('should render a card when added to the play area', async () => {
		const initialState = {
			...mockStore,
			playArea: {
				card: {card: {id: '0', token: 'img40.jpg', type: 1}, target: -1},
			},
		};

		const connection = new WS('ws://localhost:');
		renderWithProviders(<PlayArea connection={connection} />, {
			preloadedState: initialState,
		});

		await waitFor(() => {
			expect(screen.getByTestId('play-area')).toBeInTheDocument();

			const card = screen.getByTestId('card-image');
			expect(card).toHaveAttribute(
				'src',
				`http://localhost:5173/src/assets/cards/img40.jpg`,
			);
		});
	});

	it('should dispatch selected card with no target when play area is clicked', async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				selectedCard: {id: '0', token: 'img40.jpg', type: 1},
			},
		};

		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const state = store.getState();
			expect(state.playArea.card).toStrictEqual({
				card: {id: '0', token: 'img40.jpg', type: 1},
				target: -1,
			});
		});
	});

	it("shouldn't play the selected card if player is not in turn", async () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				currentPlayer: 2,
			},
			hand: {
				...mockStore.hand,
				selectedCard: {id: '0', token: 'img40.jpg', type: 1},
			},
		};

		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const spy = jest.spyOn(store, 'dispatch');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	});

	it("shouldn't play the selected card if player didn't pick first", async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				selectedCard: {id: '0', token: 'img40.jpg', type: 1},
				alreadyPicked: false,
			},
		};

		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const spy = jest.spyOn(store, 'dispatch');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	});

	it("shouldn't play the selected card if player already played", async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				selectedCard: {id: '0', token: 'img40.jpg', type: 1},
				alreadyPlayed: true,
			},
		};

		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const spy = jest.spyOn(store, 'dispatch');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	});

	it("shouldn't play a card if none is selected", async () => {
		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: mockStore,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const spy = jest.spyOn(store, 'dispatch');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	});

	it("shouldn't play a card on the play area if card requires target", async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				selectedCard: {id: '2', token: 'img22.jpg', type: 1},
				alreadyPlayed: true,
			},
		};

		const connection = new WS('ws://localhost:');
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<PlayArea connection={connection} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(async () => {
			const playArea = screen.getByTestId('play-area');
			fireEvent.click(playArea);
		});

		await waitFor(async () => {
			const spy = jest.spyOn(store, 'dispatch');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	 });
});

// returns undefined because the response to this http request is not used
jest.mock('../request/playCard', () => {
	return {
		__esModule: true,
		default: async () => {
			return undefined;
		},
	};
});

jest.mock('../request/getGameStatus', () => {
	return {
		__esModule: true,
		default: async () => {
			const response = {
				status: 200,
				ok: 'message',
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
						is_alive: false,
					},
				],
				position: mockStore.game.position,
				isFinish: mockStore.game.isFinish,
				currentPlayerId: 1,
			};
			return response;
		},
	};
});
