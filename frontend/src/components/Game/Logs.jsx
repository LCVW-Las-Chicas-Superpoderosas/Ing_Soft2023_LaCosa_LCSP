// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Text, Card, Flex, Box} from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const Logs = ({connection}) => {
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		if (connection) {
			connection.onmessage = function (event) {
				const message = JSON.parse(event.data);
				console.log('In message, recieved a messasge:', message);
				if (message.data.type === 'log_message') {
					setMessages([...messages, message.data.message]);
				}
			};
		}
	}, [connection, messages]);

	return (
		<Card>
			<Flex direction='column'>
				<Text bg='green.200' borderColor='green' border='2px'>
					Logs
				</Text>
				<Box h='720px' overflowY='scroll' bg='green.300'>
					{messages.map((msg, index) => (
						<div key={index}>{msg}</div>
					))}
				</Box>
			</Flex>
		</Card>
	);
};

Logs.propTypes = {
	connection: PropTypes.instanceOf(WebSocket),
};
export default Logs;
