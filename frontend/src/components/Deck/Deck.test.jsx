/* eslint-disable no-unused-vars */
import React from 'react';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import Deck from './Deck';
import 'jest-localstorage-mock';

jest.mock('../request/getCard', () => {
	return {
		__esModule: true,
		default: async () => {
			const response = {
				pickedCards: [{id: '1', token: 'img37.jpg', type: 1}],
				nextCardType: 0,
			};
			console.log('response', response);
			return response;
		},
	};
});

describe('Deck component', () => {
	beforeEach(() => {
		const initialState = {
			game: {
				currentPlayer: 1,
				firstDeckCardBack: 1,
			},
			hand: {
				alreadyPicked: false,
			},
		};

		sessionStorage.setItem('player', JSON.stringify({id: 1}));
		sessionStorage.setItem('gameId', JSON.stringify({id: 1}));
		renderWithProviders(<Deck />, {preloadedState: initialState});
	});

	it('should mount deck component and render first card back', async () => {
		const deck = screen.getByTestId('deck');
		expect(deck).toBeInTheDocument();

		const card = within(screen.getByTestId('card-button')).getByTestId(
			'card-image',
		);

		await waitFor(() => {
			expect(card).toHaveAttribute(
				'src',
				'http://localhost:5173/src/assets/cards/reverse.jpg',
			);
		});
	});

	it('should render picked card', async () => {
		const deck = screen.getByTestId('deck');
		expect(deck).toBeInTheDocument();

		const card = within(screen.getByTestId('card-button')).getByTestId(
			'card-image',
		);
		fireEvent.click(card);

		await waitFor(
			() => {
				expect(card).toHaveAttribute(
					'src',
					'http://localhost:5173/src/assets/cards/img37.jpg',
				);
			},
			{timeout: 5000},
		);
	});
});

jest.mock('../request/getDeckTopCard', () => {
	return {
		__esModule: true,
		default: async () => {
			const response = {
				status: 200,
				ok: 'message',
				topCard: 2,
			};
			console.log('response hola', response);
			return response;
		},
	};
});
