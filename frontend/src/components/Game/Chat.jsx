// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Textarea, Card, Flex, Button, Box, FormControl} from '@chakra-ui/react';
import {useFormik} from 'formik';
import PropTypes from 'prop-types';

export const Chat = ({connection}) => {
	const [messages, setMessages] = useState([]);
	const initialValues = {message: ''};
	const playerId = JSON.parse(sessionStorage.getItem('player')).id;
	useEffect(() => {
		if (connection) {
			connection.onmessage = function (event) {
				const message = JSON.parse(event.data);
				console.log('In message, recieved a messasge:', message);
				if (message.data.type === 'chat_message') {
					console.log('Recieved a message: ', message.data);
					setMessages([...messages, message.data.message]);
				}
			};
		}
	}, [connection, messages]);
	const onSubmit = async (values) => {
		if (connection) {
			const chatMessage = {
				content: {
					type: 'chat_message',
					chat_message: values.message,
					id_player: playerId,
				},
			};
			// console.log('Sending a message: ', JSON.stringify(chatMessage));
			connection.send(JSON.stringify(chatMessage));
		}
		formik.resetForm();
	};
	const handleEnterPress = async (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			await onSubmit(formik.values);
		}
	};
	const formik = useFormik({
		initialValues,
		onSubmit,
	});
	return (
		<Card>
			<Flex direction='column'>
				<Box h='600px' overflowY='scroll' bg='blackAlpha.700'>
					{messages.map((msg, index) => (
						<div key={index}>{msg}</div>
					))}
				</Box>
				<form onSubmit={formik.handleSubmit}>
					<FormControl>
						<Textarea
							bg='blackAlpha.700'
							name='message'
							placeholder='Type a message'
							h='110px'
							onKeyDown={handleEnterPress}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.message}
						></Textarea>
					</FormControl>
					<Flex justify='end' h='90px'>
						<Button
							type='submit'
							size='lg'
							justifyContent='center'
							onClick={formik.handleSubmit}
						>
							Send
						</Button>
					</Flex>
				</form>
			</Flex>
		</Card>
	);
};

Chat.propTypes = {
	connection: PropTypes.instanceOf(WebSocket),
};
export default Chat;
