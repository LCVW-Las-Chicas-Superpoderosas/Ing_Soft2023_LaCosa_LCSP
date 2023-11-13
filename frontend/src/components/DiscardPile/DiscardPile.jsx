import {Box} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	addToDiscardPile,
	removeFromHand,
	setAlreadyPlayed,
} from '../../appActions';
import Card from '../Card/Card.jsx';
import discardCard from '../request/discardCard';

const DiscardPile = () => {
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const discardedCard = useSelector((state) => state.discardPile.discardedCard);
	const alreadyPlayed = useSelector((state) => state.hand.alreadyPlayed);
	const alreadyPicked = useSelector((state) => state.hand.alreadyPicked);
	const playerInTurn = useSelector((state) => state.game.currentPlayer);

	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const [highlight, setHighlight] = useState(false);
	const dispatch = useDispatch();

	/*
		Highlight the discard pile when a card is discarded.
	*/
	useEffect(() => {
		console.log('Discarded card updated: ', discardedCard);
		setHighlight(true);
		setTimeout(() => {
			setHighlight(false);
		}, 1000);
	}, [discardedCard]);

	const canDiscard = () => {
		return (
			selectedCard &&
			alreadyPicked &&
			!alreadyPlayed &&
			idPlayer === playerInTurn
		);
	};

	/*
		When the discard pile is clicked, the selected card is placed in the
		discard pile and removed from the player's hand.
	*/
	const handleClick = async () => {
		if (!canDiscard()) {
			return;
		}

		await discardCard({discardedCard: selectedCard, idPlayer});
		dispatch(addToDiscardPile(selectedCard));
		dispatch(removeFromHand(selectedCard));
		dispatch(setAlreadyPlayed());
	};

	return (
		<Box w='100%' h='100%' className='discard-pile' onClick={handleClick}>
			{discardedCard && (
				<Card
					className={`card ${highlight ? 'highlighted' : ''}`}
					info={discardedCard}
					front={false}
				/>
			)}
		</Box>
	);
};

export default DiscardPile;
