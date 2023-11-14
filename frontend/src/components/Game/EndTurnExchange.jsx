// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	HStack,
	Box,
} from '@chakra-ui/react';
import Hand from '../Hand/Hand';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {setHand} from '../../appActions';
import {v4 as uuidv4} from 'uuid';
import Card from '../Card/Card';

const pickFirstCard = 1;
const pickDefense = 2;
const pickSecondCard = 3;
const showNewHand = 4;

const EndTurnExchange = ({onOpen, isOpen, onClose, etapa, setEtapa}) => {
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const [socket, setSocket] = useState(null);
	const nextPlayerId = useSelector((state) => state.game.nextPlayerId);
	const dispatch = useDispatch();
	const [attackerPlayer, setAttackerPlayer] = useState(null);
	const [defenseCards, setDefenseCards] = useState([]);

	useEffect(() => {
		const connection = new WebSocket(
			`ws://localhost:8000/ws/card_exchange?id_player=${idPlayer}`,
		);
		console.log('set Etapa ', etapa);
		setSocket(connection);
		connection.onopen = () => {
			const idToSend = {type: 'connect', id_player: idPlayer};
			connection.send(JSON.stringify(idToSend));
		};
		console.log('etapaaaa: ', etapa);
		if (connection) {
			connection.onmessage = function (event) {
				const message = JSON.parse(event.data);
				if (message.data.type === 'exchange_offert') {
					console.log('Recieved a exchange_offert: ', message.data);
					const attacker = {
						id: message.data.attacker_id,
						attackerName: message.data.attacker_name,
					};
					setAttackerPlayer(attacker);
					setEtapa(pickSecondCard);
				} else if (message.data.type === 'result') {
					console.log('Recieved a get_result: ', message.data);
					const newHand = message.data.hand.map((card) => ({
						id: uuidv4(),
						token: card.card_token,
						type: card.type,
					}));
					dispatch(setHand(newHand));
					setEtapa(showNewHand);
				} else if (message.data.type === 'defense') {
					console.log('Recieved a defense: ', message.data);
					const defenseHand = message.data.defense_cards.map((card) => ({
						id: uuidv4(),
						token: card,
					}));
					const attacker = {
						id: message.data.attacker_id,
						attackerName: message.data.attacker_name,
					};

					console.log('ATACKEEEEER', attacker.id);
					setAttackerPlayer(attacker);

					setDefenseCards(defenseHand);
					setEtapa(pickDefense);
				} else {
					console.log('Recieved a message without type: ', message.data);
				}
			};
			connection.onerror = (error) => {
				console.error('WebSocket error:', error);
				if (error.detail) {
					console.log('error detail: ', error.detail);
				}
			};
		}
	}, [idPlayer, etapa, attackerPlayer, setEtapa, dispatch, defenseCards]);

	const handleClick = async () => {
		if (socket) {
			if (etapa === pickFirstCard) {
				const exchangeMessage = {
					content: {
						type: 'exchange',
						card_token: selectedCard.token,
						target_id: nextPlayerId,
					},
				};
				console.log('PROXIMO PLAYER: ', nextPlayerId);
				socket.send(JSON.stringify(exchangeMessage));
				console.log('Send it :' + JSON.stringify(exchangeMessage));
			} else if (etapa === pickSecondCard) {
				const exchangeMessage = {
					content: {
						type: 'exchange_offert',
						card_token: selectedCard.token,
						target_id: attackerPlayer.id,
					},
				};
				console.log(JSON.stringify(exchangeMessage));
				socket.send(JSON.stringify(exchangeMessage));
			}
		}
	};
	function handleDefense(card) {
		if (socket) {
			const defenseMessage = {
				content: {
					type: 'defense',
					card_token: card.token,
					target_id: attackerPlayer.id,
				},
			};
			console.log(JSON.stringify(defenseMessage));
			socket.send(JSON.stringify(defenseMessage));
			setEtapa(4);
		}
	}
	function whatToRender(etapa) {
		if (etapa === pickFirstCard || etapa === showNewHand) {
			onOpen();
			return <Hand />;
		} else if (etapa === pickDefense) {
			onOpen();
			console.log('defenseCards: antes del render ', defenseCards);
			return (
				<HStack justify='center' maxH='full' minH='full'>
					{defenseCards?.map((card) => (
						<Box
							key={card.id}
							width='170px' // Set the width to control the card size
							height='200px' // Set the height to control the card size
							data-testid='handCard'
						>
							<Card
								key={card.id}
								onClick={() => handleDefense(card)}
								info={card}
								front={true}
							/>
						</Box>
					))}
				</HStack>
			);
		} else if (etapa === pickSecondCard) {
			onOpen();
			return <Hand isExchange={true} />;
		} else {
			return <div>Hand not found</div>;
		}
	}
	function whatHeaderRender(etapa) {
		if (etapa === pickFirstCard) {
			return 'Pick a card to exchange';
		} else if (etapa === pickSecondCard) {
			return `Player ${attackerPlayer.attackerName} want to exchange: Pick a card`;
		} else if (etapa === pickDefense) {
			return `Player ${attackerPlayer.attackerName} Pick a card to defend`;
		} else if (etapa === showNewHand) {
			return 'Your new hand';
		} else {
			return 'Error 404:';
		}
	}
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay
				bg='none'
				backdropFilter='auto'
				backdropInvert='80%'
				backdropBlur='2px'
			/>
			<ModalContent>
				<ModalHeader>{whatHeaderRender(etapa)}</ModalHeader>
				<ModalBody>{whatToRender(etapa)}</ModalBody>
				<ModalFooter>
					<Button bg='green.300' onClick={handleClick}>
						Exchange
					</Button>

					<Button
						colorScheme='red'
						variant='ghost'
						onClick={() => {
							setEtapa(0);
							onClose();
						}}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
EndTurnExchange.propTypes = {
	onOpen: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	etapa: PropTypes.number.isRequired,
	setEtapa: PropTypes.func.isRequired,
};
export default EndTurnExchange;
