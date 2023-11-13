import {Avatar, Text} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {addToPlayArea} from '../../appActions';

export const PlayerIcons = ({
	relativePositionToTable,
	players = [],
	currentPlayerId = 0,
}) => {
	const myPlayerId = JSON.parse(sessionStorage.getItem('player')).id;
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	const dispatch = useDispatch();

	const renderPlayer = (player) => {
		/* returns true if target is adjacent to current player, false otherwise  */
		const validTarget = (targetPlayer) => {
			const alivePlayers = players.filter((player) => player.is_alive);
			const adjacentPlayers = getAdjacentPlayers(alivePlayers, currentPlayerId);

			return (
				targetPlayer.id === adjacentPlayers[0].id||
				targetPlayer.id === adjacentPlayers[1].id
			)
		};

		/* if a player is clicked with a card selected the card is sent to the
		play area with the player clicked as the target */
		const handleClick = (player) => {
			if (selectedCard && validTarget(player)) {
				dispatch(addToPlayArea({card: selectedCard, target: player.id}));
			}
		};

		return (
			<button
				onClick={() => {
					handleClick(player);
				}}
			>
				<Avatar
					size='lg'
					key={player.id}
					color='white'
					bg={avatarColor(currentPlayerId, player)}
					border={myPlayerId === player.id ? '2px solid blue' : '0px'}
					data-testid={`player-${player.id}`}
				>
					<Text fontSize='xl'>{player.name}</Text>
				</Avatar>
			</button>
		);
	};

	if (relativePositionToTable === 0) {
		return <>{players.map((player) => renderPlayer(player))}</>;
	} else if (relativePositionToTable === 1) {
		return <>{players.map((player) => renderPlayer(player))}</>;
	} else if (relativePositionToTable === 2) {
		return <>{players.map((player) => renderPlayer(player))}</>;
	} else if (relativePositionToTable === 3) {
		return <>{players.map((player) => renderPlayer(player))}</>;
	}
	return null;
};

const getAdjacentPlayers = (alivePlayers, currentPlayerId) => {
	const length = alivePlayers.length;
	const currentPlayerIndex = alivePlayers.findIndex(
		(player) => player.id === currentPlayerId,
	);

	const adjacentLeft = alivePlayers[(currentPlayerIndex - 1 + length) % length];
	const adjacentRight = alivePlayers[(currentPlayerIndex + 1) % length];

	return [adjacentLeft, adjacentRight];
};

const avatarColor = (currentPlayerId, player) => {
	let bgColor = 'gray.900';

	if (currentPlayerId === player.id) {
		bgColor = 'teal.500';
	} else if (!player.is_alive) {
		bgColor = 'red.500';
	}
	return bgColor;
};

PlayerIcons.propTypes = {
	relativePositionToTable: PropTypes.number,
	players: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number,
			name: PropTypes.string,
			position: PropTypes.number,
			is_alive: PropTypes.bool,
		}),
	),
	currentPlayerId: PropTypes.number,
};

export default PlayerIcons;
