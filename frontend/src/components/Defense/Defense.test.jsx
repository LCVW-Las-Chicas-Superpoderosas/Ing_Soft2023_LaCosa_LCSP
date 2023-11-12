// eslint-disable-next-line no-unused-vars
import React from 'react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import userEvent from '@testing-library/user-event';
import Defense from './Defense';
import {screen, waitFor} from '@testing-library/react';
import WS from 'jest-websocket-mock';

// jest.mock('../../__mocks__/WebSocketsPlay');

const playerState2 = {
	player: {
		name: 'Juan', // Set the desired initial state values
		id: 2,
		loged: true,
	},
};

const expectedCards = [
	{id: '0', token: 'img1.jpg', type: 1},
	{id: '1', token: 'img40.jpg', type: 1},
	{id: '2', token: 'img72.jpg', type: 1},
	{id: '3', token: 'img78.jpg', type: 1},
];

jest.mock('../request/getHand', () => {
	return {
		__esModule: true,
		default: async () => {
			const response = {
				status: 200,
				ok: 'message',
				cards: expectedCards,
			};
			return response;
		},
	};
});

describe('Defense', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Component should render without crashing', async () => {
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		const connection = new WebSocket('ws://localhost:');
		renderWithProviders(<Defense connection={connection} />);

		await waitFor(() => {
			expect(
				screen.getByText(/The defense card information is not available/i),
			).toBeInTheDocument();
		});
	});

	it('Component should render the image and the play button ', async () => {
		const customInitialState = {
			playArea: {
				response: {
					under_attack: 1,
					attack_type: 'Cambio de Lugar',
					has_defense: 'img.71',
					attacker: {name: 'pepe', id: 1},
				},
			},
		};
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		const connection = new WebSocket('ws://localhost:');
		renderWithProviders(<Defense connection={connection} />, {
			preloadedState: customInitialState,
		});

		await waitFor(() => {
			expect(screen.getByRole('button')).toBeInTheDocument();

			expect(
				screen.getByText(
					/El jugador pepe jugó la carta Cambio de Lugar contra ti/i,
				),
			).toBeInTheDocument();
		});
	});

	it('the play button should send a messenge to the server ', async () => {
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);

		const customInitialState = {
			playArea: {
				response: {
					under_attack: 1,
					attack_type: 'Cambio de Lugar',
					has_defense: ['img.40'],
					attacker: {name: 'pepe', id: 1},
				},
			},
			hand: {
				cards: [],
				selectedCard: {id: '1', token: 'img40.jpg', type: 1},
				alreadyPlayed: false,
				alreadyPicked: false,
			},
		};
		// Create a mock WebSocket server
		const server = new WS('ws://localhost/1234');

		// Mock the WebSocket connection
		const connection = new WebSocket('ws://localhost/1234');

		await server.connected;

		// Mock the send method of the connection
		jest.spyOn(connection, 'send');

		const user = userEvent.setup();
		renderWithProviders(<Defense connection={connection} />, {
			preloadedState: customInitialState,
		});

		// Wait for the component to render
		await waitFor(() => {
			expect(screen.getByText(/Jugar Carta/i)).toBeInTheDocument();
		});

		// Simulate a user click on the "Jugar Carta" button
		user.click(screen.getByText(/Jugar Carta/i));

		// Wait for the send method to be called
		await waitFor(() => {
			expect(connection.send).toHaveBeenCalledTimes(1);
			expect(connection.send).toHaveBeenCalledWith(
				'{"idPlayer":2,"type":"defense","playedCard":"img40","targetId":1}',
			);
		});
		WS.clean();
	});
});
