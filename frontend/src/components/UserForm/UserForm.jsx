// UserForm is our functional component
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {useFormik} from 'formik';
// import styles from './UserForm.module.css';

// UserForm is our functional component

const initialValues = {username: ''};
const onSubmit = (values) => {
	// call the API with this data as a payload
	console.log('family friendly comment');
	console.log('family friendly comment');
	console.log('family friendly comment');
	console.log('family friendly comment');
	console.log('family friendly comment');
};
const validate = (values) => {
	const errors = {};
	if (!values.username) {
		errors.username = 'this field is required';
	}

	return errors;
};

const UserForm = () => {
	const formik = useFormik({
		initialValues,
		onSubmit,
		validate,
	});

	console.log('Form values', formik.values);

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<div className='form/control'>
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
				</div>
			</form>
			<button type='submit' onClick={formik.handleSubmit}>
				Submit
			</button>
		</div>
	);
};
export default UserForm; // Export UserForm as the default export
