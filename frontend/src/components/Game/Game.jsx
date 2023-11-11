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
} from '../../appActions';
import {endTurn} from '../request/endTurn';
import {FinishGame} from '../../containers/FinishGame';
import Defense from '../Defense/Defense';

export const Game = () => {
	const playerId = JSON.parse(sessionStorage.getItem('player')).id;
	const currentPlayer = useSelector((state) => state.game.currentPlayer);
	const idGame = JSON.parse(sessionStorage.getItem('gameId')).id;
	const dispatch = useDispatch();
	const gameStatus = useSelector((state) => state.game.isFinish);
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [displayDefense, setDisplayDefense] = useState(false);
	const playresponse = JSON.stringify(
		useSelector((state) => state.playArea.response),
	);

	// useEffect to close the modal and reset displayDefense when isOpen becomes false
	useEffect(() => {
		if (!isOpen) {
			setDisplayDefense(false);
		}
	}, [isOpen]);

	useEffect(() => {
		async function getDataOfGame() {
			try {
				const gameStatus = await getGameStatus(playerId);
				dispatch(setPlayerInGame(gameStatus.players));
				dispatch(setPositionInGame(gameStatus.position));
				dispatch(setIsFinish(gameStatus.isFinish));
				dispatch(setCurrentPlayerInGame(gameStatus.currentPlayerId));
			} catch (error) {
				if (!error.ok) {
					console.log('Error unexpected fetching data of the game');
				} else {
					console.log('Error in getGameStatus', error);
				}
			}
		}

		if (displayDefense) {
			onOpen();
		}

		const intervalId = setInterval(() => {
			getDataOfGame();
		}, 1000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, playerId, displayDefense]);

	const SetDefense = () => {
		console.log('before set' + displayDefense);

		setDisplayDefense(true);
		console.log('after set' + displayDefense);
	};

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

	if (gameStatus === 2) {
		return <FinishGame />;
	} else {
		return (
			<Center h='100%' w='100%'>
				<>
					<Button onClick={SetDefense}>Open Modal</Button>

					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay
							bg='none'
							backdropFilter='auto'
							backdropInvert='80%'
							backdropBlur='2px'
						/>
						<ModalContent>
							<ModalHeader>Quieres defenderte?</ModalHeader>

							<ModalBody>
								<Defense />
							</ModalBody>
							<ModalBody>
								<PlayArea />
							</ModalBody>

							<ModalFooter>
								<Button colorScheme='red' variant='ghost' onClick={onClose}>
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
								<PlayArea />
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
							bg={playerId === currentPlayer ? 'teal' : 'gray'}
							aria-label='Call Sage'
							fontSize='20px'
							onClick={() => {
								if (playerId === currentPlayer) {
									finishTurn();
								}
							}}
							disabled={playerId !== currentPlayer}
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
