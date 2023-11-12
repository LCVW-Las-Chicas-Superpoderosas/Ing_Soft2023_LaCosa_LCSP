/* eslint-disable camelcase */

import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Box, Text, Button} from '@chakra-ui/react';
import {useSelector} from 'react-redux';
import Hand from '../Hand/Hand';

// eslint-disable-next-line no-unused-vars
const response_mock = {
	under_attack: 1,
	attack_type: 'Cambio de Lugar',
	has_defense: ['img.71', 'img.72'],
	attacker_name: 'pepe',
};

const Defense = ({connection}) => {
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const response = useSelector((state) => state.playArea.response);
	const selectedCard = useSelector((state) => state.hand.selectedCard);
	console.log('reading selectedCard from state', selectedCard);
	console.log('reading response from state');
	console.log(response);

	const Play = async () => {
		if (connection) {
			if (response) {
				const bodyTosend = {
					content: {
						id_player: idPlayer,
						type: 'defense',
						card_token: selectedCard.token,
						target_id: response.attacker_id,
					},
				};

				console.log('sending ', JSON.stringify(bodyTosend));
				connection.send(JSON.stringify(bodyTosend));
			}
		}
	};
	let attacker_name = ''; // Declare attacker_name outside the if block
	const imgSrc = ''; // Declare imgSrc outside the if block
	let expr = ''; // Declare expr outside the if block

	if (response !== null) {
		console.log('reading response from state in the if', response);
		attacker_name = response.attacker_name;
		console.log('attacker name is ', attacker_name);
		console.log('imgSrc is ', imgSrc);
		expr = response.card_being_played;
		console.log('expr is ', expr);
	}

	return response ? (
		<Box textAlign='center'>
			<Text color='whatsapp.700' fontSize='md' fontWeight='bold' mb={5}>
				{`El jugador ${attacker_name} jugó la carta ${expr} contra ti`}
			</Text>

			<Hand />
			<Button colorScheme='blue' mr={3} onClick={Play}>
				Jugar carta
			</Button>
		</Box>
	) : (
		<Text color='whatsapp.700' fontSize='md' fontWeight='bold' mb={5}>
			The defense card information is not available
		</Text>
	);
};

Defense.propTypes = {
	connection: PropTypes.shape({
		send: PropTypes.func.isRequired,
	}).isRequired,
};

export default Defense;
