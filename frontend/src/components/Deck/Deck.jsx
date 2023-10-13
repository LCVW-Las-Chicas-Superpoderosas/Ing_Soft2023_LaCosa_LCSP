import Card from '../Card/Card.jsx';
import getCard from '../request/getCard';
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {appendToHand} from '../../services/handSlice';

const Deck = () => {
	const backImage = ['panic-reverse.jpg', 'reverse.jpg'];

	// userId del jugador en turno, deberíamos obtenerlo del estado de la partida
	const userId = 1;

	const [clicked, setClicked] = useState(false);
	const [imageSrc, setImageSrc] = useState(backImage);
	const dispatch = useDispatch();

	useEffect(() => {
		// deberíamos obtener el tipo de la primera carta cuando empieza la partida
		setImageSrc(backImage[1]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// when deck is clicked
	const handleClick = async () => {
		// if it wasn't clicked already
		if (!clicked) {
			const res = await getCard(userId);
			const pickedCard = res.pickedCards;

			// display first card
			setImageSrc(pickedCard[0]);
			// wait and update player's hand with picked card
			setTimeout(() => {
				dispatch(appendToHand(pickedCard));
				// display back of next card in deck
				setImageSrc(backImage[res.nextCardType]);
			}, 1000);
			// set clicked to true to avoid infinite picking of cards
			setClicked(true);
		}
	};

	return (
		<div className='deck'>
			<Card onClick={handleClick} token={imageSrc} />
		</div>
	);
};

export default Deck;
