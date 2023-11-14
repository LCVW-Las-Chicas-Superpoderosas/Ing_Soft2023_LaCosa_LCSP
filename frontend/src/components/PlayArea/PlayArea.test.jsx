import '@testing-library/jest-dom';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import 'jest-localstorage-mock';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {mockStore} from './mockStore';
import PlayArea from './PlayArea';

describe('PlayArea component', () => {
	beforeEach(() => {
		sessionStorage.setItem('player', JSON.stringify({id: 1}));
	});

	it('should render a card when added to the play area', async () => {
		const initialState = {
			...mockStore,
			playArea: {
				card: {card: {id: '0', token: 'img40.jpg', type: 1}, target: -1},
			},
		};

		renderWithProviders(<PlayArea />, {preloadedState: initialState});

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
				selectedCard: {id: '0', token: 'img40.jpg', type: 1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: initialState,
		});

		await waitFor(async () => {
			store.dispatch = jest.fn();
			const playArea = screen.getByTestId('play-area');

			fireEvent.click(playArea);

			const state = store.getState();
			expect(state.playArea).toStrictEqual({
				card: {card: {id: '0', token: 'img40.jpg', type: 1}, target: -1},
			});
		});
	});

	it('playing a card should update the game state correctly', async () => {
		const initialState = {
			...mockStore,
			playArea: {
				// card to be played is a "lanzallamas"
				card: {card: {id: '2', token: 'img22.jpg', type: 1}, target: 2},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: initialState,
		});

		await waitFor(async () => {
			const state = store.getState();

			// player 2 should have been killed
			expect(state.game.players).toStrictEqual([
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
			]);

			// card should have been removed from player's hand
			expect(state.hand.cards).toEqual([
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
					id: '3',
					token: 'img78.jpg',
					type: 1,
				},
			]);

			expect(state.discardPile.discardedCard).toStrictEqual({
				id: '2',
				token: 'img22.jpg',
				type: 1,
			});

			expect(state.hand.alreadyPlayed).toBe(true);
		});
	});

	it("shouldn't play the selected if player is not in turn", async () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				currentPlayer: 2,
			},
			playArea: {
				card: {card: {id: '2', token: 'img22.jpg', type: 1}, target: -1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: initialState,
		});

		const spy = jest.spyOn(store, 'dispatch');
		expect(spy).not.toHaveBeenCalled();
	});

	it("shouldn't play the selected if player didn't pick first", async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				alreadyPicked: false,
			},
			playArea: {
				card: {card: {id: '2', token: 'img22.jpg', type: 1}, target: -1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: initialState,
		});

		const spy = jest.spyOn(store, 'dispatch');
		expect(spy).not.toHaveBeenCalled();
	});

	it("shouldn't play the selected if player already played a card", async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				alreadyPlayed: true,
			},
			playArea: {
				card: {card: {id: '2', token: 'img22.jpg', type: 1}, target: -1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: initialState,
		});

		const spy = jest.spyOn(store, 'dispatch');
		expect(spy).not.toHaveBeenCalled();
	});

	it("shouldn't play a card if none is selected", async () => {
		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<PlayArea />, {
			preloadedState: mockStore,
		});

		const playArea = screen.getByTestId('play-area');
		fireEvent.click(playArea);

		const spy = jest.spyOn(store, 'dispatch');
		expect(spy).not.toHaveBeenCalled();
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
