import Card from '../Card/Card.jsx';
import getCard from '../request/getCard';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {appendToHand} from '../../services/handSlice';

const Deck = () => {
	const backImage = 'img65';
	const userId = 1;

	const [clicked, setClicked] = useState(false);
	const [imageSrc, setImageSrc] = useState(backImage);
	const dispatch = useDispatch();

	// when deck is clicked
	const handleClick = async () => {
		// if it wasn't clicked already
		if (!clicked) {
			const res = await getCard(userId);
			const pickedCard = res.json.data;

			// display first card
			setImageSrc(pickedCard[0]);
			// wait and update player's hand with picked card
			setTimeout(() => {
				dispatch(appendToHand(pickedCard));
				// display back of next card in deck
				setImageSrc(backImage);
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
