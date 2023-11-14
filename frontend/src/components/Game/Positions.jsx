import {Flex} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import PlayerIcons from './PlayerIcons';
import {usePlayers} from '../../customHooks/usePlayers';

export const Positions = ({relativePositionToTable}) => {
	const {players, currentPlayerId} = usePlayers();
	const bounds = getBoundsPlayerDistribution(players);
	if (relativePositionToTable === 0 || relativePositionToTable === 2) {
		if (relativePositionToTable === 0) {
			return (
				<Flex justify='center' justifyContent='space-evenly' direction='row'>
					<PlayerIcons
						relativePositionToTable={relativePositionToTable}
						players={players.slice(bounds[0].from, bounds[0].until)}
						currentPlayerId={currentPlayerId}
					/>
				</Flex>
			);
		} else {
			return (
				<Flex justify='center' justifyContent='space-evenly' direction='row'>
					<PlayerIcons
						relativePositionToTable={relativePositionToTable}
						players={[
							...players.slice(bounds[2].from, bounds[2].until),
						].reverse()}
						currentPlayerId={currentPlayerId}
					/>
				</Flex>
			);
		}
	} else {
		if (relativePositionToTable === 1) {
			return (
				<Flex
					height='100%'
					direction='column'
					justify='center'
					alignItems='center'
					justifyContent='space-evenly'
				>
					<PlayerIcons
						relativePositionToTable={relativePositionToTable}
						players={[
							...players.slice(bounds[1].from, bounds[1].until),
						].reverse()}
						currentPlayerId={currentPlayerId}
					/>
				</Flex>
			);
		} else {
			return (
				<Flex
					height='100%'
					direction='column'
					justify='center'
					alignItems='center'
					justifyContent='space-evenly'
				>
					<PlayerIcons
						relativePositionToTable={relativePositionToTable}
						players={players.slice(bounds[3].from, bounds[3].until)}
						currentPlayerId={currentPlayerId}
					/>
				</Flex>
			);
		}
	}
};

Positions.propTypes = {
	relativePositionToTable: PropTypes.number,
};

function getBoundsPlayerDistribution(players) {
	const firstBound = Math.floor(players.length / 4);
	const secondBound = Math.floor((players.length - firstBound) / 3);
	const thirdBound = Math.floor(
		(players.length - firstBound - secondBound) / 2,
	);
	const fourthBound = Math.floor(
		players.length - firstBound - secondBound - thirdBound,
	);
	return [
		{from: 0, until: firstBound},
		{from: secondBound, until: secondBound + firstBound},
		{
			from: secondBound + firstBound,
			until: thirdBound + secondBound + firstBound,
		},
		{
			from: thirdBound + secondBound + firstBound,
			until: fourthBound + thirdBound + secondBound + firstBound,
		},
	];
}

export default Positions;
