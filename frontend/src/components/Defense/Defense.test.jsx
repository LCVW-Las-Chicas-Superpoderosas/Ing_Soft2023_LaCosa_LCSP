// eslint-disable-next-line no-unused-vars
import React from 'react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import userEvent from '@testing-library/user-event';
import Defense from './Defense';
import {screen, waitFor} from '@testing-library/react';

jest.mock('../../__mocks__/WebSockets');

const playerState2 = {
	player: {
		name: 'Juan', // Set the desired initial state values
		id: 2,
		loged: true,
	},
};

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
			expect(screen.getByRole('img')).toBeInTheDocument();
			// check that the image is img.71
			expect(screen.getByRole('img')).toHaveAttribute(
				'src',
				'http://localhost:5173/src/assets/cards/img.71',
			);

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
					has_defense: 'img.71',
					attacker: {name: 'pepe', id: 1},
				},
			},
		};

		const connection = new WebSocket('ws://localhost:');
		const user = userEvent.setup();
		renderWithProviders(<Defense connection={connection} />, {
			preloadedState: customInitialState,
		});

		await waitFor(() => {
			expect(screen.getByRole('img')).toBeInTheDocument();
			// i want to find the button with the text jugar carta
			expect(screen.getByText(/Jugar Carta/i)).toBeInTheDocument();
		});

		user.click(screen.getByText(/Jugar Carta/i));
	});
});
