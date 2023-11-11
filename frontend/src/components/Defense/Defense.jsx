/* eslint-disable camelcase */

import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Box, Image, Text, Button} from '@chakra-ui/react';
import {useSelector} from 'react-redux';

// eslint-disable-next-line no-unused-vars
const response_mock = {
	under_attack: 1,
	attack_type: 'Cambio de Lugar',
	has_defense: 'img.71',
	attacker_name: 'pepe',
};

const Defense = ({connection}) => {
	const idPlayer = JSON.parse(sessionStorage.getItem('player')).id;
	const response = useSelector((state) => state.playArea.response);

	const Play = async () => {
		if (connection) {
			if (response) {
				const bodyTosend = {
					idPlayer,
					type: 'defense',
					playedCard: response.has_defense,
					targetId: response.attacker.id,
				};

				connection.send(JSON.stringify(bodyTosend));
			}
		}
	};
	const attacker_name = response.attacker.name;
	const imgSrc = response.has_defense;
	const expr = response.attack_type;

	return (
		<Box textAlign='center'>
			<Text color='whatsapp.700' fontSize='md' fontWeight='bold' mb={5}>
				{`El jugador ${attacker_name} jugó la carta ${expr} contra ti`}
			</Text>
			<Image
				src={`http://localhost:5173/src/assets/cards/${imgSrc}`}
				alt={`Defense for ${expr}`}
				boxSize='400px' // Adjust the size as needed
				objectFit='contain' // You can use other values like 'contain' or 'fill' based on your preference
			/>
			<Button colorScheme='blue' mr={3} onClick={Play}>
				Jugar carta
			</Button>
		</Box>
	);
};

Defense.propTypes = {
	connection: PropTypes.shape({
		send: PropTypes.func.isRequired,
	}).isRequired,
};

export default Defense;
