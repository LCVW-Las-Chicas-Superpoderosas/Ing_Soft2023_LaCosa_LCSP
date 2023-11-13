import {HStack, Box} from '@chakra-ui/react'; // Import HStack
import Card from '../../components/Card/Card.jsx';
import getHand from '../request/getHand';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setHand, selectCard, cleanSelectedCard} from '../../appActions';
import isValidCard from '../../services/cardConditions.js';
import PropTypes from 'prop-types';

// represents a player's hand
const Hand = ({isExchange}) => {
	const userId = JSON.parse(sessionStorage.getItem('player')).id;
	const cards = useSelector((state) => state.hand.cards);
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const dispatch = useDispatch();

	// when component mounts
	useEffect(() => {
		const fetchHand = async () => {
			const res = await getHand(userId);
			dispatch(setHand(res.cards));
		};
		if (!isExchange) {
			fetchHand();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
		Select a card if clicked for the first time.
		Unselect if clicked twice.
	*/
	const handleClick = async (clickedCard) => {
		if (selectedCard !== clickedCard) {
			if (isValidCard(clickedCard.token)) {
				dispatch(selectCard(clickedCard));
			}
		} else {
			dispatch(cleanSelectedCard());
		}
	};

	// render cards in hand side by side

	return (
		<HStack data-testid='hand' justify='center' maxH='full' minH='full'>
			{cards?.map((card) => (
				<Box
					key={card.id}
					width='170px' // Set the width to control the card size
					height='200px' // Set the height to control the card size
					data-testid='handCard'
				>
					<Card
						className={`card ${selectedCard === card ? 'selected' : ''}`}
						key={card.id}
						onClick={() => handleClick(card)}
						info={card}
						front={true}
					/>
				</Box>
			))}
		</HStack>
	);
};

Hand.propTypes = {
	isExchange: PropTypes.bool,
};

Hand.defaultProps = {
	isExchange: false,
};

export default Hand;
