// this component is used to finish a game and show who won
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Center, Card} from '@chakra-ui/react';
import {GameHistory} from '../components/FinishGame/GameHistory';
import GoHome from '../components/FinishGame/Footer';

export const FinishGame = () => {
	return (
		<Center>
			<Card colorScheme='transparent' variant='outline'>
				<GameHistory />
				<GoHome />
			</Card>
		</Center>
	);
};

export default FinishGame;
