import './Hand.css';
import Card from '../../components/Card/Card.jsx';
import getHand from '../request/getHand';

import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setHand} from '../../services/handSlice';
import {v4 as uuidv4} from 'uuid';

// represents a player's hand
const Hand = () => {
	const userId = 1;

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

	// render cards in hand side by side
	return (
		<div className='hand'>
			{cards.map((card) => (
				<Card key={uuidv4()} token={card} />
			))}
		</div>
	);
};

export default Hand;
