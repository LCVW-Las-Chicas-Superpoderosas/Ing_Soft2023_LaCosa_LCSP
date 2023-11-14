import Card from '../../components/Card/Card.jsx';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
	removeFromHand,
	addToDiscardPile,
	// setPlayerInGame as updatePlayers,
	addToPlayArea,
	cleanPlayArea,
	setAlreadyPlayed,
} from '../../appActions';
// import playCard from '../request/playCard';
import {Box} from '@chakra-ui/react';
import {
	requiresTarget,
	isDefense,
	isInfection,
} from '../../services/cardConditions';
import PropTypes from 'prop-types';
// import getGameStatus from '../request/getGameStatus';

const PlayArea = ({connection}) => {
	/// /console.log('PlayArea connection is', connection);
	const dispatch = useDispatch();

	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const playedCard = useSelector((state) => state.playArea.card);
	const alreadyPlayed = useSelector((state) => state.hand.alreadyPlayed);
	const alreadyPicked = useSelector((state) => state.hand.alreadyPicked);
	const [displayCard, setDisplayCard] = useState('');

	const playerInTurn = useSelector((state) => state.game.currentPlayer);
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;

	const canPlayOnPlayArea = () => {
		return (
			selectedCard &&
			!alreadyPlayed &&
			alreadyPicked &&
			idPlayer === playerInTurn &&
			!requiresTarget(selectedCard.token) &&
			!isDefense(selectedCard.token) &&
			!isInfection(selectedCard.token)
			// ? && !isObstacle(selectedCard.token)
		);
	};

	/*
		When clicking on the play area, the selected card is played (if there is one)
		Playing a card consists of removing it from the player's hand and adding it to the play area.
		Play area gets cleaned after 1 second.

	/* When a card enters the play area, resolve its effects */
	useEffect(() => {
		// prevent applyCardEffect from running when playedCard changes state
		// but it's not a valid card -> caused by react strict mode
		if (!playedCard) {
			return;
		}

		const applyCardEffect = async () => {
			const body = {
				content: {
					card_token: playedCard.card.token,
					id_player: idPlayer,
					target_id: playedCard.target,
					type: 'play_card',
				},
			};
			console.log('sending ', body);
			connection.send(JSON.stringify(body));
			cleanPlayArea();
			//
		};

		applyCardEffect();
		setDisplayCard(playedCard.card);
		// if card came from the deck this does nothing
		dispatch(removeFromHand(playedCard.card));

		setTimeout(() => {
			setDisplayCard('');
			dispatch(cleanPlayArea());
			dispatch(addToDiscardPile(playedCard.card));
		}, 500);
		dispatch(setAlreadyPlayed()); // update this when turn is over
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playedCard]);

	/*
		When clicking on the play area, the selected card is dispatched to the
		play area (if there is one).
		Cards played on the play area have no target, so target is set to -1.
	*/
	const handleClick = async () => {
		if (canPlayOnPlayArea()) {
			dispatch(addToPlayArea({card: selectedCard, target: -1}));
		}
	};

	// display card in play area. If card is empty, display nothing
	return (
		<Box
			w='100%'
			h='100%'
			className='play-area'
			data-testid='play-area'
			onClick={handleClick}
		>
			{displayCard && <Card info={displayCard} front={true} />}
		</Box>
	);
};

PlayArea.propTypes = {
	connection: PropTypes.shape({
		send: PropTypes.func.isRequired,
	}).isRequired,
};

export default PlayArea;
