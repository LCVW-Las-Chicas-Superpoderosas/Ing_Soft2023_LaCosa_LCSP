//eslint-disable-next-line no-unused-vars
import React from 'react';
import {getByText, render, screen} from '@testing-library/react';
import {getByLabelText, prettyDOM} from '@testing-library/dom'; // fireEvent
// import {act} from 'react-dom/test-utils';
import UserForm from './UserForm';

// This test is just to make sure the component renders
test('renders UserForm component', () => {
	// rendering the component
	// render(<UserForm />);

	const {container} = render(<UserForm />);
	// console log the component tree to see what it looks like
	console.log(prettyDOM(container));
	// expect the component to be in the document
	expect(container).toBeTruthy();
	// check for the submit button and the label for the username
	getByText(container, 'Submit');
	getByLabelText(container, 'User Name');
	expect(screen.getByText('Submit')).toBeInTheDocument();
	expect(screen.getByLabelText('User Name')).toBeInTheDocument();
});
/*
test('renders correct fields', () => {
	const {getByLabelText, getByText} = render(<UserForm />);
	const usernameInput = getByLabelText('User Name');
	const submitButton = getByText('Submit');
	expect(usernameInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
	//expect(getByLabelText(/name/i)).toBeInTheDocument();
});

 test('onSubmit is called with correct values', () => {
	const onSubmit = jest.fn();

	act(() => {
		const {getByLabelText, getByText, contie} = render(<UserForm />);
        console.log(prettyDOM(container));

		const usernameInput = getByLabelText(/name/i);
		const submitButton = getByText(/submit/i);
		fireEvent.change(usernameInput, {target: {value: 'testuser'}});
		fireEvent.click(submitButton);
	});
	expect(onSubmit).toHaveBeenCalledWith({username: 'testuser'});
}); */

/* describe('UserForm', () => {
	it('renders the form and handles form submission', async () => {
		render(<UserForm />);

		// Find the form elements
		const usernameInput = screen.getByLabelText('User Name');
		const submitButton = screen.getByText('Submit');

		// Simulate user input
		fireEvent.change(usernameInput, {target: {value: 'testuser'}});

		// Check if the input value has changed
		expect(usernameInput.value).toBe('testuser');

		// Submit the form
		fireEvent.click(submitButton);

		// Wait for asynchronous operations (e.g., API calls) if any
		// In this case, you can mock the API call function and check if it's called
		// Example: await waitFor(() => expect(postUserData).toHaveBeenCalled());

		// Assert that the form submission function was called with the correct values
		// In this case, you can mock the API call function and check if it's called
		// with the expected data
		// Example: expect(postUserData).toHaveBeenCalledWith({ username: "testuser" });
	});

	it('displays an error message for a missing username', () => {
		render(<UserForm />);

		// Find the form elements
		const submitButton = screen.getByText('Submit');

		// Submit the form without entering a username
		fireEvent.click(submitButton);

		// Find the error message element
		const errorMessage = screen.getByText('this field is required');

		// Assert that the error message is displayed
		expect(errorMessage).toBeInTheDocument();
	}); 
}); */
