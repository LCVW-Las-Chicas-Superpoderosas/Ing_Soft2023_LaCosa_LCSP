import Deck from '../Deck/Deck';
import Hand from '../Hand/Hand';
import PlayArea from '../PlayArea/PlayArea';
import DiscardPile from '../DiscardPile/DiscardPile';
import Positions from './Positions';
import {Chat} from './Chat';
import {
	Grid,
	Center,
	Box,
	Text,
	GridItem,
	Flex,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from '@chakra-ui/react';
import {useDispatch, useSelector} from 'react-redux';
import getGameStatus from '../request/getGameStatus';
import {useEffect, useState} from 'react';
import {
	setCurrentPlayerInGame,
	setPlayerInGame,
	setPositionInGame,
	setIsFinish,
	restoreTurnConditions,
	saveResponse,
	setUnderAttack,
	setHand,
} from '../../appActions';
import {endTurn} from '../request/endTurn';
import {FinishGame} from '../../containers/FinishGame';
import Defense from '../Defense/Defense';

export const Game = () => {
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const currentPlayer = useSelector((state) => state.game.currentPlayer);
	const idGame = JSON.parse(sessionStorage.getItem('gameId')).id;
	const dispatch = useDispatch();
	const gameStatus = useSelector((state) => state.game.isFinish);
	const {isOpen, onOpen, onClose} = useDisclosure();
	// const [displayDefense, setDisplayDefense] = useState(false);
	const displayDefense = useSelector((state) => state.game.underAttack);
	const [conHandPlay, setconHandPlay] = useState(null);
	// const playedCard = useSelector((state) => state.playArea.card);
	// const selectedCard = useSelector((state) => state.hand.selectedCard);
	const [target, setTarget] = useState(null);

	/* const playresponse = JSON.stringify(
		useSelector((state) => state.playArea.response),
	); */

	// useEffect to close the modal and reset displayDefense when isOpen becomes false

	useEffect(() => {
		const connection = new WebSocket('ws://localhost:8000/ws/game_status'); // testearlo al ws o http.

		connection.onopen = () => {
			// console.log('***ONOPEN id=', idPlayer);
			// send the playerid

			const idToSend = {type: 'game_status', content: {id_player: idPlayer}};
			// console.log('sending ', JSON.stringify(idToSend));
			// console.log('on the web socket');
			connection.send(JSON.stringify(idToSend)); // event: game_status.
		};

		function getDataOfGame(gameStatus) {
			// console.log('THE gameStatus is ');
			// console.log(gameStatus);
			dispatch(setPlayerInGame(gameStatus.players));
			dispatch(setPositionInGame(gameStatus.position));
			dispatch(setIsFinish(gameStatus.isFinish));
			dispatch(setCurrentPlayerInGame(gameStatus.currentPlayerId));
		}

		connection.onmessage = function (response) {
			// console.log('on message: ', response);
			const resp = JSON.parse(response.data);
			const gameStatus = getGameStatus(resp, idPlayer);
			getDataOfGame(gameStatus);
		};
	}, [idPlayer, dispatch, displayDefense]);

	useEffect(() => {
		const connection = new WebSocket(
			`ws://localhost:8000/ws/hand_play?id_player=${idPlayer}`,
		); // testearlo al ws o http.
		console.log(connection);
		console.log('***CREATED WEBSOCKET');
		setconHandPlay(connection);

		connection.onmessage = function (response) {
			// types defense y play_card
			console.log('LISTENING CONECTION');
			console.log('on message de play: ', response);
			const resp = JSON.parse(response.data);
			console.log('RESPONSE FROM BACK', resp);

			if (resp.status_code === 400) {
				alert(resp);
			} else {
				if (resp.data.type === 'play_card') {
					console.log('status code ', resp.status_code, resp.detail);

					if (resp.data.hand) {
						// setear mano del usuario
						dispatch(setHand(resp.data.hand));
						/* dispatch(addToDiscardPile(selectedCard));
						dispatch(removeFromHand(selectedCard));
						dispatch(setAlreadyPlayed()); */
					}

					// ver la mano del jugador como manejarla
				} else if (resp.data.type === 'defense') {
					console.log('ON DEFENSE RESP FROM BACK', resp.status_code);
					console.log(resp.data);
					dispatch(saveResponse(resp.data));
					dispatch(setUnderAttack(resp.data.under_attack));
					setTarget(resp.data.attacker_id);
					if (resp.data.hand) {
						dispatch(setHand(resp.data.hand));
						onClose();
					}
				} else if (resp.data.type === 'exchange_offer') {
					// should add the exchange logic
				} else {
					console.log('the type is not valid', resp.type);
					alert('the type is not valid', resp.type);
				}
			}
		};

		if (displayDefense) {
			onOpen();
		}

		return () => {
			// connection.close();
			console.log('on return');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idPlayer, dispatch, displayDefense, setconHandPlay]);

	/* 	const SetDefense = () => {
		console.log('before set' + displayDefense);

		setDisplayDefense(true);
		console.log('after set' + displayDefense);
	}; */

	async function finishTurn() {
		try {
			const response = await endTurn(idGame);
			dispatch(setCurrentPlayerInGame(response.idPlayerTurn));
			dispatch(restoreTurnConditions()); // so that player can pick and play again
		} catch (error) {
			alert('Failed to finish turn, try again');
			console.log(error);
		}
	}

	const sendEmptyPlay = () => {
		const body = {
			content: {
				id_player: idPlayer,
				type: 'defense',
				target_id: target,
				do_defense: false,
			},
		};
		console.log('sending NOT PLAYED', body);
		conHandPlay.send(JSON.stringify(body));

		dispatch(setUnderAttack(false));
		dispatch(saveResponse(null));

		onClose();
	};

	if (gameStatus === 2) {
		return <FinishGame />;
	} else {
		return (
			<Center h='100%' w='100%'>
				<>
					{/*		<Button onClick={SetDefense}>Open Modal</Button> */}

					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay
							bg='none'
							backdropFilter='auto'
							backdropInvert='80%'
							backdropBlur='2px'
						/>
						<ModalContent maxW='xl'>
							{' '}
							{/* Set max width here, 'xl' for extra-large, adjust as needed */}
							<ModalHeader>Quieres defenderte?</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Defense connection={conHandPlay} />
							</ModalBody>
							<ModalFooter>
								<Button
									colorScheme='red'
									variant='ghost'
									onClick={sendEmptyPlay}
								>
									No utilizar defensa
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</>
				{/* <Text color='red' fontSize='xl' fontWeight='bold'>
					{playresponse}
				</Text> */}
				<Grid
					h='90vh'
					w='90vw'
					m='10'
					p=''
					templateRows='repeat(7, 1fr)'
					templateColumns='repeat(9, 1fr)'
					gap={4}
				>
					<GridItem textAlign='center' bg='yellow' rowSpan={7} colSpan={2}>
						<Text>logs</Text>
					</GridItem>
					<GridItem bg='white' rowSpan={1} colSpan={1} />
					<GridItem bg='white' rowSpan={1} colSpan={3} paddingTop='40px'>
						<Positions relativePositionToTable={2} />
					</GridItem>
					<GridItem bg='white' rowSpan={1} colSpan={1} />
					<GridItem bg='yellow' rowSpan={7} colSpan={2}>
						<Chat />
					</GridItem>
					<GridItem bg='white' rowSpan={3} colSpan={1} paddingLeft='160px'>
						<Positions relativePositionToTable={3} />
					</GridItem>
					<GridItem
						boxShadow='2xl'
						rowSpan={3}
						colSpan={3}
						bgImage='/src/assets/table_board.png'
						gap={5}
						borderRadius='lg'
					>
						<Flex gap='12px' direction='row' justify='center'>
							<Box w='200px' border='2px' color='gray.800' mt='5'>
								<Text textAlign='center' color='white'>
									DECK
								</Text>
								<Deck />
							</Box>
							<Box w='200px' border='2px' color='gray.800' mt='5'>
								<Text textAlign='center' color='white'>
									PLAY
								</Text>
								<PlayArea connection={conHandPlay} />
							</Box>
							<Box w='200px' border='2px' color='gray.800' mt='5'>
								<Text textAlign='center' color='white'>
									DISCARD
								</Text>
								<DiscardPile />
							</Box>
						</Flex>
					</GridItem>
					<GridItem bg='white' rowSpan={3} colSpan={1} paddingRight='160px'>
						<Positions relativePositionToTable={1} />
					</GridItem>
					<GridItem rowSpan={1} colSpan={1} bg='white' />
					<GridItem bg='white' rowSpan={1} colSpan={3} paddingBottom='60px'>
						<Positions relativePositionToTable={0} />
					</GridItem>
					<GridItem
						bg='white'
						display='flex'
						justifyContent='center'
						alignItems='center'
						rowSpan={1}
						colSpan={1}
					>
						<Button
							variant='solid'
							bg={idPlayer === currentPlayer ? 'teal' : 'gray'}
							aria-label='Call Sage'
							fontSize='20px'
							onClick={() => {
								if (idPlayer === currentPlayer) {
									finishTurn();
								}
							}}
							disabled={idPlayer !== currentPlayer}
						>
							Finish Turn
						</Button>
					</GridItem>
					<GridItem bg='white' rowSpan={2} colSpan={5}>
						<Flex justify='center' direction='row'>
							<Box maxW='60%'>
								<Hand />
							</Box>
						</Flex>
					</GridItem>
				</Grid>
			</Center>
		);
	}
};
export default Game;
