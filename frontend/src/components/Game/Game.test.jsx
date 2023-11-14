// eslint-disable-next-line no-unused-vars
import React from 'react';
import Game from './Game';
import {waitFor, screen} from '@testing-library/react';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
import {jest} from '@jest/globals';
import {ChakraProvider} from '@chakra-ui/react';
import getGameStatus from '../request/getGameStatus';
import playCard from '../request/playCard';
import {gameStarted, gameFinish} from '../../test-utils/initialStates';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../request/getGameStatus');
jest.mock('../request/getCard', () => {
	return {
		__esModule: true,
		default: async (idPlayer) => {
			idPlayer = 1;
			console.log('getCard');
			return {
				status: 200,
				ok: true,
				pickedCards: [
					{
						id: 0,
						token: 'img31.jpg',
						type: 1,
					},
				],
				nextCardType: 0,
				detail: 'Card picked correctly',
			};
		},
	};
});
jest.mock('../request/getHand', () => {
	return {
		__esModule: true,
		default: async (idPlayer) => {
			idPlayer = 1;
			console.log('getHand');
			return {
				status: 200,
				ok: true,

				detail: 'Card listed correctly',
				cards: [
					{
						id: 0,
						token: 'img49.jpg',
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
			};
		},
	};
});
jest.mock('../request/playCard');

describe('Game Layout', () => {
	beforeEach(() => {
		sessionStorage.setItem(
			'player',
			JSON.stringify({name: 'player1', id: 1, loged: true}),
		);
		sessionStorage.setItem('gameId', JSON.stringify({id: 1}));
	});

	afterEach(() => {
		jest.clearAllMocks();
		window.sessionStorage.clear();
		// render clears
		jest.clearAllTimers();
	});

	const renderComponent = (state) => {
		renderWithProviders(
			<BrowserRouter>
				<ChakraProvider>
					<Game />
				</ChakraProvider>
			</BrowserRouter>,
			{
				preloadedState: state,
			},
		);
	};

	it('Should render the Game With the game and display correct players', async () => {
		renderComponent(gameStarted);

		getGameStatus.mockResolvedValueOnce({
			status: 200,
			ok: true,
			detail: 'Game status listed correctly',
			currentPlayerId: 1,
			isFinish: 1,
			position: 0,
			players: [
				{name: 'player1', id: 1, position: 0, is_alive: true},
				{name: 'player2', id: 2, position: 1, is_alive: true},
				{name: 'player3', id: 3, position: 2, is_alive: true},
				{name: 'player4', id: 4, position: 3, is_alive: true},
				{name: 'player5', id: 5, position: 4, is_alive: true},
			],
		});
		await waitFor(() => {
			expect(screen.getByText('DECK')).toBeInTheDocument();
			expect(screen.getByText('DECK')).toBeInTheDocument();
			expect(screen.getByText('PLAY')).toBeInTheDocument();
			expect(screen.getByText('DISCARD')).toBeInTheDocument();
			expect(screen.getByTestId('hand')).toBeInTheDocument();
			expect(screen.getByText('Finish Turn')).toBeInTheDocument();
		});
		await waitFor(() => {
			// This players should be in the screen
			expect(screen.getByText(/player1/i)).toBeInTheDocument();
			expect(screen.getByText(/player2/i)).toBeInTheDocument();
			expect(screen.getByText(/player3/i)).toBeInTheDocument();
			expect(screen.getAllByText(/player/i)).toHaveLength(5);
			// This should not be in the screen
			expect(screen.queryByText(/pedro/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/pepe/i)).not.toBeInTheDocument();
		});
	});
	it('Test should render the end game statistics and pass', async () => {
		renderComponent(gameFinish);
		getGameStatus.mockResolvedValueOnce({
			status: 200,
			ok: true,
			detail: 'Game status listed correctly',
			currentPlayerId: 1,
			isFinish: 2,
			position: 0,
			players: [
				{name: 'player1', id: 1, position: 0, is_alive: true},
				{name: 'player2', id: 2, position: 1, is_alive: true},
				{name: 'player3', id: 3, position: 2, is_alive: false},
				{name: 'player4', id: 4, position: 3, is_alive: false},
				{name: 'player5', id: 5, position: 4, is_alive: true},
				{name: 'player6', id: 6, position: 5, is_alive: false},
				{name: 'player7', id: 7, position: 6, is_alive: true},
			],
		});

		await waitFor(() => {
			expect(getGameStatus).toHaveBeenCalledTimes(1);
		});

		await waitFor(() => {
			expect(screen.getByText('Game Over')).toBeInTheDocument();
			expect(screen.getByText('Results')).toBeInTheDocument();
			expect(screen.queryAllByText('Won the game.')).toHaveLength(4);
			expect(screen.queryAllByText('Failed to his team.')).toHaveLength(3);
		});
	});

	it('Test should render The Hand of the player', async () => {
		userEvent.setup();

		renderComponent(gameStarted);
		playCard.mockResolvedValueOnce({
			status: 200,
			ok: true,
			detail: 'Card played correctly',
		});

		getGameStatus.mockResolvedValueOnce({
			status: 200,
			ok: true,
			detail: 'Game status listed correctly',
			currentPlayerId: 1,
			isFinish: 1,
			position: 0,
			players: [
				{name: 'player1', id: 1, position: 0, is_alive: true},
				{name: 'player2', id: 2, position: 1, is_alive: true},
				{name: 'player3', id: 3, position: 2, is_alive: false},
				{name: 'player4', id: 4, position: 3, is_alive: false},
				{name: 'player5', id: 5, position: 4, is_alive: true},
				{name: 'player6', id: 6, position: 5, is_alive: false},
				{name: 'player7', id: 7, position: 6, is_alive: true},
			],
		});
		await waitFor(() => {
			expect(screen.getByTestId('hand')).toBeInTheDocument();
			expect(screen.getAllByTestId('handCard')).toHaveLength(4);
			expect(screen.getByAltText('card img49.jpg')).toBeInTheDocument();
		});
	});
});
