import {HStack, Box, Text} from '@chakra-ui/react'; // Import HStack
import Card from '../../components/Card/Card.jsx';
import getHand from '../request/getHand';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setHand, selectCard, cleanSelectedCard} from '../../appActions';
import isValidCard from '../../services/cardConditions.js';
// eslint-disable-next-line no-unused-vars
import {response} from 'msw';
// represents a player's hand
const Hand = () => {
	const userId = JSON.parse(sessionStorage.getItem('player')).id;
	const cards = useSelector((state) => state.hand.cards);
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const dispatch = useDispatch();
	const response = useSelector((state) => state.playArea.response);
	const [alert, setAlert] = useState('');

	console.log('reading response from state in hand', response);

	if (response) {
		console.log('reading response from state in hand', response);
	}
	const underAttack = response?.under_attack;

	// when component mounts
	useEffect(() => {
		const fetchHand = async () => {
			const res = await getHand(userId);
			dispatch(setHand(res.cards));
			console.log('fetchHand', res.cards);
		};
		fetchHand();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
		Select a card if clicked for the first time.
		Unselect if clicked twice.
	*/

	const handleClick = async (clickedCard) => {
		function addJpgExtension(array) {
			return array.map((item) => `${item}.jpg`);
		}

		if (selectedCard !== clickedCard) {
			setAlert('');
			if (isValidCard(clickedCard.token)) {
				if (response && response.defense_cards && underAttack) {
					// si te estan atacando
					// const response_sin_jpg = ['img40', 'img70'];
					// const response_mock = addJpgExtension(response_sin_jpg);

					const responseHasDefenseJpg = addJpgExtension(response.defense_cards);

					// Check if clickedCard is in the response.has_defense array
					const isOnArray = responseHasDefenseJpg.includes(clickedCard.token);
					if (isOnArray) {
						dispatch(selectCard(clickedCard));
					} else {
						setAlert('You cannot play this card', clickedCard);
						dispatch(cleanSelectedCard());
					}
				} else {
					dispatch(selectCard(clickedCard));
				}
			}
		} else {
			dispatch(cleanSelectedCard());
		}
	};

	// render cards in hand side by side

	return (
		<>
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
			<Text color='whatsapp.700' fontSize='md' fontWeight='bold' mb={5}>
				{alert}
			</Text>
		</>
	);
};

export default Hand;
