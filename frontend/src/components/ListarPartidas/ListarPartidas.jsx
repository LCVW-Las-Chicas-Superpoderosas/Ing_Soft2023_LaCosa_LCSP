import {VStack, Button} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

const partidas = [
	{nombre: 'Partida-Inicial'},
	// Otras partidas...
];

const handleUnirse = () => {
	console.log('me clickearon');
};

const ListarPartidas = () => {
	return (
		<VStack spacing={4}>
			{partidas.map((partida, index) => (
				<div key={index}>
					<span>{partida.nombre}</span>
					<Link to='/Games/Partida-Inicial'>
						<Button
							colorScheme='teal'
							size='sm'
							onClick={() => handleUnirse(partida.id)}
						>
							Unirse
						</Button>
					</Link>
				</div>
			))}
		</VStack>
	);
};

export default ListarPartidas;
