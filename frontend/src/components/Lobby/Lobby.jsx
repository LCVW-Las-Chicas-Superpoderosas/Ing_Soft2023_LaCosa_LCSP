import getLobbyStatus from '../request/getLobbyStatus';
import {useDispatch, useSelector} from 'react-redux';
import {setCanStart, setLobby, setFirstDeckCardBack} from '../../appActions';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import startGame from '../request/startGame';
import deleteGameJoin from '../request/deleteGameJoin';
import {VStack, OrderedList, ListItem, Text, Button} from '@chakra-ui/react';

// mock respuestas por ahora 		{user_name: 'toomas', id: 5, is_host: 0},

const Lobby = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [alert, setAlert] = useState('');
	const [alert1, setAlert1] = useState('');
	const [alert2, setAlert2] = useState('');

	const gameId = JSON.parse(sessionStorage.getItem('gameId')).id;
	const userId = JSON.parse(sessionStorage.getItem('player')).id;

	const gameStatus = useSelector((state) => state.lobby);
	const [isHost, setIsHost] = useState(false);

	const StartGame = async () => {
		try {
			const resp = await startGame({idPlayer: userId});
			// to be able to render first card back in deck
			dispatch(setFirstDeckCardBack(resp.firstDeckCardBack));
			navigate(`/Games/${gameId}/play`);
		} catch (error) {
			setAlert2(error.detail);
		}
	};

	const Abandonar = async () => {
		try {
			const resp = await deleteGameJoin({idPlayer: userId});
			console.log(resp);
			navigate(`/`);
		} catch (error) {
			setAlert1(error.detail);
		}
	};

	const buscarJugadores = async () => {
		try {
			// console.log('antes de getLobbyStatus');
			// console.log('with id ', userId);
			const fetchedresp = await getLobbyStatus(userId);
			// console.log('despues de getLobbyStatus');
			/// /console.log(fetchedresp);
			dispatch(setLobby(fetchedresp.players));
			dispatch(setCanStart(fetchedresp.canStart)); // Assuming the response key is "can_start"
			setIsHost(fetchedresp.isHost);

			if (fetchedresp.statusGame === 1) {
				navigate(`/Games/${gameId}/play`);
			}
		} catch (error) {
			// Handle the error here
			if (error.status === 400) {
				if (error.detail === 'Player is not part of a game.') {
					navigate(`/Games`);
				}
			} else {
				setAlert(error.detail);
			}
		}
	};
	function orderPlayers(players) {
		// Create a copy of the players array
		const copyOfPlayers = [...players];
		const sortedPlayers = copyOfPlayers.sort((a, b) => {
			return a.id - b.id;
		});
		return sortedPlayers;
	}

	const playersSort = orderPlayers(gameStatus.players);

	useEffect(() => {
		buscarJugadores();

		// Set up an interval to fetch lobby status every X milliseconds (e.g., every 10 seconds).
		const intervalId = setInterval(() => {
			buscarJugadores();
		}, 1000); // Change the interval as needed

		// Clear the interval when the component unmounts to avoid memory leaks.
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	return (
		<div style={{position: 'relative'}}>
			<VStack spacing={4} align='center' m='4'>
				{alert ? (
					<Text color='red.600' fontSize='xl'>
						{alert}
					</Text>
				) : null}
				{alert1 ? (
					<Text color='red.600' fontSize='xl'>
						{alert1}
					</Text>
				) : null}
				{alert2 ? (
					<Text color='red.600' fontSize='xl'>
						{alert2}
					</Text>
				) : null}
				<Text
					bgGradient='linear(to-r,gray.200,white,gray.200)'
					bgClip='text'
					fontSize='4xl'
					fontWeight='extrabold'
				>
					Players:
				</Text>
				<OrderedList>
					{playersSort.map((player) => (
						<ListItem
							mt='2'
							bgGradient='linear(to-r,gray.200,white,gray.200)'
							bgClip='text'
							fontSize='2xl'
							key={player.id}
						>
							{player.name}
						</ListItem>
					))}
				</OrderedList>
				{gameStatus.canStart && isHost ? (
					<Button onClick={StartGame}>Begin</Button>
				) : null}
			</VStack>

			<Button
				position='fixed'
				bottom='2rem'
				right='2rem'
				color='red.600'
				onClick={Abandonar}
			>
				Abandonar Partida
			</Button>
		</div>
	);
};

export default Lobby;
