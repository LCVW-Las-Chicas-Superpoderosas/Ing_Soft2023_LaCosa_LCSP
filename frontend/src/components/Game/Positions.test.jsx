// eslint-disable-next-line no-unused-vars
import React from 'react';
import Positions from './Positions';
import {waitFor, screen} from '@testing-library/react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import {ChakraProvider} from '@chakra-ui/react';
import '@testing-library/jest-dom';

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
		game: {
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
				{
					name: 'player3',
					id: 3,
					position: 2,
					is_alive: true,
				},
				{
					name: 'player4',
					id: 4,
					position: 3,
					is_alive: true,
				},
				{
					name: 'player5',
					id: 5,
					position: 4,
					is_alive: true,
				},
			],
		},
	};
	it('Shoul render the three first players', async () => {
		window.sessionStorage.setItem('player', JSON.stringify(player));
		window.sessionStorage.setItem('gameId', 1);
		renderWithProviders(
			<ChakraProvider>
				<Positions relativePositionToTable={3} />
			</ChakraProvider>,
			{
				preloadedState: customInitialState,
			},
		);
		await waitFor(async () => {
			expect(screen.getByText('player4')).toBeInTheDocument();
			expect(screen.getByText('player5')).toBeInTheDocument();
			expect(screen.queryByText('player2')).not.toBeInTheDocument();
			expect(screen.getAllByText(/player/i)).toHaveLength(2);
		});
	});
	it('Shoul render the last player', async () => {
		window.sessionStorage.setItem('player', JSON.stringify(player));
		window.sessionStorage.setItem('gameId', 1);
		renderWithProviders(
			<ChakraProvider>
				<Positions relativePositionToTable={1} />
			</ChakraProvider>,
			{
				preloadedState: customInitialState,
			},
		);
		await waitFor(async () => {
			expect(screen.queryByText('player1')).not.toBeInTheDocument();
			expect(screen.queryByText('player2')).toBeInTheDocument();
			expect(screen.queryByText('player3')).not.toBeInTheDocument();
			expect(screen.getAllByText(/player/i)).toHaveLength(1);
		});
	});
});
