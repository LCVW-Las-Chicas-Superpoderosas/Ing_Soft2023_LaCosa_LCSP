// eslint-disable-next-line no-unused-vars
import React from 'react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import Logs from './Logs';
import {screen, waitFor} from '@testing-library/react';
import WS from 'jest-websocket-mock';

const playerState2 = {
	player: {
		name: 'Juan', // Set the desired initial state values
		id: 2,
		loged: true,
	},
};

describe('Logs', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Component should render without crashing', async () => {
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		const connection = new WebSocket('ws://localhost:');
		renderWithProviders(<Logs connection={connection} />);

		await waitFor(() => {
			expect(screen.getByText(/Logs/i)).toBeInTheDocument();
		});
	});

	it('Component should render the Logs view and see the message', async () => {
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		const server = new WS('ws://localhost/1234');
		const connection = new WebSocket('ws://localhost/1234');
		const message = JSON.stringify({
			data: {type: 'log_message', message: 'Hello'},
		});

		renderWithProviders(<Logs connection={connection} />);

		server.send(message);
		await waitFor(() => {
			expect(screen.getByText(/Hello/i)).toBeInTheDocument();
		});

		server.close();
	});

	it('Two players should render the Logs view and receive the same message', async () => {
		const server = new WS('ws://localhost'); // Simulated WebSocket server

		const playerState1 = {
			player: {
				name: 'Player One',
				id: 1,
				loged: true,
			},
		};

		const playerState2 = {
			player: {
				name: 'Player Two',
				id: 2,
				loged: true,
			},
		};

		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState1.player),
		);
		const connection1 = new WebSocket('ws://localhost');

		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		const connection2 = new WebSocket('ws://localhost');

		renderWithProviders(<Logs connection={connection1} />);
		renderWithProviders(<Logs connection={connection2} />);

		// Simulate sending a message from Player One
		const messageFromPlayer1 = JSON.stringify({
			data: {type: 'log_message', message: 'Hello, everyone!'},
		});
		server.send(messageFromPlayer1);

		// Check if both players received the message
		await waitFor(() => {
			expect(screen.queryAllByText('Hello, everyone!')).toHaveLength(2);
		});

		server.close();
	});
});
