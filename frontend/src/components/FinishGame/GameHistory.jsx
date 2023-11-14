// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Card, Heading, CardBody, Box, Text} from '@chakra-ui/react';

import {useSelector} from 'react-redux';
export const GameHistory = () => {
	const gameStatus = useSelector((state) => state.game);
	const players = gameStatus ? gameStatus.players : null;
	// Check if the players array inside results is empty
	if (players.length === 0) {
		return (
			<Card>
				<Heading as='h1' noOfLines={1}>
					Game Over
				</Heading>
				<Heading as='h2' noOfLines={1}>
					Results
				</Heading>
				<CardBody>
					<Box>
						<Heading size='xs'>Invalid Results</Heading>
						<Text>There is no data to show</Text>
					</Box>
				</CardBody>
			</Card>
		);
	}
	// revisar la funcionalidad que checkea que todos estan vivos o muertos
	const allStatusEndGame = players.map((player) => player.is_alive);
	const invalidResult = checkAllSameStatus(allStatusEndGame);
	function orderPlayers(players) {
		// Create a copy of the players array
		const copyOfPlayers = [...players];
		const sortedPlayers = copyOfPlayers.sort((a, b) => {
			return a.id - b.id;
		});
		return sortedPlayers;
	}
	const OrderPlayers = orderPlayers(players);
	if (!invalidResult) {
		return (
			<Card display='flex'>
				<Heading as='h1' noOfLines={1} textAlign='center'>
					Game Over
				</Heading>
				<Heading as='h2' noOfLines={1} textAlign='center'>
					Results
				</Heading>
				<CardBody>
					{OrderPlayers?.map((player) => {
						return player.is_alive ? (
							<Box key={player.id}>
								<Heading textAlign='center' bg='green.200' size='xs'>
									Player {player.name}
								</Heading>
								<Text textAlign='center' bg='green.200'>
									Won the game.
								</Text>
							</Box>
						) : (
							<Box key={player.id}>
								<Heading textAlign='center' bg='red.200' size='xs'>
									Player {player.name}
								</Heading>
								<Text textAlign='center' bg='red.200'>
									Failed to his team.
								</Text>
							</Box>
						);
					})}
				</CardBody>
			</Card>
		);
	} else {
		return (
			<Card display='flex'>
				<Heading as='h1' noOfLines={1}>
					Game Over
				</Heading>
				<CardBody>
					<Box>
						<Heading size='xs'>Invalid Results</Heading>
						<Text>There is no data to show</Text>
					</Box>
				</CardBody>
			</Card>
		);
	}

	function checkAllSameStatus(array) {
		return array.every((value) => value === array[0]);
	}
};
