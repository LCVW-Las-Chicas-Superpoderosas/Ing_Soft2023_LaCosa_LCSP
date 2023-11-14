import {
	Button,
	HStack,
	Box,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {closeCardModal} from '../../appActions.js';
import Card from '../Card/Card.jsx';

const initialMiliSeconds = 5000;

const CardModal = ({revealedCards}) => {
	const [remainingMiliSeconds, setRemainingMiliSeconds] =
		useState(initialMiliSeconds);
	const cardModalIsOpen = useSelector((state) => state.game.cardModalIsOpen);

	const dispatch = useDispatch();
	const closeModal = () => {
		dispatch(closeCardModal());
		setRemainingMiliSeconds(initialMiliSeconds);
	};

	/* When modal gets open start a timer of 'initialMiliSeconds'
	   Remaining time is shown in the close button
	   Modal gets closed when timer reaches 0 or the button is pressed  */
	useEffect(() => {
		let timer;

		if (cardModalIsOpen) {
			timer = setInterval(() => {
				setRemainingMiliSeconds((prevCount) => prevCount - 1000);
			}, 1000);
		}

		if (remainingMiliSeconds <= 0) {
			clearInterval(timer);
			closeModal();
		}

		// Cleanup the interval when the modal is closed
		return () => {
			clearInterval(timer);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardModalIsOpen, closeModal]);

	return (
		<>
			<Modal
				isOpen={cardModalIsOpen}
				size={`${revealedCards.length === 1 ? 'xs' : '4xl'}`}
				onClose={closeModal}
			>
				<ModalOverlay
					bg='none'
					backdropFilter='auto'
					backdropInvert='80%'
					backdropBlur='2px'
					data-testid={'card-modal'}
				/>
				<ModalContent>
					<ModalHeader>Cartas reveladas</ModalHeader>

					<ModalBody>
						{revealedCards && (
							<HStack
								data-testid='revealed-cards'
								justify='center'
								maxH='full'
								minH='full'
							>
								{revealedCards?.map((card) => (
									<Box key={card.id} data-testid='revealed-card'>
										<Card key={card.id} info={card} front={true} />
									</Box>
								))}
							</HStack>
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={closeModal}
							data-testid={'close-card-modal-button'}
						>
							{remainingMiliSeconds / 1000}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

CardModal.propTypes = {
	revealedCards: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			token: PropTypes.string,
			type: PropTypes.number,
		}),
	),
};

export default CardModal;
