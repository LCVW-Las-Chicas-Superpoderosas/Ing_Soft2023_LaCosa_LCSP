import {Box} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addToDiscardPile, removeFromHand} from '../../appActions';
import Card from '../Card/Card.jsx';

const DiscardPile = () => {
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const discardedCard = useSelector((state) => state.discardPile.discardedCard);
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

	/*
		When the discard pile is clicked, the selected card is placed in the
		discard pile and removed from the player's hand.
	*/
	const handleClick = () => {
		console.log('Click on discard pile');
		if (selectedCard !== '') {
			dispatch(addToDiscardPile(selectedCard));
			dispatch(removeFromHand(selectedCard));

			console.log('Card discarded');
		}
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