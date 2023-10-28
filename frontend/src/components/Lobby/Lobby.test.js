import Lobby from './Lobby';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import {MemoryRouter} from 'react-router-dom';
import 'jest-localstorage-mock';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';

jest.mock('../request/startGame', () => {
	return {
		__esModule: true,
		default: async (userId) => {
			console.log('start game is called', userId);
			const response = {
				status: 200,
				detail: 'Game Bahamas started successfully.',
				firstDeckCardBack: 1,
			};
			if (userId.idPlayer === 3) {
				const error = {detail: 'The game cannot be started'};
				throw error;
			}
			return response;
		},
	};
});
jest.mock('../request/deleteGameJoin', () => {
	return {
		__esModule: true,
		default: async (userId) => {
			console.log('abandonar partida is called', userId);

			const response = {
				status_code: 200,
				detail:
					'Juan Leave the game succesfulrly. (if game_status=2, all players have been wiped out, if is 0, only the player leave)',
				data: {
					game_status: 0,
				},
			};

			if (userId.idPlayer === 3) {
				console.log('entro al if del error abandonar partida');
				const error = {detail: 'you cannot leave the game'};
				throw error;
			}
			return response;
		},
	};
});

jest.mock('../request/getLobbyStatus', () => {
	return {
		__esModule: true,
		default: async (idUser) => {
			if (idUser === 2 || idUser === 3) {
				const response = {
					status: 200,
					detail: 'Bahamas lobby information.',
					players: [
						{
							id: 4,
							name: 'Maria',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
						{
							id: 3,
							name: 'Pedro',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
						{
							id: 2,
							name: 'Juan',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
						{
							id: 1,
							name: 'Gonzalo',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
					],
					statusGame: 0,
					isHost: true,
					canStart: true,
				};
				return response;
			} else {
				const response = {
					status: 200,
					detail: 'Bahamas lobby information.',
					players: [
						{
							id: 4,
							name: 'Maria',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
						{
							id: 3,
							name: 'Pedro',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
						{
							id: 1,
							name: 'Gonzalo',
							created_at: '2023-10-27T12:08:01',
							game: 1,
							is_alive: true,
							infected: false,
							my_position: null,
						},
					],
					statusGame: 0,
					isHost: true,
					canStart: false,
				};
				if (idUser === 4) {
					const error = {detail: 'the lobby information cannot be obtained'};
					throw error;
				}
				return response;
			}
		},
	};
});

describe('Lobby component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const initialState = {
		lobby: {
			players: [],
			canStart: true,
		},
	};
	const playerState = {
		player: {
			name: 'Gonzalo', // Set the desired initial state values
			id: 1,
			loged: true,
		},
	};
	const playerState2 = {
		player: {
			name: 'Juan', // Set the desired initial state values
			id: 2,
			loged: true,
		},
	};
	const playerState3 = {
		player: {
			name: 'pedro', // Set the desired initial state values
			id: 3,
			loged: true,
		},
	};
	const playerState4 = {
		player: {
			name: 'maria', // Set the desired initial state values
			id: 4,
			loged: true,
		},
	};

	// Define a theme to use in the ChakraProvider
	const theme = extendTheme({
		styles: {
			global: {
				body: {
					bgGradient: 'linear(to-r, whatsapp.800,black,whatsapp.800)',
				},
			},
		},
	});

	const renderComponent = () => {
		return renderWithProviders(
			<ChakraProvider theme={theme}>
				<MemoryRouter initialEntries={['/Games/2']} initialIndex={0}>
					<Lobby />
				</MemoryRouter>
			</ChakraProvider>,
			{preloadedState: initialState},
		);
	};

	test('should render the component with the list of players', async () => {
		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		renderComponent();

		expect(screen.getByText('Players:')).toBeInTheDocument();
		await waitFor(() => screen.getByText('Gonzalo'));
		expect(screen.getByText('Gonzalo')).toBeInTheDocument();
		await waitFor(() => screen.getByText('Juan'));
		expect(screen.getByText('Juan')).toBeInTheDocument();
		await waitFor(() => screen.getByText('Pedro'));
		expect(screen.getByText('Pedro')).toBeInTheDocument();
		await waitFor(() => screen.getByText('Maria'));
		expect(screen.getByText('Maria')).toBeInTheDocument();

		const Start = screen.getByRole('button', {name: 'Begin'});
		expect(Start).toBeInTheDocument();

		const Abandonar = screen.getByRole('button', {name: 'Abandonar Partida'});
		expect(Abandonar).toBeInTheDocument();
	});

	test('should check correct leave game behavior', async () => {
		const user = userEvent.setup();

		jest.spyOn(require('../request/deleteGameJoin'), 'default');

		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		renderComponent();

		await waitFor(() => {
			screen.getByText('Gonzalo');
			screen.getByText('Juan');
			screen.getByText('Pedro');
			screen.getByText('Maria');
		});

		// sessionStorage.setItem('player', JSON.stringify({id: 420}));

		const Abandonar = screen.getByRole('button', {name: 'Abandonar Partida'});
		expect(Abandonar).toBeInTheDocument();
		user.click(Abandonar);

		// Wait for deleteGameJoin to be called and assertions
		await waitFor(() => {
			expect(require('../request/deleteGameJoin').default).toHaveBeenCalled();
		});
	});

	test('shouldnt render juan player', async () => {
		// now i create another user to check if the player who left the game is not in the lobby
		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem('player', JSON.stringify(playerState.player));

		renderComponent();

		await waitFor(() => {
			screen.getByText('Gonzalo');
			expect(screen.getByText('Gonzalo')).toBeInTheDocument();
			screen.getByText('Pedro');
			expect(screen.getByText('Pedro')).toBeInTheDocument();
			screen.getByText('Maria');
			expect(screen.getByText('Maria')).toBeInTheDocument();
			expect(screen.queryByText('Juan')).not.toBeInTheDocument();
		});
	});

	test('should check correct begin button usage', async () => {
		const user = userEvent.setup();

		jest.spyOn(require('../request/startGame'), 'default');

		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState2.player),
		);
		renderComponent();

		await waitFor(() => {
			screen.getByText('Gonzalo');
			screen.getByText('Juan');
			screen.getByText('Pedro');
			screen.getByText('Maria');
		});

		const Start = screen.getByRole('button', {name: 'Begin'});
		expect(Start).toBeInTheDocument();
		user.click(Start);

		// Wait for startGame to be called and assertions
		await waitFor(() => {
			expect(require('../request/startGame').default).toHaveBeenCalled();
		});
	});

	test('should check that errors on the lobby information are catch', async () => {
		jest.spyOn(require('../request/startGame'), 'default');

		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState4.player),
		);
		renderComponent();

		await waitFor(() => {
			screen.getByText('the lobby information cannot be obtained');
		});

		expect(
			screen.getByText('the lobby information cannot be obtained'),
		).toBeInTheDocument();
	});

	test('should check that errors on the abandonar partida button are catch', async () => {
		const user = userEvent.setup();

		jest.spyOn(require('../request/deleteGameJoin'), 'default');

		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState3.player),
		);
		renderComponent();

		const abandonar = screen.getByRole('button', {name: 'Abandonar Partida'});
		expect(abandonar).toBeInTheDocument();
		user.click(abandonar);

		await waitFor(() => {
			expect(require('../request/deleteGameJoin').default).toHaveBeenCalled();
		});

		expect(screen.getByText('you cannot leave the game')).toBeInTheDocument();
	});

	test('should check that errors on the begin button are catch', async () => {
		const user = userEvent.setup();

		jest.spyOn(require('../request/startGame'), 'default');

		window.sessionStorage.setItem('gameId', JSON.stringify({id: 2}));
		window.sessionStorage.setItem(
			'player',
			JSON.stringify(playerState3.player),
		);
		renderComponent();

		await waitFor(() => {
			screen.getByText('Gonzalo');
			screen.getByText('Pedro');
			screen.getByText('Maria');
			screen.getByText('Juan');
		});

		const Start = screen.getByRole('button', {name: 'Begin'});
		expect(Start).toBeInTheDocument();
		user.click(Start);

		await waitFor(() => {
			expect(require('../request/startGame').default).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(
				screen.getByText('The game cannot be started'),
			).toBeInTheDocument();
		});
	});
});
