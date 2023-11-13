// eslint-disable-next-line no-unused-vars
import React from 'react';
import PlayerIcons from './PlayerIcons';
import {waitFor, screen, fireEvent} from '@testing-library/react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import {ChakraProvider} from '@chakra-ui/react';

describe('Player Icons tests', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
	});
	const player = {
		name: 'player1',
		id: 1,
		loged: true,
	};
	const customInitialState = {
		hand: {
			cards: [
				{
					id: 0,
					token: 'img37.jpg',
					type: 1,
				},
				{
					id: 1,
					token: 'img40.jpg',
					type: 1,
				},
				{
					id: 2,
					token: 'img72.jpg',
					type: 1,
				},
				{
					id: 3,
					token: 'img78.jpg',
					type: 1,
				},
			],
			selectedCard: {id: '0', token: 'img22.jpg', type: 1},
			alreadyPlayed: false,
			alreadyPicked: false,
		},
	};
	const realativePositionToTable1 = 0;
	const currentPlayerId1 = 1;
	const players1 = [
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
		{
			name: 'player3',
			id: 3,
			position: 2,
			is_alive: true,
		},
	];
	it('Shoul render the player icons and pass with 1', async () => {
		window.sessionStorage.setItem('player', JSON.stringify(player));
		window.sessionStorage.setItem('gameId', 1);
		renderWithProviders(
			<ChakraProvider>
				<PlayerIcons
					relativePositionToTable={realativePositionToTable1}
					players={players1}
					currentPlayerId={currentPlayerId1}
				/>
			</ChakraProvider>,
			{
				preloadedState: customInitialState,
			},
		);
		await waitFor(async () => {
			expect(screen.getByText('player1')).toBeInTheDocument();
			expect(screen.getByText('player2')).toBeInTheDocument();
			expect(screen.getByText('player3')).toBeInTheDocument();
			expect(screen.getAllByText(/player/i).length).toBe(3);
			expect(screen.getByTestId('player-1')).toHaveStyle(
				'border: 2px solid blue',
			);
			// Chakra ui wont fail if the color is not valid, only checks that the background color exists
			expect(screen.getByTestId('player-1')).toHaveStyle(
				'background-color: teal.500',
			);
			expect(screen.getByTestId('player-2')).toHaveStyle(
				'background-color: gray.900',
			);
			expect(screen.getByTestId('player-3')).toHaveStyle(
				'background-color: gray.900',
			);
		});
	});

	it('should let the player select a valid target', async () => {
		window.sessionStorage.setItem('player', JSON.stringify(player));
		window.sessionStorage.setItem('gameId', 1);

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<ChakraProvider>
				<PlayerIcons
					relativePositionToTable={realativePositionToTable1}
					players={players1}
					currentPlayerId={currentPlayerId1}
				/>
			</ChakraProvider>,
			{
				preloadedState: customInitialState,
			},
		);

		await waitFor(() => {
			const player3 = screen.getByTestId('player-3');
			fireEvent.click(player3);
		});

		await waitFor(() => {
			const state = store.getState();
			expect(state.playArea.card).toEqual({
				card: {
					id: '0',
					token: 'img22.jpg',
					type: 1,
				},
				target: 3,
			});
		});
	});
});
