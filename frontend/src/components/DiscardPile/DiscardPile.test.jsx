import '@testing-library/jest-dom';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import 'jest-localstorage-mock';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {mockStore} from './mockStore';
import DiscardPile from './DiscardPile';

describe('DiscardPile component', () => {
	beforeEach(() => {
		sessionStorage.setItem('player', JSON.stringify({id: 1}));
	});

	it('should render the correct card back when a card is discarded', async () => {
		const initialState = {
			...mockStore,
			discardPile: {
				discardedCard: {id: '1', token: 'img40.jpg', type: 1},
			},
		};

		renderWithProviders(<DiscardPile />, {preloadedState: initialState});

		await waitFor(() => {
			expect(screen.getByTestId('discard-pile')).toBeInTheDocument();

			const card = screen.getByTestId('card-image');
			expect(card).toHaveAttribute(
				'src',
				`http://localhost:5173/src/assets/cards/reverse.jpg`,
			);
		});
	});

	it('should discard the selected card correctly when clicked', async () => {
		const initialState = {
			...mockStore,
			hand: {
				...mockStore.hand,
				selectedCard: {id: '1', token: 'img40.jpg', type: 1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<DiscardPile />, {
			preloadedState: initialState,
		});

		await waitFor(() => {
			store.dispatch = jest.fn();
			const discardPile = screen.getByTestId('discard-pile');

			fireEvent.click(discardPile);

			const state = store.getState();
			expect(state.discardPile.discardedCard).toStrictEqual({
				id: '1',
				token: 'img40.jpg',
				type: 1,
			});
			expect(state.hand.cards).toEqual([
				{
					id: '0',
					token: 'img37.jpg',
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
			]);
			expect(state.hand.alreadyPlayed).toBe(true);
		});
	});

	it("player shouldn't be able to discard if it's not their turn", async () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				currentPlayer: 2,
			},
			hand: {
				...mockStore.hand,
				selectedCard: {id: '1', token: 'img40.jpg', type: 1},
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<DiscardPile />, {
			preloadedState: initialState,
		});

		const state = store.getState();
		expect(state.discardPile.discardedCard).toStrictEqual('');
	});

	it("player shouldn't be able to discard if they haven't picked a card", () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				currentPlayer: 1,
			},
			hand: {
				...mockStore.hand,
				selectedCard: {id: '1', token: 'img40.jpg', type: 1},
				alreadyPicked: false,
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<DiscardPile />, {
			preloadedState: initialState,
		});

		const state = store.getState();
		expect(state.discardPile.discardedCard).toStrictEqual('');
	});

	it("player shouldn't be able to discard if they already discarded/played", () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				currentPlayer: 1,
			},
			hand: {
				...mockStore.hand,
				selectedCard: {id: '1', token: 'img40.jpg', type: 1},
				alreadyPlayed: true,
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(<DiscardPile />, {
			preloadedState: initialState,
		});

		const state = store.getState();
		expect(state.discardPile.discardedCard).toStrictEqual('');
	});
});

// returns undefined because the response to this http request is not used
jest.mock('../request/discardCard', () => {
	return {
		__esModule: true,
		default: async () => {
			return undefined;
		},
	};
});
