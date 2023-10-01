import {useFormik} from 'formik';
import {useSelector} from 'react-redux';
import {Flex, Button} from '@chakra-ui/react';
import {CreateGame} from '../request/createGame';

const CreateGameForm = () => {
	const userId = useSelector((state) => state.player.id);
	const initialValues = {GameName: ''};
	const onSubmit = async (values) => {
		// call the API with this data as a payload
		console.log('family friendly comment');
		console.log({values, userId});

		const Game = {
			id_player: userId,
			name: values.GameName,
			//password: 'elpepe',
			min_players: 4,
			max_players: 12,
		};
		// en este sprint min_players: 4, max_players: 12, esta harcodeado pero en proximos lo agregamos
		const resp = await CreateGame({game: Game});
		console.log(resp);

		console.log('family friendly comment');
	};
	const validate = (values) => {
		const errors = {};
		if (!values.GameName) {
			errors.username = 'this field is required';
		}

		return errors;
	};

	const formik = useFormik({
		initialValues,
		onSubmit,
		validate,
	});

	console.log('Form values', formik.values);

	return (
		<Flex h='100vh' justifyContent='center' alignItems='center'>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='form/control'>
						<h1>Crear una partida nueva</h1>
						<label htmlFor='GameName'>Choose a name for the game</label>
						<input
							type='text'
							id='GameName'
							name='GameName'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.username}
						/>
						{formik.errors.username ? (
							<div className='error'> {formik.errors.username}</div>
						) : null}
					</div>
				</form>
				<Button
					px={4}
					fontSize={'sm'}
					rounded={'full'}
					bg={'blue.400'}
					color={'white'}
					boxShadow={
						'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
					}
					_hover={{
						bg: 'blue.500',
					}}
					_focus={{
						bg: 'blue.500',
					}}
					type='submit'
					onClick={formik.handleSubmit}
				>
					Submit
				</Button>
			</div>
		</Flex>
	);
};
export default CreateGameForm; // Export CreateGameForm as the default export
