import {
	VStack,
	Button,
	OrderedList,
	ListItem,
	//ChakraProvider,
} from '@chakra-ui/react';
//import {Link} from 'react-router-dom';
import getLobbyStatus from '../request/getLobyStatus';
//import {useSelector} from 'react-redux';

// mock respuestas por ahora
const resp1 = {
	players: [
		{user_name: 'pepe', id: 1, is_host: 1},
		{user_name: 'papa', id: 2, is_host: 0},
		{user_name: 'pupu', id: 3, is_host: 0},
		{user_name: 'pipi', id: 4, is_host: 0},
	],
	can_start: 1,
};
/* const resp2 = {
	players: [
		{user_name: 'pepe', id: 1, is_host: 1},
		{user_name: 'papa', id: 2, is_host: 0},
		{user_name: 'pupu', id: 3, is_host: 0},
		{user_name: 'pipi', id: 4, is_host: 0},
	],
	can_start: 0,
}; */

const Lobby = () => {
	// request
	// const userId = useSelector((state) => state.player.id);
	const userId = 1;

	/* 	const isHost = () => {
		const isHost = resp1.players.find((player) => player.is_host === 1);
		const userId = useSelector((state) => state.player.id);

		return userId === isHost.player.id;
	}; */

	const resp = getLobbyStatus(userId);

	console.log('aca deberia handelear', {resp});
	const isHost = true;

	const onClick = () => {
		console.log('me clickearon uwu');
	};
	console.log(isHost);
	return (
		<VStack spacing={4}>
			<h2>Players:</h2>

			<OrderedList>
				{resp1.players.map((player, index) => (
					<div key={index}>
						<ListItem> {player.user_name}</ListItem>
					</div>
				))}
			</OrderedList>

			{isHost ? (
				/* //<Link to='/Games/Partida-inicial/play'> */
				<Button onClick={onClick}>Begin</Button>
			) : /* //</Link> */
			null}
		</VStack>
	);
};
export default Lobby;
