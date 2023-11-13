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
} from '@chakra-ui/react';
import Hand from '../Hand/Hand';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {setHand} from '../../appActions';
import {v4 as uuidv4} from 'uuid';

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

	useEffect(() => {
		const connection = new WebSocket(
			`ws://localhost:8000/ws/card_exchange?id_player=${idPlayer}`,
		);
		setSocket(connection);
		connection.onopen = () => {
			const idToSend = {type: 'connect', id_player: idPlayer};
			connection.send(JSON.stringify(idToSend));
		};

		if (connection) {
			connection.onmessage = function (event) {
				const message = JSON.parse(event.data);
				console.log('In message, recieved a messasge:', message);
				if (message.data.type === 'exchange_offert') {
					console.log('Recieved a exchange_offert: ', message.data);
					const attacker = {
						id: message.data.attacker_id,
						attackerName: message.data.attacker_name,
					};
					console.log('ATACKEEEEER', attacker.id);
					console.log('Response:', message.data);
					setAttackerPlayer(attacker);
					setEtapa(pickSecondCard);
				}
				// exchange_result
				else if (message.data.type === 'result') {
					console.log('Recieved a get_result: ', message.data);
					const newHand = message.data.hand.map((card) => ({
						id: uuidv4(),
						token: card.card_token,
						type: card.type,
					}));
					dispatch(setHand(newHand));
					setEtapa(showNewHand);
				}
				// defensa
				else if (message.type === 'defense') {
					console.log('Recieved a defense: ', message.data);
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
	}, [idPlayer, etapa, attackerPlayer, setEtapa, dispatch]);

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
	function whatToRender(etapa) {
		if (etapa === pickFirstCard || etapa === showNewHand) {
			onOpen();
			return <Hand />;
		} else if (etapa === pickDefense) {
			// check what to return
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
			return 'Pick a card to defend';
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
