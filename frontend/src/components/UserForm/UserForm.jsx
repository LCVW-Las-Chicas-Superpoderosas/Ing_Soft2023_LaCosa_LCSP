import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {setPlayerId, setPlayerName, setPlayerLogedIn} from '../../appActions';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link} from 'react-router-dom';
import sendPlayerName from '../request/sendPlayerName';
// import SendPlayerName from '../request/sendPlayerName.mock';

// UserForm is our functional component
const UserForm = () => {
	const dispatch = useDispatch();
	const firstPlayer = useSelector((state) => state.player);
	const initialValues = {username: ''};

	const onSubmit = async (values) => {
		const actualPlayer = {name: values.username, id: 0};
		try {
			const resp = await sendPlayerName({player: actualPlayer});
			const updatedPlayer = {name: resp.name, id: resp.id};
			dispatch(setPlayerId(updatedPlayer.id));
			dispatch(setPlayerName(updatedPlayer.name));
			dispatch(setPlayerLogedIn(true));
			alert('Succes: ' + resp.detail);
		} catch (error) {
			// The status code is missing in the response
			console.error('Error: ' + error);
			if (!error.ok) {
				alert(error.detail);
			}
			formik.resetForm();
		}
		formik.resetForm();
	};

	const validate = (values) => {
		const errors = {};
		if (!values.username) {
			errors.username = 'this field is required';
		}
		return errors;
	};
	const formik = useFormik({
		initialValues,
		onSubmit,
		validate,
	});
	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				{!firstPlayer.loged ? (
					<div className='form/control'>
						<h1>Choose a nickname </h1>
						<label htmlFor='username'>User Name</label>
						<input
							type='text'
							id='username'
							name='username'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.username}
						/>
						{formik.errors.username ? (
							<div className='error'> {formik.errors.username}</div>
						) : null}
						<button type='submit' onClick={formik.handleSubmit}>
							Submit
						</button>
					</div>
				) : (
					<div>
						<Link to='Games/'>
							<button>Unirse a partida</button>
						</Link>
						<Link to='/CreateGame'>
							<button>Crear nueva partida</button>
						</Link>
					</div>
				)}
			</form>
		</div>
	);
};
export default UserForm; // Export UserForm as the default export
