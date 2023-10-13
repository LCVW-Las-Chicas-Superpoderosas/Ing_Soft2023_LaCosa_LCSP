import './Hand.css';
import Card from '../../components/Card/Card.jsx';
import getHand from '../request/getHand';
import playCard from '../request/playCard';

import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	setHand,
	removeFromHand,
	addToPlayArea,
	cleanPlayArea,
} from '../../appActions';
import {v4 as uuidv4} from 'uuid';

// represents a player's hand
const Hand = () => {
	const userId = 1;
	const targetId = 2;

	const [selectedCard, setSelectedCard] = useState(null);
	// select cards state
	const cards = useSelector((state) => state.hand.cards);
	const dispatch = useDispatch();

	// when component mounts
	useEffect(() => {
		// fetch  player's hand
		const fetchHand = async () => {
			const res = await getHand(userId);
			dispatch(setHand(res.cardToken));
		};
		fetchHand();
	}, [dispatch]);

	/*
		When cards are clicked once, they get selected. If clicked again, they are played.
		Playing a card consists of removing it from the player's hand and adding it to the play area.
		Play area gets cleaned after 1 second.
	*/
	const handleClick = async (clickedCard) => {
		if (selectedCard === clickedCard) {
			const cardToken = String(clickedCard);
			// eslint-disable-next-line no-unused-vars
			const res = await playCard({cardToken, userId, targetId});

			// resolver efectos de la jugada sobre la partida

			dispatch(removeFromHand(clickedCard));
			dispatch(addToPlayArea(clickedCard));
			setTimeout(() => dispatch(cleanPlayArea()), 1000);
		} else {
			setSelectedCard(clickedCard);
		}
	};
	// render cards in hand side by side
	return (
		<div className='hand'>
			{cards.map((card) => (
				<Card
					className={`card ${selectedCard === card ? 'selected' : ''}`}
					key={uuidv4()}
					onClick={() => handleClick(card)}
					token={card}
				/>
			))}
		</div>
	);
};

export default Hand;
