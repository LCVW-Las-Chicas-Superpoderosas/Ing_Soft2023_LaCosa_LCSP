// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Textarea, Card, Flex, Button, Box, FormControl} from '@chakra-ui/react';
import {useFormik} from 'formik';

export const Chat = () => {
	const [messages, setMessages] = useState([]);
	const initialValues = {message: ''};
	// add the data of sessionStorage of the Player name and id maybe

	const onSubmit = /* async */ (values) => {
		setMessages([...messages, values.message]);
		// here it goes the send of the text to the back
		formik.resetForm();
	};
	const handleEnterPress = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onSubmit(formik.values);
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

export default Chat;
