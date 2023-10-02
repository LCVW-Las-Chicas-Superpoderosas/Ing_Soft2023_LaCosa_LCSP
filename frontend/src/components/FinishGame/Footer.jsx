// eslint-disable-next-line no-unused-vars
import React from 'react';
import {CardFooter, Button} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
export const GoHome = () => {
	return (
		<CardFooter>
			<Link to='/'>
				<Button colorScheme='blackAlpha'>Play Again</Button>
			</Link>
			{/* Should have the Button to go to the home page */}
		</CardFooter>
	);
};
export default GoHome;
