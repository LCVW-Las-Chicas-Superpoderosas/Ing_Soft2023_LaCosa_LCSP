import Card from '../Card/Card.jsx';
import getCard from '../request/getCard';
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {appendToHand} from '../../services/handSlice';
import {addToPlayArea, setAlreadyPicked} from '../../appActions.js';
import getDeckTopCard from '../request/getDeckTopCard.jsx';

const TYPE_PANIC = 0;

const Deck = () => {
	const alreadyPicked = useSelector((state) => state.hand.alreadyPicked);
	const playerInTurn = useSelector((state) => state.game.currentPlayer);
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const idGame = JSON.parse(sessionStorage.getItem('gameId')).id;

	const [card, setCard] = useState(null);
	const [displayFront, setDisplayFront] = useState(false);
	const dispatch = useDispatch();

	// when deck mounts
	useEffect(() => {
		const fetchTopCard = async () => {
			const res = await getDeckTopCard({idGame});
			setCard({token: '', type: res.topCard});
		};
		fetchTopCard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClick = async () => {
		// if it wasn't clicked already
		if (!alreadyPicked && idPlayer === playerInTurn) {
			const res = await getCard({idPlayer});
			const pickedCards = res.pickedCards[0];

			// display first card
			setCard(pickedCards);
			setDisplayFront(true);

			// wait and update player's hand with picked card
			setTimeout(() => {
				if (pickedCards.type === TYPE_PANIC) {
					dispatch(addToPlayArea({card: pickedCards, target: -1}));
				} else {
					dispatch(appendToHand([pickedCards]));
				}

				setCard({type: res.nextCardType});
				setDisplayFront(false);
			}, 1000);

			// set alreadyPicked to true to avoid infinite picking of cards
			dispatch(setAlreadyPicked());
		}
	};
	return (
		<div className='deck' data-testid='deck'>
			<Card onClick={handleClick} info={card} front={displayFront} />
		</div>
	);
};

export default Deck;
