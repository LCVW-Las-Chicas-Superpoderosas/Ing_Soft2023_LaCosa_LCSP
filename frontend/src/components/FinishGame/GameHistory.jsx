// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Card, Heading, CardBody, Box, Text} from '@chakra-ui/react';
// import {useSelector} from 'react-redux';
// List of 12 players
const longListOfPlayers = [
	{name: 'player1', id: 1, isAlive: true},
	{name: 'player2', id: 2, isAlive: false},
	{name: 'player3', id: 3, isAlive: false},
	{name: 'player4', id: 4, isAlive: false},
	{name: 'player5', id: 5, isAlive: false},
	{name: 'player6', id: 6, isAlive: false},
	{name: 'player7', id: 7, isAlive: false},
	{name: 'player8', id: 8, isAlive: false},
	{name: 'player9', id: 9, isAlive: false},
	{name: 'player10', id: 10, isAlive: false},
	{name: 'player11', id: 11, isAlive: false},
	{name: 'player12', id: 12, isAlive: false},
];
/* 
const listOfPlayers = [
	{name: 'pepe', id: 1, isAlive: false},
	{name: 'santi', id: 2, isAlive: false},
	{name: 'martin', id: 3, isAlive: false},
	{name: 'juan', id: 4, isAlive: true},
];
 */
export const GameHistory = () => {
	// const state = useSelector((state) => state);

	return (
		<Card display='flex'>
			<Heading as='h1' noOfLines={1}>
				Game Over
			</Heading>
			<Heading as='h2' noOfLines={1}>
				Results
			</Heading>
			<CardBody>
				{longListOfPlayers.map((player) => {
					return player.isAlive ? (
						<Box key={player.id}>
							<Heading size='xs'>{player.name}</Heading>
							<Text>Won the game.</Text>
						</Box>
					) : (
						<Box key={player.id}>
							<Heading size='xs'>{player.name}</Heading>
							<Text>Failed to his team.</Text>
						</Box>
					);
				})}
			</CardBody>
		</Card>
	);
};
export default GameHistory;
