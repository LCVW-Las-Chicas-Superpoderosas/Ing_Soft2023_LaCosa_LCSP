// Example using Jest and React Testing Library
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
	it('should render image with correct source', () => {
		const {getByAltText} = render(<Card token={'img22'} />);

		// Assert that the image source is correct
		expect(getByAltText('card').src).toContain(`/src/assets/cards/img22.jpg`);
	});

	it('should call onClick handler when card is clicked', () => {
		// create a mock function to act as the onClick handler
		const mockClickHandler = jest.fn();

		// render the Card component, with the mocked onClick handler
		const {getByAltText} = render(
			<Card token='someToken' onClick={mockClickHandler} />,
		);

		// simulate a user clicking on the card
		fireEvent.click(getByAltText('card'));

		// assert that the mock handler was called exactly once
		expect(mockClickHandler).toHaveBeenCalledTimes(1);
	});
});
